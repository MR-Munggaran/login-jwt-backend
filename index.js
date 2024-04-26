const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.use('/api/auth', authRoutes);

// Mongo
mongoose.connect('mongodb://127.0.0.1:27017/AuthLogin').then(() => {
    console.log('Connected to Server');
}).catch(err => console.log(err));

// Global Error Handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

// Server
const port = 5000;
app.listen(port, () => {
    console.log('App running on : ' + port);
});
