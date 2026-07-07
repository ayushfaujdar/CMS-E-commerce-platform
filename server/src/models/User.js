import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' },
    phone: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [addressSchema],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        size: String,
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model('User', userSchema);
