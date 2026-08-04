import React, { useState, useEffect } from 'react';
import { startAmbientSound, stopAmbientSound, setAmbientVolume, playClickSound } from '../utils/soundEffects';

export default function AmbientSoundControl() {
  const [ambientType, setAmbientType] = useState('none');
  const [volume, setVolumeState] = useState(0.3);

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleSelectType = (type) => {
    playClickSound();
    setAmbientType(type);
    if (type === 'none') {
      stopAmbientSound();
    } else {
      startAmbientSound(type, volume);
    }
  };

  const handleVolumeChange = (val) => {
    setVolumeState(val);
    setAmbientVolume(val);
  };

  return (
    <div style={{
      backgroundColor: '#1f1b18',
      border: '1px solid #78350f',
      borderRadius: '8px',
      padding: '12px 14px',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 'bold' }}>
          🌧️ Фоновый эмбиент
        </span>
        <span style={{ fontSize: '12px', color: '#a8a29e' }}>
          {ambientType === 'rain' ? 'Дождь Аркхэма' : ambientType === 'fire' ? 'Ночной камин' : 'Выключен'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button
          type="button"
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '12px',
            borderColor: ambientType === 'rain' ? '#fbbf24' : '#57534e',
            color: ambientType === 'rain' ? '#fbbf24' : '#a8a29e'
          }}
          onClick={() => handleSelectType('rain')}
        >
          🌧️ Дождь
        </button>

        <button
          type="button"
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '12px',
            borderColor: ambientType === 'fire' ? '#fbbf24' : '#57534e',
            color: ambientType === 'fire' ? '#fbbf24' : '#a8a29e'
          }}
          onClick={() => handleSelectType('fire')}
        >
          🔥 Ветер
        </button>

        <button
          type="button"
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '12px',
            borderColor: ambientType === 'none' ? '#fbbf24' : '#57534e',
            color: ambientType === 'none' ? '#fbbf24' : '#a8a29e'
          }}
          onClick={() => handleSelectType('none')}
        >
          🔕 Выкл
        </button>
      </div>

      {ambientType !== 'none' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: '#a8a29e' }}>Громкость:</span>
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            style={{ flex: 1 }}
          />
        </div>
      )}
    </div>
  );
}
