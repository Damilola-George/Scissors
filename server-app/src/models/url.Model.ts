import mongoose, { Document, Schema } from 'mongoose';

export interface IURL extends Document {
  originalUrl: string;
  shortUrl: string;
  customUrl?: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const urlSchema = new Schema<IURL>(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    customUrl: { type: String, unique: true, sparse: true }, 
    clicks: { type: Number, default: 0 },
  },
  {
    timestamps: true, 
  }
);

// Indexes Added for better query performance
urlSchema.index({ shortUrl: 1 });
urlSchema.index({ customUrl: 1 });

const UrlModel = mongoose.model<IURL>('URL', urlSchema);

export default UrlModel;