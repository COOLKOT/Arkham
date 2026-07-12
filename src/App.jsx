import React, { useState, useEffect } from 'react';
import { ALL_SCENARIOS } from './scenarios';
import './index.css';

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#1c1917', color: '#fef3c7', padding: '24px', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  gameContainer: { width: '100%', maxWidth: '1200px', minHeight: '100vh', backgroundColor: '#1c1917', color: '#fef3c7', padding: '24px', fontFamily: 'Georgia, serif' },
  header: { borderBottom: '1px solid #78350f', paddingBottom: '16px', marginBottom: '24px', textAlign: 'center' },
  title: { fontSize: '28px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#f59e0b', textTransform: 'uppercase', margin: 0 },
  menuBox: { backgroundColor: '#292524', padding: '40px', borderRadius: '12px', border: '2px solid #78350f', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.7)', textAlign: 'center', maxWidth: '500px', width: '100%' },
  menuTitle: { fontSize: '36px', color: '#f59e0b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' },
  menuSubtitle: { fontSize: '16px', color: '#a8a29e', marginBottom: '40px' },
  menuButton: { display: 'block', width: '100%', backgroundColor: '#b45309', color: '#1c1917', fontWeight: 'bold', padding: '14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '18px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  scenariosList: { backgroundColor: '#292524', padding: '32px', borderRadius: '12px', border: '2px solid #78350f', maxWidth: '700px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.7)' },
  scenarioCard: { backgroundColor: '#1c1917', padding: '20px', borderRadius: '8px', border: '1px solid #78350f', marginBottom: '16px', cursor: 'pointer', textAlign: 'left' },
  scenarioTitle: { fontSize: '20px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '6px' },
  scenarioDesc: { fontSize: '14px', color: '#d6d3d1', lineHeight: '1.5' },
  textBlock: { backgroundColor: '#292524', padding: '32px', borderRadius: '8px', border: '1px solid #78350f', maxWidth: '700px', width: '100%' },
  instructionText: { fontSize: '16px', lineHeight: '1.7', color: '#d6d3d1', marginBottom: '24px' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '24px' },
  sidebar: { flex: '1', minWidth: '280px', backgroundColor: '#292524', padding: '20px', borderRadius: '8px', border: '1px solid #78350f' },
  mainContent: { flex: '2', minWidth: '320px', backgroundColor: '#292524', padding: '24px', borderRadius: '8px', border: '1px solid #78350f', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#fbbf24', borderBottom: '1px solid #78350f', paddingBottom: '8px', marginTop: 0 },
  timeText: { fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginLeft: '8px' },
  tagButton: { backgroundColor: '#44403c', color: '#fde68a', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', border: '1px solid #fbbf24', marginRight: '8px', marginBottom: '8px', display: 'inline-block', cursor: 'pointer' },
  storyText: { fontSize: '18px', lineHeight: '1.6', color: '#d6d3d1', fontStyle: 'italic', whiteSpace: 'pre-line' },
  form: { marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #78350f', display: 'flex', gap: '16px' },
  input: { flex: '1', backgroundColor: '#1c1917', border: '1px solid #78350f', borderRadius: '4px', padding: '10px 16px', color: '#fef3c7', fontSize: '16px', outline: 'none' },
  actionButton: { backgroundColor: '#b45309', color: '#1c1917', fontWeight: 'bold', padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '16px' },
  secondaryButton: { backgroundColor: 'transparent', color: '#a8a29e', border: '1px solid #57534e', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', marginTop: '16px', width: '100%', textAlign: 'center' }
};

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [activeScenario, setActiveScenario] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [inputCode, setInputCode] = useState('');
  const [storyText, setStoryText] = useState('');
    // Флаг, который показывает, есть ли в памяти сохраненная игра
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // 1. АВТОМАТИЧЕСКАЯ ПРОВЕРКА СОХРАНЕНИЙ ПРИ СТАРТЕ ПРИЛОЖЕНИЯ
  useEffect(() => {
    const saved = localStorage.getItem('arkham_save');
    if (saved) {
      setHasSavedGame(true);
    }
  }, []);

  // 2. ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ ДАННЫХ ИЗ ПАМЯТИ БРАУЗЕРА
  const loadGame = () => {
    const saved = localStorage.getItem('arkham_save');
    if (saved) {
      const gameData = JSON.parse(saved);
      setActiveScenario(gameData.activeScenario);
      setCurrentTime(gameData.currentTime);
      setVisitedLocations(gameData.visitedLocations);
      setStoryText(gameData.storyText);
      setScreen('game');
    }
  };

  // 3. АВТОСОХРАНЕНИЕ: ПРИ КАЖДОМ ХОДЕ ДАННЫЕ ЗАПИСЫВАЮТСЯ В ПАМЯТЬ
  useEffect(() => {
    if (screen === 'game' && activeScenario) {
      const gameData = {
        activeScenario,
        currentTime,
        visitedLocations,
        storyText
      };
      localStorage.setItem('arkham_save', JSON.stringify(gameData));
      setHasSavedGame(true);
    }
  }, [screen, activeScenario, currentTime, visitedLocations, storyText]);

  const startScenario = (scenario) => {
    setActiveScenario(scenario);
    setCurrentTime(0);
    setVisitedLocations([]);
    setStoryText(scenario.paragraphs["start"]);
    setScreen('game');
  };

  const handleVisitLocation = (e) => {
    e.preventDefault();
    const code = inputCode.trim();
    if (!activeScenario.paragraphs[code]) {
      alert("Такого адреса нет!");
      return;
    }
    if (currentTime >= activeScenario.maxTime) {
      alert("Время истекло!");
      return;
    }
    const textOnLocation = activeScenario.paragraphs[code];
    setCurrentTime(prev => prev + 1);
    setVisitedLocations(prev => [...prev, { code: code, text: textOnLocation }]);
    setStoryText(textOnLocation);
    setInputCode('');
  };

  if (screen === 'menu') {
    return (
      <div style={styles.container}>
        <div style={styles.menuBox}>
          <h1 style={styles.menuTitle}>Тайны Аркхэма</h1>
          <p style={styles.menuSubtitle}>Цифровой помощник сыщика</p>
                    {/* Зеленая кнопка «Продолжить» появляется только при наличии сохранения */}
          {hasSavedGame && (
            <button 
              style={{ ...styles.menuButton, backgroundColor: '#10b981', color: '#fff' }} 
              onClick={loadGame}
            >
              Продолжить игру ⏳
            </button>
          )}

          <button style={styles.menuButton} onClick={() => setScreen('select_case')}>Выбрать Дело</button>
          <button style={styles.menuButton} onClick={() => setScreen('instruction')}>Инструкция</button>
        </div>
      </div>
    );
  }

  if (screen === 'instruction') {
    return (
      <div style={styles.container}>
        <div style={styles.textBlock}>
          <h2 style={styles.sectionTitle}>Инструкция</h2>
          <div style={styles.instructionText}>
            <p style={{ marginBottom: '12px' }}>Приложение заменяет Книгу расследований.</p>
            <p style={{ marginBottom: '12px' }}>Вводите цифровой код локации в поле ввода внизу экрана.</p>
            <p style={{ marginBottom: '12px' }}>Нажмите на имя локации в Журнале, чтобы перечитать её текст.</p>
          </div>
          <button style={styles.actionButton} onClick={() => setScreen('menu')}>Назад в меню</button>
        </div>
      </div>
    );
  }

  if (screen === 'select_case') {
    return (
      <div style={styles.container}>
        <div style={styles.scenariosList}>
          <h2 style={styles.sectionTitle}>Выберите расследование</h2>
          {ALL_SCENARIOS.map((scen) => (
            <div key={scen.id} style={styles.scenarioCard} onClick={() => startScenario(scen)}>
              <div style={styles.scenarioTitle}>{scen.title}</div>
              <div style={styles.scenarioDesc}>{scen.description}</div>
              <div style={{ fontSize: '12px', color: '#a8a29e', marginTop: '8px' }}>Лимит времени: {scen.maxTime} ч.</div>
            </div>
          ))}
          <button style={{ ...styles.actionButton, marginTop: '16px' }} onClick={() => setScreen('menu')}>Назад</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#1c1917', minHeight: '100vh' }}>
      <div style={styles.gameContainer}>
        <header style={styles.header}>
          <h1 style={styles.title}>{activeScenario.title}</h1>
        </header>
        <div style={styles.grid}>
          <div style={styles.sidebar}>
            <h2 style={styles.sectionTitle}>Журнал</h2>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: '#a8a29e' }}>Время:</span>
              <span style={styles.timeText}>{currentTime} / {activeScenario.maxTime} ч.</span>
            </div>
            <div>
              <h3 style={{ color: '#a8a29e', fontSize: '16px', marginBottom: '8px' }}>Посещено:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {visitedLocations.map((loc, idx) => (
                  <button key={idx} style={styles.tagButton} onClick={() => setStoryText(loc.text)}>
                    Локация {loc.code} 🔍
                  </button>
                ))}
              </div>
            </div>
                        {/* Кнопка безопасного выхода с сохранением прогресса */}
            <button 
              style={{ ...styles.secondaryButton, backgroundColor: '#44403c', color: '#fef3c7', marginBottom: '8px', border: '1px solid #78350f' }} 
              onClick={() => {
                // Просто уходим в меню. Фоновый автосохранятор уже всё записал!
                setScreen('menu');
              }}
            >
              💾 Выйти в меню (Сохранить)
            </button>
            <button 
              style={styles.secondaryButton} 
              onClick={() => {
                if (window.confirm("Вы уверены, что хотите выйти? Прогресс текущего дела будет полностью стерт.")) {
                  localStorage.removeItem('arkham_save');
                  setHasSavedGame(false);
                  setActiveScenario(null);
                  setVisitedLocations([]);
                  setCurrentTime(0);
                  setScreen('menu');
                }
              }}
            >
              ↩ Завершить и выйти в меню
            </button>
          </div>
          <div style={styles.mainContent}>
            <div>
              <h2 style={styles.sectionTitle}>События</h2>
              <p style={styles.storyText}>"{storyText}"</p>
            </div>
            <form onSubmit={handleVisitLocation} style={styles.form}>
              <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Код..." style={styles.input} />
              <button type="submit" style={styles.actionButton}>Идти туда</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

