import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.registerUser(name, email, password, role);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    //console.error('Auth error:', error.message); // ✅ add this
    return res.status(401).json({
      success: false,
      message: 'Token failed',
    });
  }
};
