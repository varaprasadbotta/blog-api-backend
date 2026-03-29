import { Request, Response } from 'express';
import * as commentService from '../services/comment.service';

export const addComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.addCommentService(
      req.params.postId as string,
      req.user!.id.toString(),
      req.body.content,
    );

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { comments, total } = await commentService.getCommentsByPostService(
      req.params.postId as string,
      page,
      limit,
    );

    res.json({
      success: true,
      total,
      page,
      limit,
      data: comments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    await commentService.deleteCommentService(
      req.params.id as string,
      req.user!.id.toString(),
      req.user!.role,
    );

    res.json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};
