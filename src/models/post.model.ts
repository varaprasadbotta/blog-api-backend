import mongoose, { Schema, model, Document, Types } from 'mongoose';
import slugify from 'slugify';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  tags: string[];
  published: boolean;
  readingTime: number;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 50,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 200,
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number,
    },
  },
  { timestamps: true },
);

postSchema.pre('save', function (next) {
  // Generate slug
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Calculate reading time (200 words per minute)
  const words = this.content.split(' ').length;
  this.readingTime = Math.ceil(words / 200);
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
