const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from config.env
dotenv.config({ path: path.resolve(__dirname, 'config.env') });

// Ensure MONGO_URI is provided
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in config.env");
  process.exit(1); // Stop app if no DB URL
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('MongoDB connected successfully');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

module.exports = mongoose;
