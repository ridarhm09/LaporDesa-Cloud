require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MulterError } = require('multer');

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend LaporDesa Cloud running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof MulterError) {
        return res.status(400).json({ message: 'Error upload file' });
    }
    
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route tidak ditemukan' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✓ Backend LaporDesa Cloud running on http://localhost:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
