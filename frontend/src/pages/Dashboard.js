import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import personalityService from '../services/personalityService';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testStatus, setTestStatus] = useState({
    learningStyle: 'not-completed',
    personality: 'not-completed'
  });

  const handleTestComplete = async (testType, results) => {
    try {
      setLoading(true);
      setError(null);
      
      await personalityService.saveTestResults(testType, results);
      
      setTestStatus(prev => ({
        ...prev,
        [testType]: 'completed'
      }));
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Test sonuçları kaydedilirken hata:', error);
      setError('Test sonuçları kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Yükleniyor...</div>}
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">🎯</div>
          <h3>Öğrenme Stili Testi</h3>
          <p>Öğrenme stilinizi keşfedin ve kişiselleştirilmiş öneriler alın.</p>
          {testStatus.learningStyle === 'completed' ? (
            <button 
              className="view-results-button"
              onClick={() => navigate('/results')}
            >
              Sonuçları Görüntüle
            </button>
          ) : (
            <button 
              className="start-button"
              onClick={() => navigate('/learning-style-test')}
            >
              Teste Başla
            </button>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🧠</div>
          <h3>Kişilik Testi</h3>
          <p>Kişilik özelliklerinizi analiz edin ve güçlü yönlerinizi keşfedin.</p>
          {testStatus.personality === 'completed' ? (
            <button 
              className="view-results-button"
              onClick={() => navigate('/results')}
            >
              Sonuçları Görüntüle
            </button>
          ) : (
            <button 
              className="start-button"
              onClick={() => navigate('/personality-test')}
            >
              Teste Başla
            </button>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <h3>Derslerim</h3>
          <p>Öğrenme stilinize ve kişilik özelliklerinize uygun şekilde sorularınızı yanıtlayalım.</p>
          <button 
            className="start-button"
            onClick={() => navigate('/lessons')}
          >
            Derslere Git
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 