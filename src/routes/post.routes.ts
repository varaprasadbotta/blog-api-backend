import { Router } from 'express';
import { createPost } from '../controllers/post.controller';
import { protect } from '../middleware/authMiddleware';
import * as postController from '../controllers/post.controller';

const router = Router();

router.post('/', protect, createPost);
router.get('/', postController.getAllPosts);
router.get('/me', protect, postController.getMyPosts);
router.get('/:slug', postController.getPostBySlug);

router.patch('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);
router.patch('/:id/like', protect, postController.toggleLike);

export default router;
