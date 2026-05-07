const pool = require('../config/database');

const createReport = async (req, res) => {
    const { title, description, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // Validasi input
        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Judul, deskripsi, dan kategori harus diisi' });
        }

        if (title.length < 5) {
            return res.status(400).json({ message: 'Judul minimal 5 karakter' });
        }

        if (description.length < 10) {
            return res.status(400).json({ message: 'Deskripsi minimal 10 karakter' });
        }

        // Simpan laporan
        await pool.query(
            'INSERT INTO reports (user_id, title, description, category, image_path) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, title, description, category, imagePath]
        );

        res.status(201).json({ message: 'Laporan berhasil dibuat' });
    } catch (err) {
        console.error('Create report error:', err);
        res.status(500).json({ error: err.message });
    }
};

const getReports = async (req, res) => {
    try {
        let query;
        let params;

        if (req.user.role === 'masyarakat') {
            // User masyarakat hanya bisa lihat laporan mereka sendiri
            query = `
                SELECT r.*, u.name as user_name, u.email as user_email
                FROM reports r
                JOIN users u ON r.user_id = u.id
                WHERE r.user_id = ?
                ORDER BY r.created_at DESC
            `;
            params = [req.user.id];
        } else if (req.user.role === 'admin') {
            // Admin bisa lihat semua laporan
            query = `
                SELECT r.*, u.name as user_name, u.email as user_email
                FROM reports r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
            `;
            params = [];
        }

        const [reports] = await pool.query(query, params);

        res.json({
            total: reports.length,
            reports
        });
    } catch (err) {
        console.error('Get reports error:', err);
        res.status(500).json({ error: err.message });
    }
};

const getReportDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const [reports] = await pool.query(
            `SELECT r.*, u.name as user_name, u.email as user_email
             FROM reports r
             JOIN users u ON r.user_id = u.id
             WHERE r.id = ?`,
            [id]
        );

        if (reports.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        const report = reports[0];

        // Validasi akses: masyarakat hanya bisa lihat laporan mereka, admin bisa lihat semua
        if (req.user.role === 'masyarakat' && report.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Anda tidak memiliki akses ke laporan ini' });
        }

        res.json(report);
    } catch (err) {
        console.error('Get report detail error:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateReportStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Hanya admin yang bisa update status
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Hanya admin yang dapat mengubah status' });
        }

        // Validasi status
        const validStatus = ['menunggu', 'diproses', 'selesai'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        // Cek laporan ada
        const [reports] = await pool.query('SELECT id FROM reports WHERE id = ?', [id]);
        if (reports.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        // Update status
        await pool.query(
            'UPDATE reports SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ message: 'Status laporan berhasil diubah' });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteReport = async (req, res) => {
    const { id } = req.params;

    try {
        // Hanya admin yang bisa hapus
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Hanya admin yang dapat menghapus laporan' });
        }

        // Cek laporan ada
        const [reports] = await pool.query('SELECT id FROM reports WHERE id = ?', [id]);
        if (reports.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        // Hapus laporan
        await pool.query('DELETE FROM reports WHERE id = ?', [id]);

        res.json({ message: 'Laporan berhasil dihapus' });
    } catch (err) {
        console.error('Delete report error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createReport,
    getReports,
    getReportDetail,
    updateReportStatus,
    deleteReport
};
