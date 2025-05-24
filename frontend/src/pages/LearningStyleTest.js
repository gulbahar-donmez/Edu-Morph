import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LearningStyleTest.css';
import personalityService from '../services/personalityService';

const questions = [
    {
        id: 'q1',
        text: 'Yeni bir konuyu öğrenirken en çok hangi yöntemi tercih edersiniz?',
        options: [
            { value: 'visual', text: 'Görsel materyaller ve diyagramlar' },
            { value: 'auditory', text: 'Sesli açıklamalar ve tartışmalar' },
            { value: 'kinesthetic', text: 'Uygulamalı aktiviteler ve deneyimler' },
            { value: 'reading', text: 'Yazılı materyaller ve notlar' }
        ]
    },
    {
        id: 'q2',
        text: 'Bir problemi çözerken en çok hangi yöntemi kullanırsınız?',
        options: [
            { value: 'visual', text: 'Görsel olarak modelleme ve şemalar çizme' },
            { value: 'auditory', text: 'Sesli düşünme ve başkalarıyla tartışma' },
            { value: 'kinesthetic', text: 'Pratik yaparak ve deneyerek' },
            { value: 'reading', text: 'Yazılı olarak analiz etme ve planlama' }
        ]
    },
    {
        id: 'q3',
        text: 'Bir konuyu hatırlamak istediğinizde en çok neye güvenirsiniz?',
        options: [
            { value: 'visual', text: 'Görsel imgeler ve renkler' },
            { value: 'auditory', text: 'Sesler ve konuşmalar' },
            { value: 'kinesthetic', text: 'Fiziksel hareketler ve duygular' },
            { value: 'reading', text: 'Yazılı notlar ve listeler' }
        ]
    },
    {
        id: 'q4',
        text: 'Bir projeyi planlarken en çok hangi yöntemi kullanırsınız?',
        options: [
            { value: 'visual', text: 'Görsel şemalar ve akış diyagramları' },
            { value: 'auditory', text: 'Sesli planlama ve tartışma' },
            { value: 'kinesthetic', text: 'Pratik denemeler ve prototipler' },
            { value: 'reading', text: 'Yazılı planlar ve kontrol listeleri' }
        ]
    },
    {
        id: 'q5',
        text: 'Yeni bir beceri öğrenirken en çok hangi yöntemi tercih edersiniz?',
        options: [
            { value: 'visual', text: 'Görsel örnekleri izleme' },
            { value: 'auditory', text: 'Sözlü talimatları dinleme' },
            { value: 'kinesthetic', text: 'Pratik yaparak öğrenme' },
            { value: 'reading', text: 'Yazılı talimatları okuma' }
        ]
    }
];

function LearningStyleTest() {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [testCompleted, setTestCompleted] = useState(false);
    const [testResults, setTestResults] = useState(null);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const calculateLearningStyle = (answers) => {
        const scores = {
            visual: 0,
            auditory: 0,
            kinesthetic: 0,
            reading: 0
        };

        Object.values(answers).forEach(answer => {
            scores[answer]++;
        });

        // Yüzdelik değerleri hesapla
        const totalQuestions = Object.keys(answers).length;
        const percentages = {
            visual: Math.round((scores.visual / totalQuestions) * 100),
            auditory: Math.round((scores.auditory / totalQuestions) * 100),
            kinesthetic: Math.round((scores.kinesthetic / totalQuestions) * 100),
            reading: Math.round((scores.reading / totalQuestions) * 100)
        };

        const maxScore = Math.max(...Object.values(percentages));
        const dominantStyle = Object.keys(percentages).find(key => percentages[key] === maxScore);

        return {
            scores: percentages,
            dominantStyle,
            description: getStyleDescription(dominantStyle)
        };
    };

    const getStyleDescription = (style) => {
        const descriptions = {
            visual: 'Görsel öğrenenler, bilgiyi en iyi görsel materyaller ve diyagramlar aracılığıyla öğrenirler. Renkli notlar, grafikler ve görsel sunumlar onlar için idealdir.',
            auditory: 'İşitsel öğrenenler, bilgiyi en iyi sesli açıklamalar ve tartışmalar yoluyla öğrenirler. Dersleri dinlemek ve başkalarıyla konuşmak onlar için etkilidir.',
            kinesthetic: 'Kinestetik öğrenenler, bilgiyi en iyi uygulamalı aktiviteler ve deneyimler yoluyla öğrenirler. Pratik yapmak ve fiziksel olarak denemek onlar için önemlidir.',
            reading: 'Okuma/yazma öğrenenleri, bilgiyi en iyi yazılı materyaller ve notlar aracılığıyla öğrenirler. Detaylı notlar almak ve yazılı kaynakları kullanmak onlar için idealdir.'
        };
        return descriptions[style] || '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            
            // Test sonuçlarını hesapla
            const result = calculateLearningStyle(answers);
            
            // AI analizi için prompt oluştur
            const prompt = `Öğrenme stili testi sonuçları:\nGörsel: ${result.scores.visual}%\nİşitsel: ${result.scores.auditory}%\nKinestetik: ${result.scores.kinesthetic}%\n\nBaskın öğrenme stili: ${result.dominantStyle}\n\nBu sonuçlara göre detaylı bir öğrenme stili analizi yap. Analiz şunları içermeli:\n1. Genel öğrenme stili değerlendirmesi\n2. Güçlü yönler\n3. Geliştirilebilecek alanlar\n4. Kısa ve öz öneriler (öğrenme stratejileri, çalışma teknikleri, pratik uygulamalar)\nYanıtı sadece HTML formatında, webde okunaklı olacak şekilde (örneğin <ul>, <li>, <p> ile) döndür. Kod bloğu veya 'html' etiketi yazma, sadece içeriği döndür. Analizi Türkçe olarak yap ve profesyonel bir dil kullan.`;
            
            // AI analizi al
            const recommendations = await personalityService.generateAIAnalysis(prompt);
            
            // Test sonuçlarını kaydet
            await personalityService.saveTestResults('learningStyle', {
                scores: result.scores,
                dominantStyle: result.dominantStyle,
                recommendations: recommendations
            });

            // Sonuçları state'e kaydet
            setTestResults({
                scores: result.scores,
                dominantStyle: result.dominantStyle,
                recommendations: recommendations
            });
            
            // Testi tamamlandı olarak işaretle
            setTestCompleted(true);
            
        } catch (error) {
            console.error('Test sonuçları kaydedilirken hata:', error);
            setError('Test sonuçları kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (testCompleted) {
        return (
            <div className="test-container">
                <div className="test-header">
                    <h1>Öğrenme Stili Testi Sonuçları</h1>
                </div>

                <div className="results-section">
                    <div className="analysis-results">
                        <div dangerouslySetInnerHTML={{ 
                            __html: personalityService.formatAIOutput(testResults.recommendations) 
                        }} />
                    </div>
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button 
                            className="restart-button"
                            onClick={() => {
                                setTestCompleted(false);
                                setTestResults(null);
                                setAnswers({});
                            }}
                        >
                            Testi Tekrar Yap
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="learning-style-test-container">
            <div className="test-content">
                <h1>Öğrenme Stili Değerlendirmesi</h1>
                
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
                            onClick={() => navigate('/dashboard')}
                            className="dashboard-button"
                        >
                            Dashboard'a Dön
                        </button>
                    </div>
                )}
                
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

export default LearningStyleTest; 