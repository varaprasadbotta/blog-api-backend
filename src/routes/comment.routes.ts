import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/:postId', protect, commentController.addComment);
router.get('/:postId', commentController.getCommentsByPost);
router.delete('/:id', protect, commentController.deleteComment);

export default router;
