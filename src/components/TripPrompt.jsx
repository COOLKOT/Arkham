import React, { useState } from 'react';
import AudioPlayerControls from './AudioPlayerControls';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function TripPrompt({ scenario, onConfirm, onBack }) {
  const [tripInput, setTripInput] = useState('');

  const introAudioSrc = scenario ? `/music/${scenario.id}.mp3` : '';
  const introAudioPlayer = useAudioPlayer(introAudioSrc);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trips = parseInt(tripInput, 10);
    if (Number.isNaN(trips) || trips <= 0) {
      alert('Введите корректное количество поездок (положительное число).');
      return;
    }
    onConfirm(trips);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="arkham-card animate-fade-in" style={{ padding: '36px', maxWidth: '700px', width: '100%' }}>
        <h2 style={{ fontSize: '26px', color: '#fbbf24', borderBottom: '1px solid #78350f', paddingBottom: '12px', marginBottom: '20px' }}>
          Начало расследования
        </h2>

        {scenario && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#fbbf24', fontSize: '22px', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'var(--font-title)' }}>{scenario.title}</div>
            <div style={{ color: '#d6d3d1', fontSize: '16px' }}>{scenario.description}</div>
          </div>
        )}

        <AudioPlayerControls
          title="Вступление к делу"
          audioPlayer={introAudioPlayer}
          audioElement={
            <audio
              ref={introAudioPlayer.audioRef}
              src={introAudioSrc}
              preload="auto"
              {...introAudioPlayer.audioProps}
              style={{ display: 'none' }}
            />
          }
        />

        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#141210', borderRadius: '8px', border: '1px solid #78350f' }}>
          <h3 style={{ color: '#f59e0b', fontSize: '18px', margin: '0 0 10px 0', fontFamily: 'var(--font-title)' }}>
            📋 Сложность дела
          </h3>
          <p style={{ color: '#d6d3d1', fontSize: '15px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
            {scenario?.difficultyText || 'Информация о сложности дела не указана.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#a8a29e', fontSize: '15px', display: 'block', marginBottom: '8px' }}>
              Количество поездок:
            </label>
            <input
              type="number"
              min="1"
              value={tripInput}
              onChange={(e) => setTripInput(e.target.value)}
              placeholder="Укажите лимит..."
              className="arkham-input"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="submit" className="btn-primary">
              🚀 Начать дело
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>
              ↩ Назад к выбору дела
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
