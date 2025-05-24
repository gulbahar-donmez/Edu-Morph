import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="welcome-header">
                    <h1>EduMorph</h1>
                    <p className="welcome-subtitle">Kişiselleştirilmiş Öğrenme Deneyimi</p>
                </div>

                <div className="welcome-features">
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Kişiselleştirilmiş Öğrenme</h3>
                        <p>Öğrenme stilinize uygun içeriklerle daha etkili öğrenin</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Detaylı Analiz</h3>
                        <p>Güçlü ve zayıf yönlerinizi keşfedin</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Hızlı İlerleme</h3>
                        <p>Size özel stratejilerle başarıya ulaşın</p>
                    </div>
                </div>

                <div className="welcome-buttons">
                    <button 
                        className="welcome-button primary"
                        onClick={() => navigate('/login')}
                    >
                        Giriş Yap
                    </button>
                    <button 
                        className="welcome-button secondary"
                        onClick={() => navigate('/register')}
                    >
                        Kayıt Ol
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
