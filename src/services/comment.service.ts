import Comment from '../models/comment.model';
import Post from '../models/post.model';

export const addCommentService = async (
  postId: string,
  userId: string,
  content: string,
) => {
  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const comment = await Comment.create({
    content,
    author: userId,
    post: postId,
  });

  return comment;
};

export const getCommentsByPostService = async (
  postId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ post: postId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({ post: postId });

  return { comments, total };
};

export const deleteCommentService = async (
  commentId: string,
  userId: string,
  role: string,
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.author.toString() !== userId && role !== 'admin') {
    throw new Error('Not authorized');
  }

  await comment.deleteOne();

  return true;
};
