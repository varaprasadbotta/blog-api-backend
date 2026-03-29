import { Request, Response } from 'express';
import { createPostService } from '../services/post.service';
import * as postService from '../services/post.service';

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await createPostService({
      ...req.body,
      userId: req.user!.id,
      role: req.user!.role,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { tag, author, search } = req.query;

    const { posts, total } = await postService.getAllPostsService(
      page,
      limit,
      tag as string,
      author as string,
      search as string,
    );

    res.json({
      success: true,
      total,
      page,
      limit,
      data: posts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const post = await postService.getPostBySlugService(
      req.params.slug as string,
    );

    res.json({ success: true, data: post });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const post = await postService.updatePostService(
      req.params.id as string,
      req.user!.id.toString(),
      req.user!.role,
      req.body,
    );

    res.json({ success: true, data: post });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await postService.deletePostService(
      req.params.id as string,
      req.user!.id.toString(),
      req.user!.role,
    );

    res.json({ success: true, message: 'Post deleted' });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const likesCount = await postService.toggleLikeService(
      req.params.id as string,
      req.user!.id.toString(),
    );

    res.json({ success: true, likesCount });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getMyPostsService(req.user!.id.toString());

    res.json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
