import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Results.css';
import personalityService from '../services/personalityService';

function Results() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:8000/api/test-results', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Test sonuçları alınamadı');
            }

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Test sonuçları alınırken hata:', error);
            setError('Test sonuçları alınırken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const getTestTypeName = (type) => {
        const types = {
            'learningStyle': 'Öğrenme Stili Testi',
            'personality': 'Kişilik Testi',
            'career': 'Kariyer Testi'
        };
        return types[type] || type;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="results-container">
            <h1>Test Sonuçlarım</h1>
            
            {results.length === 0 ? (
                <div className="no-results">
                    <p>Henüz test sonucunuz bulunmamaktadır.</p>
                    <button 
                        className="start-test-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        Teste Başla
                    </button>
                </div>
            ) : (
                <div className="results-grid">
                    {results.map((result) => (
                        <div key={result.id} className="result-card">
                            <h3>{getTestTypeName(result.test_type)}</h3>
                            <p className="test-date">
                                Tarih: {formatDate(result.created_at)}
                            </p>
                            <div className="result-content">
                                {result.test_type === 'learningStyle' && (
                                    <div className="learning-style-results">
                                        <h4>Öğrenme Stili Analizi</h4>
                                        <div className="learning-style-scores">
                                            <div className="score-item">
                                                <div className="score-label">
                                                    <span>Görsel Öğrenme</span>
                                                    <span>{result.results?.scores?.visual || 0}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill"
                                                        style={{ width: `${result.results?.scores?.visual || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="score-item">
                                                <div className="score-label">
                                                    <span>İşitsel Öğrenme</span>
                                                    <span>{result.results?.scores?.auditory || 0}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill"
                                                        style={{ width: `${result.results?.scores?.auditory || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="score-item">
                                                <div className="score-label">
                                                    <span>Kinestetik Öğrenme</span>
                                                    <span>{result.results?.scores?.kinesthetic || 0}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill"
                                                        style={{ width: `${result.results?.scores?.kinesthetic || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="score-item">
                                                <div className="score-label">
                                                    <span>Okuma/Yazma</span>
                                                    <span>{result.results?.scores?.reading || 0}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill"
                                                        style={{ width: `${result.results?.scores?.reading || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="learning-style-summary">
                                            <h5>Baskın Öğrenme Stiliniz</h5>
                                            <p className="dominant-style">
                                                {result.results?.dominantStyle === 'visual' && 'Görsel Öğrenme'}
                                                {result.results?.dominantStyle === 'auditory' && 'İşitsel Öğrenme'}
                                                {result.results?.dominantStyle === 'kinesthetic' && 'Kinestetik Öğrenme'}
                                                {result.results?.dominantStyle === 'reading' && 'Okuma/Yazma Öğrenme'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {result.test_type === 'personality' && (
                                    <div className="personality-results">
                                        <h4>Kişilik Analizi</h4>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: personalityService.formatAIOutput(result.results.analysis) 
                                        }} />
                                    </div>
                                )}
                                {result.test_type === 'career' && (
                                    <div className="career-results">
                                        <h4>Kariyer Analizi</h4>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: personalityService.formatAIOutput(result.results.analysis) 
                                        }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Results; 