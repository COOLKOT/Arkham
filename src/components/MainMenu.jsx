import React from 'react';

export default function MainMenu({ hasSavedGame, onResume, onSelectCase, onInstruction, onClearSave }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="arkham-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', maxWidth: '520px', width: '100%' }}>
        <h1 style={{ fontSize: '38px', color: '#f59e0b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Тайны Аркхэма
        </h1>
        <p style={{ fontSize: '18px', color: '#a8a29e', marginBottom: '36px', fontStyle: 'italic' }}>
          Цифровой помощник сыщика
        </p>

        {hasSavedGame && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px dashed #b45309', borderRadius: '8px' }}>
            <p style={{ color: '#fbbf24', fontSize: '14px', marginBottom: '10px' }}>Обнаружено незавершённое дело</p>
            <button className="btn-primary" style={{ width: '100%', marginBottom: '8px' }} onClick={onResume}>
              📖 Продолжить расследование
            </button>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={onClearSave}>
              Сбросить сохранение
            </button>
          </div>
        )}

        <button className="btn-primary" style={{ display: 'block', width: '100%', marginBottom: '16px' }} onClick={onSelectCase}>
          🔎 Выбрать Дело
        </button>
        <button className="btn-secondary" style={{ display: 'block', width: '100%', padding: '12px' }} onClick={onInstruction}>
          📜 Инструкция
        </button>
      </div>
    </div>
  );
}
