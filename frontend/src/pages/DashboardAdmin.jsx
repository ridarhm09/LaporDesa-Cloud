import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { reportService } from '../services/api';
import './DashboardAdmin.css';

export default function DashboardAdmin() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [detailModal, setDetailModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [statusModal, setStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [filterStatus, setFilterStatus] = useState('semua');

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

    const handleUpdateStatus = async () => {
        if (!newStatus) {
            setError('Pilih status baru');
            return;
        }

        try {
            await reportService.updateReportStatus(selectedReport.id, newStatus);
            setSuccess('Status laporan berhasil diubah');
            setStatusModal(false);
            setDetailModal(false);
            setTimeout(() => {
                setSuccess('');
                fetchReports();
            }, 2000);
        } catch (err) {
            setError('Gagal mengubah status');
        }
    };

    const handleDeleteReport = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            try {
                await reportService.deleteReport(id);
                setSuccess('Laporan berhasil dihapus');
                setTimeout(() => {
                    setSuccess('');
                    fetchReports();
                }, 2000);
            } catch (err) {
                setError('Gagal menghapus laporan');
            }
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

    const filteredReports = filterStatus === 'semua' 
        ? reports 
        : reports.filter(r => r.status === filterStatus);

    const stats = {
        total: reports.length,
        menunggu: reports.filter(r => r.status === 'menunggu').length,
        diproses: reports.filter(r => r.status === 'diproses').length,
        selesai: reports.filter(r => r.status === 'selesai').length
    };

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <h2 className="fw-bold">⚙️ Admin Dashboard</h2>
                    <p className="text-muted">Kelola semua laporan/pengaduan masyarakat</p>
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

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3} className="mb-3">
                    <Card className="stat-card shadow-sm border-0">
                        <Card.Body className="p-4 text-center">
                            <h6 className="text-muted mb-2">Total Laporan</h6>
                            <h2 className="fw-bold text-primary">{stats.total}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="stat-card shadow-sm border-0">
                        <Card.Body className="p-4 text-center">
                            <h6 className="text-muted mb-2">⏳ Menunggu</h6>
                            <h2 className="fw-bold text-warning">{stats.menunggu}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="stat-card shadow-sm border-0">
                        <Card.Body className="p-4 text-center">
                            <h6 className="text-muted mb-2">⚙️ Diproses</h6>
                            <h2 className="fw-bold text-info">{stats.diproses}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="stat-card shadow-sm border-0">
                        <Card.Body className="p-4 text-center">
                            <h6 className="text-muted mb-2">✅ Selesai</h6>
                            <h2 className="fw-bold text-success">{stats.selesai}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter and Table */}
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>🔍 Filter Status</Form.Label>
                        <Form.Select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="semua">Semua Laporan</option>
                            <option value="menunggu">⏳ Menunggu</option>
                            <option value="diproses">⚙️ Diproses</option>
                            <option value="selesai">✅ Selesai</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Reports Table */}
            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="text-muted mt-2">Loading...</p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="text-center py-5">
                            <h6 className="text-muted">Tidak ada laporan</h6>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>👤 Pelapor</th>
                                        <th>📌 Judul</th>
                                        <th>🏷️ Kategori</th>
                                        <th>Status</th>
                                        <th>📅 Tanggal</th>
                                        <th>⚡ Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((report, index) => (
                                        <tr key={report.id}>
                                            <td className="fw-bold text-muted">{index + 1}</td>
                                            <td>
                                                <strong>{report.user_name}</strong>
                                                <br />
                                                <small className="text-muted">{report.user_email}</small>
                                            </td>
                                            <td className="fw-bold">{report.title}</td>
                                            <td>
                                                <span style={{ fontSize: '1.1rem' }}>
                                                    {getCategoryIcon(report.category)}
                                                </span>
                                                {' '}{report.category}
                                            </td>
                                            <td>{getStatusBadge(report.status)}</td>
                                            <td className="text-muted small">
                                                {new Date(report.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="btn-group-custom">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setDetailModal(true);
                                                    }}
                                                >
                                                    👁️
                                                </Button>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setStatusModal(true);
                                                        setNewStatus(report.status);
                                                    }}
                                                >
                                                    ✏️
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteReport(report.id)}
                                                >
                                                    🗑️
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card.Body>
            </Card>

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
                                        style={{ maxHeight: '400px', borderRadius: '0.5rem' }}
                                    />
                                </div>
                            )}
                            <h5 className="fw-bold mb-3">{selectedReport.title}</h5>
                            <div className="mb-3">
                                <strong>👤 Pelapor:</strong> {selectedReport.user_name} ({selectedReport.user_email})
                            </div>
                            <div className="mb-3">
                                <strong>🏷️ Kategori:</strong> {selectedReport.category}
                            </div>
                            <div className="mb-3">
                                <strong>Status:</strong> {getStatusBadge(selectedReport.status)}
                            </div>
                            <div className="mb-3">
                                <strong>📄 Deskripsi:</strong>
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

            {/* Status Update Modal */}
            <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>📝 Ubah Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Pilih Status Baru</Form.Label>
                        <Form.Select 
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="">-- Pilih Status --</option>
                            <option value="menunggu">⏳ Menunggu</option>
                            <option value="diproses">⚙️ Diproses</option>
                            <option value="selesai">✅ Selesai</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setStatusModal(false)}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={handleUpdateStatus}>
                        💾 Simpan
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
