import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authService } from '../services/api';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.email || !formData.password) {
                setError('Email dan password harus diisi');
                setLoading(false);
                return;
            }

            const response = await authService.login(formData.email, formData.password);
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda');
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
                                    <p className="text-muted">Sistem Pelayanan Publik Desa/Kelurahan</p>
                                </div>

                                <h5 className="text-center mb-4">Masuk ke Akun Anda</h5>

                                {error && (
                                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
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

                                    <Form.Group className="mb-4">
                                        <Form.Label>🔐 Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Masukkan password Anda"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Button 
                                        type="submit" 
                                        variant="primary" 
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
                                            '🔓 Masuk'
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4 pt-3 border-top">
                                    <small className="text-muted">Belum punya akun?</small>{' '}
                                    <Link to="/register" className="text-primary fw-bold">
                                        Daftar di sini
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>

                        <div className="text-center mt-4">
                            <small className="text-muted d-block">
                                Demo - Email: <strong>admin@lapordesa.com</strong>
                            </small>
                            <small className="text-muted d-block">
                                Password: <strong>password</strong>
                            </small>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
