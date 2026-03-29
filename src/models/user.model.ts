import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface Iuser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  isVerified: boolean;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const Roles = {
  USER: 'user',
  AUTHOR: 'author',
  ADMIN: 'admin',
} as const;

const userSchema: Schema<Iuser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minLength: 3,
      maxLength: 25,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.USER,
    },
    avatar: {
      type: String,
      default:
        'https://img.freepik.com/free-vector/smiling-redhaired-boy-illustration_1308-176664.jpg?semt=ais_incoming&w=740&q=80',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<Iuser>('save', async function () {
  if (this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<Iuser>('User', userSchema);
export default User;
