import React, { useState } from 'react';

export default function QuestionsScreen({ questionsList, answers, onSaveAnswers, onFinalize, onBackToMenu }) {
  const [localAnswers, setLocalAnswers] = useState(answers || {});
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAnswerChange = (idx, value) => {
    setLocalAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const handleSave = () => {
    onSaveAnswers(localAnswers);
    setShowConfirm(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="arkham-card animate-fade-in" style={{ padding: '36px', maxWidth: '750px', width: '100%' }}>
        <h2 style={{ fontSize: '26px', color: '#fbbf24', borderBottom: '1px solid #78350f', paddingBottom: '12px', marginBottom: '24px' }}>
          Вопросы по делу
        </h2>

        <div style={{ marginBottom: '24px' }}>
          {questionsList.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '20px' }}>
              <div style={{ color: '#fbbf24', fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
                {idx + 1}. {q}
              </div>
              <input
                type="text"
                value={localAnswers[idx] || ''}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                className="arkham-input"
                style={{ width: '100%' }}
                placeholder="Ваш ответ..."
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button type="button" className="btn-primary" onClick={handleSave}>
            💾 Сохранить ответы
          </button>
          <button type="button" className="btn-secondary" onClick={onBackToMenu}>
            ↩ Назад в меню
          </button>
        </div>

        {showConfirm && (
          <div style={{ marginTop: '24px', padding: '20px', border: '1px solid #fbbf24', borderRadius: '8px', backgroundColor: '#1a1714' }}>
            <div style={{ marginBottom: '16px', color: '#f1f5f9', fontSize: '16px' }}>
              Ответы сохранены. Хотите подтвердить и перейти к итоговой проверке и баллам?
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button type="button" className="btn-primary" onClick={() => onFinalize(localAnswers)}>
                ✅ Подтвердить и проверить
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowConfirm(false)}>
                Отменить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
