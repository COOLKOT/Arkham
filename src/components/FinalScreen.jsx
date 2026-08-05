import React, { useState } from 'react';
import AudioPlayerControls from './AudioPlayerControls';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function FinalScreen({
  activeScenario,
  currentTime,
  finalScore,
  finalInsanity,
  finalEndingText,
  hasArmitageHandicap,
  onBackToMenu,
  onSelectNewCase
}) {
  const [showBonusModal, setShowBonusModal] = useState(false);
  const finalAudioSrc = activeScenario ? (activeScenario.finalAudio || `/music/${activeScenario.id}-final.mp3`) : '';
  const finalAudioPlayer = useAudioPlayer(finalAudioSrc);

  const armitageTrips = activeScenario?.armitageTrips;
  const armitageLocations = activeScenario?.armitageVisitedLocations || [];

  const bonusText18 = activeScenario?.bonus18Text ||
    'Вы справились великолепно, но привлекли чьё-то внимание. Прочитайте дополнительный контакт №12 для второго дела на стр. 32';

  const effectiveArmitageTrips = (activeScenario?.id !== 1 && hasArmitageHandicap && armitageTrips !== undefined)
    ? armitageTrips + 1
    : armitageTrips;

  const victoryEnding = activeScenario?.endings?.find((e) => e.minScore > 0 && e.minScore < 18) ||
    activeScenario?.endings?.find((e) => e.minScore > 0);
  const minVictoryScore = victoryEnding ? victoryEnding.minScore : 12;
  const isVictory = (finalScore !== null && finalScore !== undefined) ? (finalScore >= minVictoryScore) : false;

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

        {/* 18+ POINTS BONUS MODAL TRIGGER BUTTON */}
        {finalScore >= 18 && (
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: 'rgba(217, 119, 6, 0.15)',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold', fontFamily: 'var(--font-title)' }}>
                ⭐ Достижение: Выдающееся расследование (18+ баллов)
              </span>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowBonusModal(true)}
                style={{ fontSize: '14px', padding: '8px 16px' }}
              >
                📜 Открыть секретную депешу ➔
              </button>
            </div>
          </div>
        )}

        {finalInsanity && (
          <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(127, 29, 29, 0.2)', borderRadius: '8px', border: '1px solid #991b1b' }}>
            <h3 style={{ marginBottom: '8px', color: '#fca5a5', fontSize: '20px' }}>👁️ Душевное потрясение / Потеря рассудка</h3>
            <p style={{ color: '#fecaca', lineHeight: '1.7' }}>{finalInsanity}</p>
          </div>
        )}

        {/* ARMITAGE INVESTIGATION RESULTS CARD */}
        {isVictory && armitageTrips !== undefined && (
          <div style={{
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#1a1714',
            border: '2px dashed #855823',
            borderRadius: '8px',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ color: '#fbbf24', fontSize: '19px', margin: '0 0 12px 0', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏛️ Расследование Профессора Армитеджа
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', fontSize: '16px' }}>
              <div>
                <span style={{ color: '#a8a29e' }}>Поездок Армитеджа: </span>
                <strong style={{ color: '#f59e0b', fontSize: '20px', fontFamily: 'monospace' }}>
                  {armitageTrips}
                  {activeScenario?.id !== 1 && hasArmitageHandicap && ' (+1 фора)'}
                </strong>
              </div>

              {currentTime !== undefined && (
                <div>
                  <span style={{ color: '#a8a29e' }}>Ваши поездки: </span>
                  <strong style={{ color: currentTime <= effectiveArmitageTrips ? '#22c55e' : '#ef4444', fontSize: '20px', fontFamily: 'monospace' }}>
                    {currentTime}
                  </strong>
                </div>
              )}
            </div>

            {armitageLocations.length > 0 && (
              <div>
                <div style={{ color: '#a8a29e', fontSize: '14px', marginBottom: '8px' }}>
                  Адреса, посещённые Армитеджем:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {armitageLocations.map((code, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#332c26',
                        color: '#fde68a',
                        border: '1px solid #fbbf24',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                      }}
                    >
                      📍 {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
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

      {/* POPUP MODAL WINDOW FOR 18+ BONUS TEXT */}
      {showBonusModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="arkham-card animate-fade-in" style={{
            maxWidth: '650px',
            width: '100%',
            backgroundColor: '#1f1814',
            border: '3px double #d97706',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(251,191,36,0.2)',
            padding: '32px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #78350f', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ color: '#fbbf24', fontSize: '22px', margin: 0, fontFamily: 'var(--font-title)' }}>
                ⭐ Особое донесение Армитеджа (18+ баллов)
              </h3>
              <button
                type="button"
                onClick={() => setShowBonusModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a8a29e',
                  fontSize: '22px',
                  cursor: 'pointer',
                  padding: '0 8px'
                }}
              >
                ✖
              </button>
            </div>

            <div style={{
              fontSize: '17px',
              lineHeight: '1.7',
              color: '#fef3c7',
              backgroundColor: '#14100d',
              border: '1px solid #855823',
              borderRadius: '6px',
              padding: '20px',
              marginBottom: '24px',
              whiteSpace: 'pre-line'
            }}>
              {bonusText18}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowBonusModal(false)}
              >
                Закрыть окно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
