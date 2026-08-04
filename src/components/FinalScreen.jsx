import React from 'react';
import AudioPlayerControls from './AudioPlayerControls';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function FinalScreen({ activeScenario, finalScore, finalInsanity, finalEndingText, onBackToMenu, onSelectNewCase }) {
  const finalAudioSrc = activeScenario ? (activeScenario.finalAudio || `/music/${activeScenario.id}-final.mp3`) : '';
  const finalAudioPlayer = useAudioPlayer(finalAudioSrc);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="arkham-card animate-fade-in" style={{ padding: '36px', maxWidth: '800px', width: '100%' }}>
        <h2 style={{ fontSize: '28px', color: '#fbbf24', borderBottom: '1px solid #78350f', paddingBottom: '12px', marginBottom: '24px', textAlign: 'center' }}>
          Итоги расследования
        </h2>

        <AudioPlayerControls
          title="Аудиоплеер развязки"
          audioPlayer={finalAudioPlayer}
          audioElement={
            <audio
              ref={finalAudioPlayer.audioRef}
              src={finalAudioSrc}
              preload="auto"
              {...finalAudioPlayer.audioProps}
              style={{ display: 'none' }}
            />
          }
        />

        {finalEndingText && (
          <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#141210', borderRadius: '8px', border: '1px solid #78350f' }}>
            <h3 style={{ marginBottom: '8px', color: '#fbbf24', fontSize: '20px' }}>Дело раскрыто!</h3>
            <p style={{ color: '#d6d3d1', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{finalEndingText}</p>
          </div>
        )}

        {finalInsanity && (
          <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(127, 29, 29, 0.2)', borderRadius: '8px', border: '1px solid #991b1b' }}>
            <h3 style={{ marginBottom: '8px', color: '#fca5a5', fontSize: '20px' }}>👁️ Душевное потрясение / Потеря рассудка</h3>
            <p style={{ color: '#fecaca', lineHeight: '1.7' }}>{finalInsanity}</p>
          </div>
        )}

        <div style={{ marginBottom: '28px', textAlign: 'center', padding: '16px', backgroundColor: '#1f1b18', border: '1px solid #78350f', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '6px', color: '#fbbf24', fontSize: '18px' }}>Итоговые баллы сыщика</h3>
          <span style={{ color: '#f59e0b', fontSize: '36px', fontWeight: 'bold', fontFamily: 'var(--font-title)' }}>
            {finalScore}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={onBackToMenu}>
            ↩ Вернуться в меню
          </button>
          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onSelectNewCase}>
            🔎 Выбрать новое дело
          </button>
        </div>
      </div>
    </div>
  );
}
