import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import './Navbar.css';

export default function NavbarComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    return (
        <Navbar bg="dark" variant="dark" sticky="top" className="navbar-custom">
            <Container>
                <Navbar.Brand 
                    onClick={() => navigate('/')} 
                    style={{ cursor: 'pointer' }}
                    className="d-flex align-items-center gap-2"
                >
                    <span className="badge bg-success">🏘️</span>
                    <span>LaporDesa Cloud</span>
                </Navbar.Brand>

                {user && !isAuthPage && (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto d-flex align-items-center gap-2">
                                <span className="text-light" style={{ fontSize: '0.9rem' }}>
                                    {user.name} <small className="text-muted">({user.role})</small>
                                </span>
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant="outline-light" 
                                        id="dropdown-basic"
                                        size="sm"
                                    >
                                        Menu
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        {user.role === 'masyarakat' && (
                                            <Dropdown.Item onClick={() => navigate('/user')}>
                                                📋 Dashboard Saya
                                            </Dropdown.Item>
                                        )}
                                        {user.role === 'admin' && (
                                            <Dropdown.Item onClick={() => navigate('/admin')}>
                                                ⚙️ Admin Dashboard
                                            </Dropdown.Item>
                                        )}
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                                            🚪 Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </>
                )}
            </Container>
        </Navbar>
    );
}
