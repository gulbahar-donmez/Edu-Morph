import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LearningStyleRecommendations.css';
import personalityService from '../services/personalityService';

function LearningStyleRecommendations() {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/test-results', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Test sonuçları alınamadı');
                }

                const testResults = await response.json();
                const learningStyle = testResults.find(r => r.test_type === 'learningStyle');

                if (!learningStyle?.results?.recommendations) {
                    throw new Error('Öneriler bulunamadı');
                }

                setRecommendations(learningStyle.results.recommendations);
            } catch (error) {
                console.error('Öneriler alınırken hata:', error);
                setError('Öneriler alınırken bir hata oluştu. Lütfen tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="recommendations-container">
                <div className="loading-message">Öneriler yükleniyor...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recommendations-container">
                <div className="error-message">{error}</div>
                <button 
                    className="back-button"
                    onClick={() => navigate('/learning-style-test')}
                >
                    Teste Geri Dön
                </button>
            </div>
        );
    }

    return (
        <div className="recommendations-container">
            <div className="recommendations-header">
                <h1>Öğrenme Stili Önerileri</h1>
            </div>

            <div className="recommendations-content">
                <div 
                    className="recommendations-text"
                    dangerouslySetInnerHTML={{ 
                        __html: personalityService.formatAIOutput(recommendations) 
                    }}
                />
            </div>

            <div className="navigation-buttons">
                <button 
                    className="back-button"
                    onClick={() => navigate('/learning-style-test')}
                >
                    Teste Geri Dön
                </button>
                <button 
                    className="dashboard-button"
                    onClick={() => navigate('/dashboard')}
                >
                    Dashboard'a Git
                </button>
            </div>
        </div>
    );
}

export default LearningStyleRecommendations; 