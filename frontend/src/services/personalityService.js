const API_URL = 'http://localhost:8000';

const weights = {
    'extroversion': {
        'q1': {'A': 0.9, 'B': 0.5, 'C': 0.1},
        'q6': {'A': 0.9, 'B': 0.5, 'C': 0.1},
        'q10': {'A': 0.9, 'B': 0.5, 'C': 0.1}
    },
    'emotional': {
        'q2': {'A': 0.9, 'B': 0.5, 'C': 0.1},
        'q7': {'A': 0.9, 'B': 0.5, 'C': 0.1}
    },
    'conscientiousness': {
        'q3': {'A': 0.9, 'B': 0.5, 'C': 0.1},
        'q5': {'A': 0.9, 'B': 0.5, 'C': 0.1},
        'q8': {'A': 0.9, 'B': 0.5, 'C': 0.1}
    },
    'agreeableness': {
        'q4': {'A': 0.9, 'B': 0.5, 'C': 0.1},
        'q9': {'A': 0.9, 'B': 0.5, 'C': 0.1}
    }
};

const analyzePersonality = (answers) => {
    const scores = {};
    for (const trait in weights) {
        let traitScore = 0;
        let count = 0;
        for (const [question, answer] of Object.entries(answers)) {
            if (weights[trait][question]) {
                traitScore += weights[trait][question][answer];
                count++;
            }
        }
        scores[trait] = count > 0 ? (traitScore / count) * 100 : 0;
    }
    return scores;
};

export const generateAIAnalysis = async (prompt) => {
    try {
        console.log('AI analizi için istek gönderiliyor...');
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:8000/api/generate-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            console.error('API yanıt hatası:', response.status, response.statusText);
            throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API yanıtı:', data);

        if (!data.content) {
            console.error('API yanıtında içerik bulunamadı:', data);
            throw new Error('API yanıtında içerik bulunamadı');
        }

        return data.content;
    } catch (error) {
        console.error('AI analizi hatası:', error);
        throw error;
    }
};

export const formatAIOutput = (text) => {
    if (!text) return '';
    
    // Başlıkları düzenle
    let formattedText = text.replace(/### (.*?)\n/g, '<h3>$1</h3>');
    
    // Listeleri düzenle
    formattedText = formattedText.replace(/\n- (.*?)(?=\n|$)/g, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    
    // Önemli notları vurgula
    formattedText = formattedText.replace(/Önemli: (.*?)(?=\n|$)/g, '<div class="ai-note">$1</div>');
    formattedText = formattedText.replace(/Uyarı: (.*?)(?=\n|$)/g, '<div class="ai-warning">$1</div>');
    formattedText = formattedText.replace(/Başarı: (.*?)(?=\n|$)/g, '<div class="ai-success">$1</div>');
    
    // Paragrafları düzenle
    formattedText = formattedText.split('\n\n').map(paragraph => {
        if (!paragraph.startsWith('<h3>') && !paragraph.startsWith('<ul>') && 
            !paragraph.startsWith('<div class="ai-note">') && 
            !paragraph.startsWith('<div class="ai-warning">') && 
            !paragraph.startsWith('<div class="ai-success">')) {
            return `<p>${paragraph}</p>`;
        }
        return paragraph;
    }).join('');

    return formattedText;
};

const saveTestResults = async (testType, results) => {
    try {
        const response = await fetch(`${API_URL}/api/save-test-results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                testType,
                results
            })
        });

        if (!response.ok) {
            throw new Error('Test sonuçları kaydedilemedi');
        }

        return await response.json();
    } catch (error) {
        console.error('Test sonuçları kaydedilirken hata:', error);
        throw error;
    }
};

const personalityService = {
    analyzePersonality,
    generateAIAnalysis,
    formatAIOutput,
    saveTestResults
};

export default personalityService; 