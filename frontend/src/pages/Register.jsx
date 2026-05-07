import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authService } from '../services/api';
import './Auth.css';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Semua field harus diisi');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            await authService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.confirmPassword
            );
            
            setSuccess('Registrasi berhasil! Silakan login untuk melanjutkan');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Container>
                <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <Col md={5}>
                        <Card className="auth-card shadow">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold mb-2">🏘️ LaporDesa Cloud</h2>
                                    <p className="text-muted">Daftar Akun Baru</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                                        {success}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>👤 Nama Lengkap</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Masukkan nama Anda"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>📧 Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Masukkan email Anda"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>🔐 Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Minimal 6 karakter"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>🔐 Konfirmasi Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Ulangi password Anda"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Button 
                                        type="submit" 
                                        variant="success" 
                                        className="w-100 fw-bold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Loading...
                                            </>
                                        ) : (
                                            '✅ Daftar'
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4 pt-3 border-top">
                                    <small className="text-muted">Sudah punya akun?</small>{' '}
                                    <Link to="/login" className="text-primary fw-bold">
                                        Masuk di sini
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
