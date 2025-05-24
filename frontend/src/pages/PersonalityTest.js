import React, { useState } from 'react';
import personalityService from '../services/personalityService';
import './PersonalityTest.css';
import { useNavigate } from 'react-router-dom';

const questions = [
    {
        id: 'q1',
        text: 'Sosyal ortamlarda kendinizi nasıl hissedersiniz?',
        options: [
            { value: 'A', text: 'Çok rahat ve enerjik' },
            { value: 'B', text: 'Duruma göre değişken' },
            { value: 'C', text: 'Genellikle çekingen' }
        ]
    },
    {
        id: 'q2',
        text: 'Stresli durumlarda nasıl tepki verirsiniz?',
        options: [
            { value: 'A', text: 'Sakin kalır ve çözüm ararım' },
            { value: 'B', text: 'Bazen endişelenirim' },
            { value: 'C', text: 'Genellikle kaygılanırım' }
        ]
    },
    {
        id: 'q3',
        text: 'Görevlerinizi nasıl tamamlarsınız?',
        options: [
            { value: 'A', text: 'Planlı ve düzenli bir şekilde' },
            { value: 'B', text: 'Bazen planlı, bazen spontane' },
            { value: 'C', text: 'Genellikle son dakikada' }
        ]
    },
    {
        id: 'q4',
        text: 'Başkalarının duygularına karşı yaklaşımınız nasıldır?',
        options: [
            { value: 'A', text: 'Çok empati kurarım' },
            { value: 'B', text: 'Duruma göre değişir' },
            { value: 'C', text: 'Genellikle mesafeli kalırım' }
        ]
    },
    {
        id: 'q5',
        text: 'Çalışma alanınızı nasıl düzenlersiniz?',
        options: [
            { value: 'A', text: 'Her şey düzenli ve yerli yerinde' },
            { value: 'B', text: 'Orta düzeyde düzenli' },
            { value: 'C', text: 'Genellikle dağınık' }
        ]
    }
];

function PersonalityTest() {
    const [answers, setAnswers] = useState({});
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Kişilik analizi yap
            const scores = personalityService.analyzePersonality(answers);
            
            // AI analizi için prompt oluştur
            const prompt = `Kişilik testi sonuçları:
${JSON.stringify(answers, null, 2)}

Kişilik puanları:
${JSON.stringify(scores, null, 2)}

Bu sonuçlara göre detaylı bir kişilik analizi yap. Analiz şunları içermeli:
1. Genel kişilik özellikleri
2. Güçlü yönler
3. Geliştirilebilecek alanlar
4. Öneriler ve tavsiyeler
Yanıtı sadece HTML formatında, webde okunaklı olacak şekilde (örneğin <ul>, <li>, <p> ile) döndür. Kod bloğu veya 'html' etiketi yazma, sadece içeriği döndür. Analizi Türkçe olarak yap ve profesyonel bir dil kullan.`;
            
            // AI analizi al
            const aiAnalysis = await personalityService.generateAIAnalysis(prompt);
            
            // HTML formatla
            const formattedAnalysis = personalityService.formatAIOutput(aiAnalysis);
            
            setAnalysis(formattedAnalysis);
        } catch (error) {
            console.error('Test analizi hatası:', error);
            alert('Test analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="personality-test-container">
            <div className="test-content">
                <h1>Kişilik Testi</h1>
                
                {!analysis ? (
                    <form onSubmit={handleSubmit}>
                        {questions.map(question => (
                            <div key={question.id} className="question-card">
                                <h3>{question.text}</h3>
                                <div className="options">
                                    {question.options.map(option => (
                                        <label key={option.value} className="option-label">
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={option.value}
                                                checked={answers[question.id] === option.value}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                required
                                            />
                                            {option.text}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading || Object.keys(answers).length !== questions.length}
                        >
                            {loading ? 'Analiz Ediliyor...' : 'Testi Tamamla'}
                        </button>
                    </form>
                ) : (
                    <div className="analysis-results">
                        <div dangerouslySetInnerHTML={{ __html: analysis }} />
                        <button 
                            onClick={() => {
                                setAnalysis(null);
                                setAnswers({});
                            }}
                            className="restart-button"
                        >
                            Testi Tekrar Yap
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalityTest; 