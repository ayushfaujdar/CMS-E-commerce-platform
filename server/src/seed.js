import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import Notification from './models/Notification.js';

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const img = (seed) => `https://picsum.photos/seed/${seed}/600/800`;

const categories = [
  { name: 'T-Shirts', description: 'Casual & graphic tees' },
  { name: 'Shirts', description: 'Formal and casual shirts' },
  { name: 'Jeans', description: 'Denim for every fit' },
  { name: 'Dresses', description: 'Everyday and occasion dresses' },
  { name: 'Footwear', description: 'Sneakers, heels and more' },
  { name: 'Accessories', description: 'Bags, belts and watches' },
];

const productsByCategory = {
  'T-Shirts': [
    { name: 'Classic Cotton Tee', price: 599, gender: 'unisex' },
    { name: 'Oversized Graphic Tee', price: 899, gender: 'men', discountPercent: 20 },
    { name: 'V-Neck Slim Fit Tee', price: 699, gender: 'women' },
  ],
  Shirts: [
    { name: 'Linen Casual Shirt', price: 1499, gender: 'men', discountPercent: 10 },
    { name: 'Floral Print Shirt', price: 1299, gender: 'women' },
  ],
  Jeans: [
    { name: 'Slim Fit Blue Jeans', price: 1999, gender: 'men', discountPercent: 25 },
    { name: 'High-Waist Skinny Jeans', price: 2199, gender: 'women' },
  ],
  Dresses: [
    { name: 'Floral Summer Dress', price: 1799, gender: 'women', discountPercent: 15, isFeatured: true },
    { name: 'Bodycon Party Dress', price: 2499, gender: 'women', isFeatured: true },
  ],
  Footwear: [
    { name: 'Running Sneakers', price: 2999, gender: 'unisex', discountPercent: 30, isFeatured: true },
    { name: 'Block Heel Sandals', price: 1899, gender: 'women' },
  ],
  Accessories: [
    { name: 'Leather Crossbody Bag', price: 2499, gender: 'women', isFeatured: true },
    { name: 'Minimalist Wristwatch', price: 3499, gender: 'unisex', discountPercent: 10 },
  ],
};

async function run() {
  await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_store');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const admin = new User({ name: 'Store Admin', email: 'admin@fashion.com', role: 'admin' });
  await admin.setPassword('admin123');
  await admin.save();

  const customer = new User({ name: 'Demo Customer', email: 'demo@fashion.com' });
  await customer.setPassword('demo123');
  await customer.save();
  console.log('Created users (admin@fashion.com/admin123, demo@fashion.com/demo123)');

  const catDocs = {};
  for (const c of categories) {
    const doc = await Category.create({ ...c, slug: slugify(c.name), image: img(c.name) });
    catDocs[c.name] = doc;
  }
  console.log(`Created ${categories.length} categories`);

  const sizesByCat = {
    Footwear: ['6', '7', '8', '9', '10'],
    Accessories: ['One Size'],
  };
  const colors = ['Black', 'White', 'Blue', 'Red', 'Beige'];

  let count = 0;
  for (const [catName, items] of Object.entries(productsByCategory)) {
    for (const item of items) {
      await Product.create({
        ...item,
        slug: slugify(`${item.name}-${count}`),
        description: `${item.name} — premium quality fashion essential. Comfortable, durable and stylish.`,
        brand: ['Zara', 'H&M', 'Levis', 'Nike', 'Uniqlo'][count % 5],
        category: catDocs[catName]._id,
        sizes: sizesByCat[catName] || ['S', 'M', 'L', 'XL'],
        colors: colors.slice(0, 3),
        images: [img(`${item.name}1`), img(`${item.name}2`)],
        countInStock: 25 + (count % 5) * 10,
        tags: [catName.toLowerCase(), item.gender],
      });
      count += 1;
    }
  }
  console.log(`Created ${count} products`);

  await Coupon.create([
    { code: 'WELCOME10', description: '10% off your first order', discountPercent: 10, minOrder: 0 },
    { code: 'FASHION25', description: '25% off orders above ₹2000', discountPercent: 25, minOrder: 2000 },
  ]);
  console.log('Created coupons (WELCOME10, FASHION25)');

  await mongoose.disconnect();
  console.log('Seed complete');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
