const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Initialize counters if they don't exist
const Counter = require('./models/Counter');
const initializeCounters = async () => {
    const models = ['User', 'Post', 'Pet'];
    for (const model of models) {
        await Counter.findByIdAndUpdate(
            model,
            {},
            { upsert: true, setDefaultsOnInsert: true }
        );
    }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-admin')
  .then(() => {
    console.log('Connected to MongoDB');
    initializeCounters();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
