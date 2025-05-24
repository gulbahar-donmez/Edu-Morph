import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lessons.css';
import personalityService from '../services/personalityService';

function Lessons() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState(null);
  const [level, setLevel] = useState('başlangıç');

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setIsAnswering(true);
      setError(null);

      // Öğrenme stili ve kişilik analizi sonuçlarını al
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
      const personality = testResults.find(r => r.test_type === 'personality');

      // AI'ya gönderilecek prompt'u oluştur
      const prompt = `Öğrenci sorusu: ${question}
Seviye: ${level}

Öğrenme stili: ${learningStyle?.results?.dominantStyle || 'Bilinmiyor'}
Kişilik özellikleri: ${personality?.results?.analysis || 'Bilinmiyor'}

Lütfen bu soruyu öğrencinin öğrenme stiline ve kişilik özelliklerine uygun şekilde yanıtla.
Yanıtı Türkçe olarak ver ve öğrencinin anlayabileceği bir dil kullan.
Yanıtı webde okunaklı olacak şekilde (örneğin <ul>, <li>, <p> ile) döndür.html yazmasın ekranda

Seviyeye uygun olarak yanıt ver:
- Başlangıç: Konunun temel kavramlarını, basit örneklerle ve günlük hayattan benzetmelerle açıkla. Karmaşık terimlerden kaçın ve her adımı detaylı açıkla.
- Orta: Konuyu daha detaylı ele al, pratik örnekler ve uygulamalar ekle. Temel kavramları hatırlat ve orta düzey detaylara gir.
- İleri: Konuyu derinlemesine analiz et, ileri düzey kavramları ve bağlantıları açıkla. Akademik referanslar ve karmaşık örnekler kullan.`;

      // AI'dan yanıt al
      const aiResponse = await personalityService.generateAIAnalysis(prompt);
      setAnswer(aiResponse);
      
    } catch (error) {
      console.error('Soru yanıtlanırken hata:', error);
      setError('Soru yanıtlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="lessons-container">
      <div className="lessons-header">
        <h1>Derslerim</h1>
        <p>Öğrenme stilinize ve kişilik özelliklerinize uygun şekilde sorularınızı yanıtlayalım.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="lessons-content">
        <div className="question-section">
          <form onSubmit={handleQuestionSubmit} className="question-form">
            <div className="level-selector">
              <label htmlFor="level">Seviye Seçin:</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="level-select"
              >
                <option value="başlangıç">Başlangıç (Temel Kavramlar)</option>
                <option value="orta">Orta (Detaylı Açıklamalar)</option>
                <option value="ileri">İleri (Kapsamlı Analiz)</option>
              </select>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Sorunuzu buraya yazın..."
              className="question-input"
              rows="6"
            />
            <button 
              type="submit" 
              className="ask-button"
              disabled={isAnswering || !question.trim()}
            >
              {isAnswering ? 'Yanıtlanıyor...' : 'Soruyu Sor'}
            </button>
          </form>
        </div>

        {answer && (
          <div className="answer-section">
            <h2>Yanıt</h2>
            <div 
              className="answer-content"
              dangerouslySetInnerHTML={{ 
                __html: personalityService.formatAIOutput(answer) 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Lessons; 