import React from 'react';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AudioPlayerControls({
  title = "Аудиоплеер",
  audioPlayer,
  audioElement
}) {
  const {
    isPlaying,
    duration,
    currentTime,
    volume,
    setVolume,
    audioAvailable,
    togglePlay,
    seek
  } = audioPlayer;

  return (
    <div style={{
      backgroundColor: '#1f1b18',
      border: '1px solid #78350f',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px'
    }}>
      {audioElement}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 'bold' }}>🎧 {title}</span>
        {!audioAvailable && (
          <span style={{ color: '#ef4444', fontSize: '12px', fontStyle: 'italic' }}>
            Файл не найден
          </span>
        )}
      </div>

      <button
        type="button"
        className="btn-primary"
        style={{ width: '100%', padding: '10px', fontSize: '14px', marginBottom: '8px' }}
        onClick={togglePlay}
      >
        {isPlaying ? '⏸️ Остановить воспроизведение' : '▶️ Воспроизвести'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ minWidth: '70px', textAlign: 'right', fontSize: '12px', color: '#a8a29e', fontFamily: 'monospace' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <span style={{ fontSize: '12px', color: '#a8a29e' }}>🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ width: '80px' }}
        />
      </div>
    </div>
  );
}
