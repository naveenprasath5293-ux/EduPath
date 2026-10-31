const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const corsOptions = require('./config/corsOptions');
const { apiLimiter } = require('./middleware/rateLimiter');
const notFoundHandler = require('./middleware/notFoundHandler');
const globalErrorHandler = require('./middleware/globalErrorHandler');
const apiRoutes = require('./routes');

const app = express();

// --- Security & parsing middleware ---
// crossOriginResourcePolicy is relaxed to 'cross-origin' so course
// thumbnails served from /uploads can be loaded by the frontend, which
// runs on a different origin (Vite dev server) than the API.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

if (!env.isProduction) {
  app.use(morgan('dev'));
}

// --- Static file serving (course thumbnails, etc.) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiLimiter);

// --- Routes ---
app.use('/api', apiRoutes);

// --- 404 + centralized error handling ---
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
