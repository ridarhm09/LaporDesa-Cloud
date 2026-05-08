import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardUser from './pages/DashboardUser';
import DashboardAdmin from './pages/DashboardAdmin';

const ProtectedRoute = ({ children }) => {
    return children;
};

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route 
                    path="/user" 
                    element={
                        <ProtectedRoute role="masyarakat">
                            <DashboardUser />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute role="admin">
                            <DashboardAdmin />
                        </ProtectedRoute>
                    } 
                />
                
                <Route path="/" element={<Navigate to="/user" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
