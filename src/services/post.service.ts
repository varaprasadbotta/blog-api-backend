import Post from '../models/post.model';
import { Types } from 'mongoose';

interface CreatePostInput {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  userId: Types.ObjectId;
  role: string;
}

export const createPostService = async (data: CreatePostInput) => {
  const { role, userId, title, content, excerpt, coverImage, tags, published } =
    data;

  // Role validation
  if (role !== 'author' && role !== 'admin') {
    throw new Error('Not authorized to create post');
  }

  const post = await Post.create({
    title,
    content,
    excerpt,
    coverImage,
    tags,
    published,
    author: userId,
  });

  return post;
};

export const getAllPostsService = async (
  page: number,
  limit: number,
  tag?: string,
  author?: string,
  search?: string,
) => {
  const query: any = { published: true };

  if (tag) query.tags = tag;
  if (author) query.author = author;
  if (search) query.title = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .populate('author', 'name email avatar')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Post.countDocuments(query);

  return { posts, total };
};

export const getPostBySlugService = async (slug: string) => {
  const post = await Post.findOne({ slug }).populate(
    'author',
    'name email avatar',
  );

  if (!post) throw new Error('Post not found');

  return post;
};

export const updatePostService = async (
  postId: string,
  userId: string,
  role: string,
  updateData: any,
) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error('Post not found');

  if (post.author.toString() !== userId && role !== 'admin') {
    throw new Error('Not authorized');
  }

  Object.assign(post, updateData);

  await post.save();

  return post;
};

export const deletePostService = async (
  postId: string,
  userId: string,
  role: string,
) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error('Post not found');

  if (post.author.toString() !== userId && role !== 'admin') {
    throw new Error('Not authorized');
  }

  await post.deleteOne();

  return true;
};

export const toggleLikeService = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error('Post not found');

  const userObjectId = new Types.ObjectId(userId);

  const alreadyLiked = post.likes.includes(userObjectId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(userObjectId);
  }

  await post.save();

  return post.likes.length;
};

export const getMyPostsService = async (userId: string) => {
  return Post.find({ author: userId }).sort({ createdAt: -1 });
};
