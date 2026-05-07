import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { reportService } from '../services/api';
import './DashboardUser.css';

export default function DashboardUser() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Infrastruktur',
        image: null
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await reportService.getReports();
            setReports(response.data.reports);
            setError('');
        } catch (err) {
            setError('Gagal memuat laporan');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.category) {
            setError('Semua field wajib diisi');
            return;
        }

        if (formData.title.length < 5) {
            setError('Judul minimal 5 karakter');
            return;
        }

        if (formData.description.length < 10) {
            setError('Deskripsi minimal 10 karakter');
            return;
        }

        setFormLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            if (formData.image) {
                data.append('image', formData.image);
            }

            await reportService.createReport(data);

            setSuccess('Laporan berhasil dibuat!');
            setFormData({ title: '', description: '', category: 'Infrastruktur', image: null });
            setShowForm(false);
            setTimeout(() => {
                setSuccess('');
                fetchReports();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat laporan');
        } finally {
            setFormLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'menunggu':
                return <Badge bg="warning" className="status-badge">⏳ Menunggu</Badge>;
            case 'diproses':
                return <Badge bg="info" className="status-badge">⚙️ Diproses</Badge>;
            case 'selesai':
                return <Badge bg="success" className="status-badge">✅ Selesai</Badge>;
            default:
                return <Badge bg="secondary">Unknown</Badge>;
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Infrastruktur': '🛣️',
            'Kesehatan': '🏥',
            'Pendidikan': '📚',
            'Kebersihan': '🧹',
            'Keamanan': '🚨',
            'Lainnya': '📋'
        };
        return icons[category] || '📋';
    };

    return (
        <Container className="py-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <h2 className="fw-bold">📋 Dashboard Masyarakat</h2>
                    <p className="text-muted">Buat dan kelola laporan/pengaduan Anda</p>
                </Col>
                <Col md="auto">
                    <Button 
                        variant="primary" 
                        onClick={() => setShowForm(!showForm)}
                        className="fw-bold"
                    >
                        {showForm ? '❌ Batal' : '➕ Buat Laporan'}
                    </Button>
                </Col>
            </Row>

            {/* Alert Messages */}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                    {error}
                </Alert>
            )}
            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-4">
                    {success}
                </Alert>
            )}

            {/* Form Section */}
            {showForm && (
                <Row className="mb-4">
                    <Col md={8} className="mx-auto">
                        <Card className="shadow">
                            <Card.Body>
                                <h5 className="mb-4">📝 Buat Laporan Baru</h5>
                                <Form onSubmit={handleSubmitReport}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>📌 Judul Laporan</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            placeholder="Contoh: Jalan Rusak di Jl. Masjid"
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            disabled={formLoading}
                                        />
                                        <small className="text-muted">{formData.title.length}/100 karakter</small>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>📄 Deskripsi</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            rows={4}
                                            placeholder="Jelaskan detail masalah/pengaduan Anda"
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            disabled={formLoading}
                                        />
                                        <small className="text-muted">{formData.description.length}/500 karakter</small>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>🏷️ Kategori</Form.Label>
                                        <Form.Select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleFormChange}
                                            disabled={formLoading}
                                        >
                                            <option>Infrastruktur</option>
                                            <option>Kesehatan</option>
                                            <option>Pendidikan</option>
                                            <option>Kebersihan</option>
                                            <option>Keamanan</option>
                                            <option>Lainnya</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>📷 Upload Gambar (Opsional)</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleFormChange}
                                            disabled={formLoading}
                                        />
                                        <small className="text-muted">Format: JPEG, PNG, JPG, GIF (Max: 5MB)</small>
                                    </Form.Group>

                                    <Button 
                                        type="submit" 
                                        variant="success" 
                                        className="w-100 fw-bold"
                                        disabled={formLoading}
                                    >
                                        {formLoading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            '✅ Kirim Laporan'
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Reports List */}
            <Row>
                <Col>
                    <h5 className="mb-3">📊 Laporan Saya ({reports.length})</h5>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="text-muted mt-2">Loading...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <Card className="text-center py-5">
                            <Card.Body>
                                <h6 className="text-muted">Anda belum membuat laporan</h6>
                                <p className="text-muted">Klik tombol "Buat Laporan" untuk membuat laporan pertama Anda</p>
                            </Card.Body>
                        </Card>
                    ) : (
                        <div className="report-list">
                            {reports.map(report => (
                                <Card key={report.id} className="mb-3 report-card shadow-sm">
                                    <Card.Body>
                                        <Row className="align-items-start">
                                            <Col md={8}>
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <span style={{ fontSize: '1.2rem' }}>
                                                        {getCategoryIcon(report.category)}
                                                    </span>
                                                    <h6 className="mb-0 fw-bold">{report.title}</h6>
                                                </div>
                                                <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                                    {report.description.substring(0, 100)}...
                                                </p>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Badge bg="light" text="dark">{report.category}</Badge>
                                                    {getStatusBadge(report.status)}
                                                    <small className="text-muted">
                                                        {new Date(report.created_at).toLocaleDateString('id-ID')}
                                                    </small>
                                                </div>
                                            </Col>
                                            <Col md={4} className="text-end">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setDetailModal(true);
                                                    }}
                                                    className="fw-bold"
                                                >
                                                    👁️ Lihat Detail
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>
            </Row>

            {/* Detail Modal */}
            <Modal show={detailModal} onHide={() => setDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>📋 Detail Laporan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport && (
                        <>
                            {selectedReport.image_path && (
                                <div className="mb-3 text-center">
                                    <img 
                                        src={`http://localhost:5000${selectedReport.image_path}`}
                                        alt="Laporan"
                                        className="img-fluid"
                                        style={{ maxHeight: '300px', borderRadius: '0.5rem' }}
                                    />
                                </div>
                            )}
                            <h5 className="fw-bold mb-3">{selectedReport.title}</h5>
                            <div className="mb-3">
                                <strong>Kategori:</strong> {selectedReport.category}
                            </div>
                            <div className="mb-3">
                                <strong>Status:</strong> {getStatusBadge(selectedReport.status)}
                            </div>
                            <div className="mb-3">
                                <strong>Deskripsi:</strong>
                                <p className="mt-2">{selectedReport.description}</p>
                            </div>
                            <div className="mb-2">
                                <small className="text-muted">
                                    Dibuat: {new Date(selectedReport.created_at).toLocaleString('id-ID')}
                                </small>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDetailModal(false)}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
