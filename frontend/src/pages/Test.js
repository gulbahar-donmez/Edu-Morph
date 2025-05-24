import React, { useState } from 'react';
import './Test.css';

const questions = [
  {
    text: 'Yeni bir eşyayı (örneğin mobilya) kurarken talimatları nasıl takip etmeyi tercih edersiniz?',
    options: ['A) Şemalara, resimlere veya çizimlere bakarak.', 'B) Birinin adımları size okumasını veya sesli okumak.', 'C) Parçaları elime alıp deneyerek, takıldığımda bakarak.']
  },
  {
    text: 'Yeni ve karmaşık bir konu öğrenirken size en çok ne yardımcı olur?',
    options: ['A) Diyagramlar, grafikler veya görseller.', 'B) Sözlü açıklamalar, tartışmalar.', 'C) Aktivite yapmak, not almak, model oluşturmak.']
  },
  {
    text: 'Bir bilgiyi (örneğin bir telefon numarası) hatırlamak için genellikle ne yaparsınız?',
    options: ['A) Görselleştiririm.', 'B) Sesli tekrar ederim.', 'C) Yazarım veya hareketle hatırlarım.']
  },
  {
    text: 'Birine yol tarifi verirken genellikle ne yaparsınız?',
    options: ['A) Harita çizerim.', 'B) Sözlü anlatırım.', 'C) El-kol hareketleriyle gösteririm.']
  },
  {
    text: 'Bir sınava çalışırken hangi yöntem size daha etkili gelir?',
    options: ['A) Okumak ve görseller kullanmak.', 'B) Sesli okumak, tartışmak.', 'C) Not almak, hareket etmek.']
  },
  {
    text: 'Zor bir problemle karşılaştığınızda ilk ne yaparsınız?',
    options: ['A) Zihnimde canlandırırım.', 'B) Sesli düşünürüm.', 'C) Elleri kullanırım, denerim.']
  },
  {
    text: 'Yeni bir beceri öğrenirken neyi tercih edersiniz?',
    options: ['A) İzlemek, video izlemek.', 'B) Sözlü anlatım dinlemek.', 'C) Kendim denemek.']
  },
  {
    text: 'İsimleri hatırlamakta zorlanıyorsanız, ne yaparsınız?',
    options: ['A) Yüz veya yazılışını hatırlamak.', 'B) İsmi sesli tekrar etmek.', 'C) El sıkışmak, not almak.']
  },
  {
    text: 'Bir sunumdan sonra en çok neyi hatırlarsınız?',
    options: ['A) Görselleri.', 'B) Anlatılanları, ses tonunu.', 'C) Aktiviteyi veya hisleri.']
  },
  {
    text: 'Zor bir kelimeyi hecelerken doğruluğundan nasıl emin olursunuz?',
    options: ['A) Yazar ve bakarım.', 'B) Sesli hecelerim.', 'C) Havaya yazarım veya parmakla izlerim.']
  }
];

const Test = () => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState({ visual: 0, auditory: 0, kinesthetic: 0, dominant: '' });

  const handleChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const calculateScores = () => {
    let visual = 0, auditory = 0, kinesthetic = 0;
    Object.values(answers).forEach(ans => {
      if (ans === 'A') visual++;
      else if (ans === 'B') auditory++;
      else if (ans === 'C') kinesthetic++;
    });
    const total = Object.keys(answers).length;
    const visualP = Math.round((visual / total) * 100);
    const auditoryP = Math.round((auditory / total) * 100);
    const kinestheticP = Math.round((kinesthetic / total) * 100);
    let dominant = 'Bilinmiyor';
    const max = Math.max(visual, auditory, kinesthetic);
    if (visual === max) dominant = 'Görsel';
    if (auditory === max) dominant += dominant !== 'Bilinmiyor' ? ' / İşitsel' : 'İşitsel';
    if (kinesthetic === max) dominant += dominant !== 'Bilinmiyor' ? ' / Kinestetik' : 'Kinestetik';
    setScores({ visual: visualP, auditory: auditoryP, kinesthetic: kinestheticP, dominant });
    setShowResult(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      alert('Lütfen tüm soruları cevaplayın.');
      return;
    }
    calculateScores();
  };

  return (
    <div className="test-container">
      {!showResult ? (
        <form onSubmit={handleSubmit}>
          <h1 className="test-title">Öğrenme Stili Analizi</h1>
          {questions.map((q, idx) => (
            <div key={idx} className="question-card">
              <p className="question-text">{idx + 1}. {q.text}</p>
              <div className="options">
                {q.options.map((opt, oidx) => (
                  <label key={oidx} className="option">
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
            </div>
          ))}
          <button type="submit" className="submit-btn">Analizi Tamamla</button>
        </form>
      ) : (
        <div className="result-card">
          <h2>Sonuçlar</h2>
          <p>Görsel: {scores.visual}%</p>
          <p>İşitsel: {scores.auditory}%</p>
          <p>Kinestetik: {scores.kinesthetic}%</p>
          <p>Dominant Stil: {scores.dominant}</p>
          <button className="back-btn" onClick={() => window.location.href = '/'}>Ana Sayfaya Dön</button>
        </div>
      )}
    </div>
  );
};

export default Test;
