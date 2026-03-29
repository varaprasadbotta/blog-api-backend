import User from '../models/user.model';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { Roles } from '../models/user.model';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = refreshToken;

  await User.findByIdAndUpdate(user._id, { refreshToken });

  //await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = refreshToken;
  //await user.save();
  await User.findByIdAndUpdate(user._id, { refreshToken });

  return { user, accessToken, refreshToken };
};
