import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan('dev'));

// Body parser
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Blog API running 🚀',
  });
});

// Routes
app.use('/api/auth', authRoutes);

// Routes post
app.use('/api/posts', postRoutes);

// Routes Comments
app.use('/api/comments', commentRoutes);

// Global fallback route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
