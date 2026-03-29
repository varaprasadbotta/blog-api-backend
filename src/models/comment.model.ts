import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 500,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true },
);
const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
