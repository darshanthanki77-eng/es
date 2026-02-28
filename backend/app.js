const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const packageRoutes = require('./routes/packageRoutes');
const withdrawRoutes = require('./routes/withdrawRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes');
const guaranteeRoutes = require('./routes/guaranteeRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
// CORS - allowed origins
const allowedOrigins = [
    'https://smartseller.vercel.app',
    'https://esseller.vercel.app',
    'https://es-phi.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log for debugging if origin is not allowed
            console.log(`Origin ${origin} not allowed by CORS`);
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers crash on 204
}));
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
}));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/withdrawals', withdrawRoutes);
app.use('/api/recharges', rechargeRoutes);
app.use('/api/guarantee', guaranteeRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling
app.use(errorHandler);

module.exports = app;
