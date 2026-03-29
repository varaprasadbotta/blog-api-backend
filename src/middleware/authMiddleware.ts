import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as {
      id: string;
    };

    // ✅ PASTE HERE
    console.log('Decoded token:', decoded);
    console.log('Looking for user id:', decoded.id);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found, not authorized',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token failed',
    });
  }
};
