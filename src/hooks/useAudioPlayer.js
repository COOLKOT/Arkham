import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioPlayer(audioSrc = '') {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [audioAvailable, setAudioAvailable] = useState(true);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioAvailable(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioAvailable(false);
    }
  }, [audioSrc]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !audioSrc) {
      alert("Аудиофайл не найден.");
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio playback error:", err);
          setAudioAvailable(false);
          alert("Не удалось воспроизвести аудио: " + (err.message || "проверьте наличие файла"));
        });
      }
    }
  }, [isPlaying, audioSrc]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setAudioAvailable(true);
    }
  };

  const onError = () => {
    setAudioAvailable(false);
    setIsPlaying(false);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onEnded = () => setIsPlaying(false);

  return {
    audioRef,
    src: audioSrc,
    isPlaying,
    duration,
    currentTime,
    volume,
    setVolume,
    audioAvailable,
    togglePlay,
    seek,
    audioProps: {
      onLoadedMetadata,
      onError,
      onTimeUpdate,
      onPlay,
      onPause,
      onEnded
    }
  };
}
