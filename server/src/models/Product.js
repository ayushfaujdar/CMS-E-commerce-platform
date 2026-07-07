import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    brand: { type: String, default: 'Generic' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 90 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    countInStock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.virtual('finalPrice').get(function finalPrice() {
  return Math.round(this.price * (1 - this.discountPercent / 100));
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
