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

                {(!isAuthPage) && (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto d-flex align-items-center gap-2">
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant="outline-light" 
                                        id="dropdown-basic"
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <i className="bi bi-person-circle"></i> Menu
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end" className="shadow border-0 mt-2">
                                        <Dropdown.Item onClick={() => navigate('/user')}>
                                            📋 Dashboard User
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => navigate('/admin')}>
                                            ⚙️ Dashboard Admin
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
