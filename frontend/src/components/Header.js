import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <h1>EduMorph</h1>
                </Link>
                
                {isAuthenticated && (
                    <nav className="nav-links">
                        <Link to="/dashboard" className="nav-link">Anasayfa</Link>
                        <Link to="/results" className="nav-link">Sonuçlarım</Link>
                        <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header; 