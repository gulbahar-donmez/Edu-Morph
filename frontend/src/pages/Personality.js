import React, { useState } from 'react';
import './Personality.css';

const questions = [
  {
    text: 'Yeni bir ortama girdiğinizde genellikle nasıl davranırsınız?',
    options: ['A) Hemen insanlarla tanışırım.', 'B) Önce gözlemlerim.', 'C) Sessiz kalırım.']
  },
  {
    text: 'Stresli bir durumda nasıl tepki verirsiniz?',
    options: ['A) Sakin kalırım.', 'B) Duygusal etkilenirim.', 'C) Paniklerim.']
  },
  {
    text: 'İş hayatınızda nasıl bir çalışma düzeni tercih edersiniz?',
    options: ['A) Planlı ve düzenli.', 'B) Esnek.', 'C) Son dakikacı.']
  },
  {
    text: 'Başkalarıyla ilişkilerde nasıl davranırsınız?',
    options: ['A) Uzlaşmacı.', 'B) Kendi görüşümü savunurum.', 'C) Israrcı.']
  },
  {
    text: 'Yeni bir projeye başlarken nasıl davranırsınız?',
    options: ['A) Plan yaparım.', 'B) Genel plan, esneklik.', 'C) Doğaçlama.']
  },
  {
    text: 'Sosyal ortamlarda nasıl davranırsınız?',
    options: ['A) Aktif rol alırım.', 'B) Bazen aktif, bazen gözlemci.', 'C) Gözlemci.']
  },
  {
    text: 'Duygusal durumunuz genelde nasıldır?',
    options: ['A) Dengeli.', 'B) Değişken ama kontrollü.', 'C) Zor kontrol edilen.']
  },
  {
    text: 'Görev ve sorumluluklarınıza yaklaşımınız?',
    options: ['A) Zamanında, eksiksiz.', 'B) Önemlileri öne alırım.', 'C) Son dakikaya bırakırım.']
  },
  {
    text: 'Anlaşmazlıklarda nasıl davranırsınız?',
    options: ['A) Uzlaşma.', 'B) Görüş savunma + uzlaşma.', 'C) Israr.']
  },
  {
    text: 'Yeni deneyimlere tutumunuz?',
    options: ['A) Açık ve heyecanlı.', 'B) Dikkatli.', 'C) Alışkanlıklara bağlı.']
  }
];

const Personality = () => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      alert('Lütfen tüm soruları cevaplayın.');
      return;
    }
    setShowResult(true);
  };

  const calculateScores = () => {
    let extroversion = 0, emotional = 0, conscientiousness = 0, agreeableness = 0;
    Object.values(answers).forEach(ans => {
      if (ans === 'A') extroversion++;
      else if (ans === 'B') emotional++;
      else if (ans === 'C') conscientiousness++;
    });
    return {
      extroversion: Math.round((extroversion / questions.length) * 100),
      emotional: Math.round((emotional / questions.length) * 100),
      conscientiousness: Math.round((conscientiousness / questions.length) * 100),
      agreeableness: Math.round(100 - ((extroversion + emotional + conscientiousness) / 3))
    };
  };

  const scores = calculateScores();

  return (
    <div className="personality-container">
      {!showResult ? (
        <form onSubmit={handleSubmit}>
          <h1 className="personality-title">Kişilik Analizi</h1>
          {questions.map((q, idx) => (
            <div key={idx} className="question-card">
              <p>{idx + 1}. {q.text}</p>
              {q.options.map((opt, oidx) => (
                <label key={oidx}>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={opt.charAt(0)}
                    onChange={() => handleChange(idx, opt.charAt(0))}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button type="submit" className="submit-btn">Analizi Tamamla</button>
        </form>
      ) : (
        <div className="result-card">
          <h2>Sonuçlar</h2>
          <p>Dışa Dönüklük: {scores.extroversion}%</p>
          <p>Duygusal Denge: {scores.emotional}%</p>
          <p>Sorumluluk: {scores.conscientiousness}%</p>
          <p>Uyumluluk: {scores.agreeableness}%</p>
          <button className="back-btn" onClick={() => window.location.href = '/'}>Ana Sayfaya Dön</button>
        </div>
      )}
    </div>
  );
};

export default Personality;
