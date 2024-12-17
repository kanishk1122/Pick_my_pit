const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/users');
const morgan = require('morgan');
const cors = require('cors');
const CookieParser = require('cookie-parser');
const mailer = require('./mailer/mailer');

//limit for image and data uplodation
app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({limit: '2mb', extended: false}));


// server.js or app.js
require('dotenv').config();

// Access environment variables using process.env
const port = process.env.PORT || 3000;


// Middleware to parse JSON
app.use(express.json());
// app.use(morgan("Tokens"));
app.use(cors());
app.use(CookieParser());

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Users route
app.use('/api/users', userRoutes);


// Start server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
