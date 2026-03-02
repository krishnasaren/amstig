const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
    renderToPipeableStream
} = require("react-server-dom-webpack/server");


require('dotenv').config();

const codeRoutes = require('./routes/codeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/code', codeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Amstig Backend Server is running!' });
});
app.post("/_rsc", (req, res) => {
    console.log("Received _rsc payload length:", JSON.stringify(req.body).length);
    console.log(JSON.stringify(req.body));
    renderToPipeableStream(req.body, res);
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});


// 404 handler
app.use( (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Amstig Backend Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});


module.exports = app;