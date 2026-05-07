const express = require('express');
const {
    createReport,
    getReports,
    getReportDetail,
    updateReportStatus,
    deleteReport
} = require('../controllers/reportController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Semua route reports memerlukan autentikasi
router.use(authenticate);

// Create report (masyarakat)
router.post('/', upload.single('image'), createReport);

// Get all reports (masyarakat lihat miliknya, admin lihat semua)
router.get('/', getReports);

// Get report detail
router.get('/:id', getReportDetail);

// Update report status (admin only)
router.patch('/:id/status', authorizeAdmin, updateReportStatus);

// Delete report (admin only)
router.delete('/:id', authorizeAdmin, deleteReport);

module.exports = router;
