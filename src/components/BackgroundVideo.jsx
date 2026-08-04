import React from 'react';

/**
 * Компонент фонового зацикленного видео для игры.
 * 
 * @param {string} src - Путь к видеофайлу (по умолчанию '/video/bg.mp4')
 * @param {number} overlayOpacity - Затемнение видео поверх (от 0 до 1), чтобы текст оставался читаемым
 */
export default function BackgroundVideo({ src = '/video/bg.mp4', overlayOpacity = 0.65 }) {
  return (
    <>
      <div className="bg-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="bg-video"
        >
          <source src={src} type="video/mp4" />
          <source src={src.replace('.mp4', '.webm')} type="video/webm" />
          Ваш браузер не поддерживает видеофон.
        </video>
      </div>
      <div 
        className="bg-video-overlay" 
        style={{ backgroundColor: `rgba(18, 16, 14, ${overlayOpacity})` }}
      />
    </>
  );
}
