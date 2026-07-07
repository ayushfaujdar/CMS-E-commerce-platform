import 'dotenv/config';
import { createApp } from './app.js'; // Trigger nodemon restart
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_store';

async function start() {
  try {
    await connectDB(MONGODB_URI);
    const app = createApp();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
