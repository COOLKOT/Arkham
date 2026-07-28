import React, { useState, useEffect, useRef } from 'react';
import { ALL_SCENARIOS } from './scenarios';
import { evaluateAnswer } from './answerValidator';
import AddressBookPanel from './components/AddressBookPanel';
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
  ritualText: { fontFamily: '"Courier New", monospace', fontStyle: 'normal', color: '#fbbf24', letterSpacing: '0.08em', fontWeight: 600, display: 'inline-block', textAlign: 'center', whiteSpace: 'pre-line', margin: '20px auto', fontSize: '20px', lineHeight: '1.4' },
  noteText: { fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive', fontStyle: 'italic', color: '#f8e7b5', letterSpacing: '0.02em', display: 'block', textAlign: 'center', whiteSpace: 'pre-wrap', margin: '24px auto', padding: '18px 24px', borderRadius: '16px', border: '1px dashed rgba(255, 235, 183, 0.5)', backgroundColor: 'rgba(34, 24, 12, 0.85)', maxWidth: '720px', fontSize: '22px', lineHeight: '1.5', boxShadow: '0 16px 30px rgba(0, 0, 0, 0.35)' },
  form: { marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #78350f', display: 'flex', gap: '16px' },
  input: { flex: '1', backgroundColor: '#1c1917', border: '1px solid #78350f', borderRadius: '4px', padding: '10px 16px', color: '#fef3c7', fontSize: '16px', outline: 'none' },
  actionButton: { backgroundColor: '#b45309', color: '#1c1917', fontWeight: 'bold', padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '16px' },
  secondaryButton: { backgroundColor: 'transparent', color: '#a8a29e', border: '1px solid #57534e', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', marginTop: '16px', width: '100%', textAlign: 'center' }
};

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [activeScenario, setActiveScenario] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [declaredTrips, setDeclaredTrips] = useState(null);
  const [tripInput, setTripInput] = useState('');
  const [pendingScenario, setPendingScenario] = useState(null);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [inputCode, setInputCode] = useState('');
  const [storyText, setStoryText] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [questionsAnswers, setQuestionsAnswers] = useState({});
  const audioRef = useRef(null);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrent, setAudioCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const finalAudioRef = useRef(null);
  const [finalAudioAvailable, setFinalAudioAvailable] = useState(false);
  const [finalAudioDuration, setFinalAudioDuration] = useState(0);
  const [finalAudioCurrent, setFinalAudioCurrent] = useState(0);
  const [finalIsPlaying, setFinalIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [finalInsanity, setFinalInsanity] = useState('');
  const [finalEndingText, setFinalEndingText] = useState('');
  const [showAddressBook, setShowAddressBook] = useState(false);
  const inputCodeRef = useRef(null);

  // АВТОСОХРАНЕНИЕ: ПРИ КАЖДОМ ХОДЕ ДАННЫЕ ЗАПИСЫВАЮТСЯ В ПАМЯТЬ
  useEffect(() => {
    if (screen === 'game' && activeScenario) {
      const gameData = {
        activeScenario,
        currentTime,
        declaredTrips,
        visitedLocations,
        storyText
      };
      localStorage.setItem('arkham_save', JSON.stringify(gameData));
    }
  }, [screen, activeScenario, currentTime, declaredTrips, visitedLocations]);

  // Перезагружаем аудио при смене дела
  useEffect(() => {
    if (audioRef.current && activeScenario) {
      audioRef.current.src = `/music/${activeScenario.id}.mp3`;
      audioRef.current.load();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setAudioCurrent(0);
      setAudioDuration(0);
      setAudioAvailable(false);
    }
  }, [activeScenario]);

  useEffect(() => {
    if (finalAudioRef.current && activeScenario) {
      const src = activeScenario.finalAudio || `/music/${activeScenario.id}-final.mp3`;
      finalAudioRef.current.src = src;
      finalAudioRef.current.load();
      finalAudioRef.current.pause();
      finalAudioRef.current.currentTime = 0;
      setFinalIsPlaying(false);
      setFinalAudioCurrent(0);
      setFinalAudioDuration(0);
      setFinalAudioAvailable(false);
    }
  }, [activeScenario]);

  const prepareScenario = (scenario) => {
    setPendingScenario(scenario);
    setTripInput('');
    setScreen('trip_prompt');
  };

  const startScenario = (scenario, tripBudget) => {
    setActiveScenario(scenario);
    setCurrentTime(0);
    setDeclaredTrips(tripBudget);
    setVisitedLocations([]);
    setStoryText(scenario.paragraphs["start"]);
    setScreen('game');
    setPendingScenario(null);
    setQuestionsList(scenario.questions);
    setQuestionsAnswers({});
  };

  const confirmTripBudget = () => {
    if (!pendingScenario) return;
    const trips = parseInt(tripInput, 10);
    if (Number.isNaN(trips) || trips <= 0) {
      alert('Введите корректное количество поездок (положительное число).');
      return;
    }
    startScenario(pendingScenario, trips);
  };

  const handleVisitLocation = (e) => {
    e.preventDefault();
    const code = inputCode.trim();
    const paragraphs = activeScenario.paragraphs || {};
    const matchedKey = Object.keys(paragraphs).find(k => String(k).toLowerCase() === String(code).toLowerCase());
    if (!matchedKey) {
      alert("По этому адресу нет информации");
      return;
    }
    const maxTrips = declaredTrips ?? activeScenario?.armitageTrips;
    if (maxTrips !== undefined && currentTime >= maxTrips) {
      alert("Вы уже выполнили лимит поездок.");
      return;
    }
    const textOnLocation = paragraphs[matchedKey];
    setCurrentTime(prev => prev + 1);
    setVisitedLocations(prev => [...prev, { code: code, text: textOnLocation }]);
    setStoryText(textOnLocation);
    setInputCode('');
  };

  const renderStoryText = (text) => {
    const parts = [];
    const tokens = text.split(/(\[\[ritual\]\]|\[\[\/ritual\]\]|\[\[note\]\]|\[\[\/note\]\])/g);
    let renderStyle = null;

    tokens.forEach((token, index) => {
      if (token === '[[ritual]]') {
        renderStyle = 'ritual';
        return;
      }
      if (token === '[[/ritual]]') {
        renderStyle = null;
        return;
      }
      if (token === '[[note]]') {
        renderStyle = 'note';
        return;
      }
      if (token === '[[/note]]') {
        renderStyle = null;
        return;
      }

      if (renderStyle === 'ritual') {
        parts.push(
          <span key={index} style={styles.ritualText}>{token}</span>
        );
      } else if (renderStyle === 'note') {
        parts.push(
          <span key={index} style={styles.noteText}>{token}</span>
        );
      } else {
          // If the token contains an HTML image tag, inject responsive styles and render it as HTML
          if (/<img\s+/.test(token)) {
            const html = token.replace(/<img\b([^>]*)>/i, (match, attrs) => {
              // If img already has a style attribute, append responsive rules; otherwise add a new style
              if (/style\s*=/.test(attrs)) {
                return `<img ${attrs.replace(/style=(['"])(.*?)\1/i, (m, q, s) => `style=${q}${s};max-width:100%;height:auto;display:block;margin:12px auto;${q}`)}>`;
              }
              return `<img ${attrs} style="max-width:100%;height:auto;display:block;margin:12px auto;">`;
            });
            parts.push(
              <span key={index} dangerouslySetInnerHTML={{ __html: html }} />
            );
          } else {
            parts.push(
              <React.Fragment key={index}>{token}</React.Fragment>
            );
          }
      }
    });

    return parts;
  };

  const calculateFinalScore = () => {
    let score = 0;
    if (activeScenario && Array.isArray(activeScenario.answerRules)) {
      for (let idx = 0; idx < activeScenario.answerRules.length; idx++) {
        const rule = activeScenario.answerRules[idx];
        const questionText = activeScenario.questions?.[idx] || '';
        score += evaluateAnswer(questionsAnswers[idx], rule, questionText);
      }
    }

    if (activeScenario && typeof activeScenario.armitageTrips === 'number') {
      const extraTrips = Math.max(0, currentTime - activeScenario.armitageTrips);
      score -= extraTrips;
    }

    if (activeScenario && activeScenario.id === 1) {
      if (visitedLocations.some((loc) => String(loc.code).toUpperCase() === 'А67')) {
        score -= 1;
      }
    }

    return Math.max(0, score);
  };

  const getInsanityText = () => {
    const codes = visitedLocations.map((loc) => String(loc.code).toUpperCase());
    if (codes.includes('А67')) {
      return 'Если вы посетили парк Аптауна (А67) и видели Тёмную Молодь, вы теряете одно очко. Вы испытали душевное потрясение и очень стараетесь убедить себя, что это была лишь игра воображения';
    }
    return '';
  };

  const getFinalEndingText = (score) => {
    const endings = activeScenario?.endings;
    if (!Array.isArray(endings) || endings.length === 0) {
      return '';
    }
    const sortedEndings = [...endings].sort((a, b) => b.minScore - a.minScore);
    const matched = sortedEndings.find((ending) => score >= ending.minScore);
    return matched ? matched.text : '';
  };

  const finalizeAnswers = () => {
    const score = calculateFinalScore();
    setFinalScore(score);
    setFinalInsanity(getInsanityText());
    setFinalEndingText(getFinalEndingText(score));
    setShowConfirm(false);
    setScreen('final');
  };

  const handleSelectAddress = (code) => {
    setInputCode(code);
    setShowAddressBook(false);
    // Фокус на поле ввода после закрытия панели
    setTimeout(() => inputCodeRef.current?.focus(), 100);
  };

  if (screen === 'menu') {
    return (
      <div style={styles.container}>
        <div style={styles.menuBox}>
          <h1 style={styles.menuTitle}>Тайны Аркхэма</h1>
          <p style={styles.menuSubtitle}>Цифровой помощник сыщика</p>
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
            <div key={scen.id} style={styles.scenarioCard} onClick={() => prepareScenario(scen)}>
              <div style={styles.scenarioTitle}>{scen.title}</div>
              <div style={styles.scenarioDesc}>{scen.description}</div>
            </div>
          ))}
          <button style={{ ...styles.actionButton, marginTop: '16px' }} onClick={() => setScreen('menu')}>Назад</button>
        </div>
      </div>
    );
  }

  if (screen === 'trip_prompt') {
    return (
      <div style={styles.container}>
        <div style={styles.scenariosList}>
          <h2 style={styles.sectionTitle}>Начало расследования</h2>
          {pendingScenario && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: '#fbbf24', fontSize: '18px', marginBottom: 6 }}>{pendingScenario.title}</div>
              <div style={{ color: '#d6d3d1', marginBottom: 10 }}>{pendingScenario.description}</div>
            </div>
          )}
          <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#1c1917', borderRadius: 8, border: '1px solid #78350f' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '16px', margin: '0 0 8px 0' }}>📋 Сложность дела</h3>
            <p style={{ color: '#d6d3d1', fontSize: '14px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
              {pendingScenario?.difficultyText || 'Информация о сложности дела не указана.'}
            </p>
          </div>
          <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#a8a29e', fontSize: '14px', display: 'block', marginBottom: 8 }}>
                Количество поездок:
              </label>
              <input
                type="number"
                min="1"
                value={tripInput}
                onChange={(e) => setTripInput(e.target.value)}
                placeholder=""
                style={styles.input}
              />
          </div>
          <button style={styles.actionButton} onClick={confirmTripBudget}>Начать дело</button>
          <button style={styles.secondaryButton} onClick={() => setScreen('select_case')}>Назад к выбору дела</button>
        </div>
      </div>
    );
  }

  if (screen === 'questions') {
    return (
      <div style={styles.container}>
        <div style={styles.textBlock}>
          <h2 style={styles.sectionTitle}>Вопросы по делу</h2>
          <div style={{ marginBottom: 16 }}>
            {questionsList.map((q, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <div style={{ color: '#a8a29e', marginBottom: 6 }}>{idx + 1}. {q}</div>
                <input
                  type="text"
                  value={questionsAnswers[idx] || ''}
                  onChange={(e) => setQuestionsAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                  style={styles.input}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <button
              style={styles.actionButton}
              onClick={() => {
                try {
                  if (activeScenario) {
                    localStorage.setItem(`arkham_answers_${activeScenario.id}`, JSON.stringify(questionsAnswers));
                  }
                } catch (e) {}
                setShowConfirm(true);
              }}
            >Сохранить ответы</button>
            <button style={styles.secondaryButton} onClick={() => setScreen('menu')}>Назад в меню</button>
          </div>
          {showConfirm && (
            <div style={{ marginTop: 20, padding: 18, border: '1px solid #fbbf24', borderRadius: 8, backgroundColor: '#1f1b18' }}>
              <div style={{ marginBottom: 12, color: '#f1f5f9' }}>Ответы сохранены. Хотите подтвердить и перейти к итоговой проверке?</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button style={styles.actionButton} onClick={finalizeAnswers}>Подтвердить и проверить</button>
                <button style={styles.secondaryButton} onClick={() => setShowConfirm(false)}>Отменить</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'final') {
    return (
      <div style={styles.container}>
        <div style={styles.textBlock}>
          <h2 style={styles.sectionTitle}>Итоги расследования</h2>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8, color: '#fbbf24' }}>Аудиоплеер развязки</h3>
            <button
              type="button"
              style={{ ...styles.actionButton, padding: '8px 16px', fontSize: '14px', width: '100%' }}
              onClick={() => {
                try {
                  if (!finalAudioRef.current || !finalAudioAvailable) {
                    alert('Аудиофайл развязки не найден: поместите файл в папку public/music с нужным именем');
                    return;
                  }
                  if (finalIsPlaying) {
                    finalAudioRef.current.pause();
                  } else {
                    finalAudioRef.current.play().catch(() => {});
                  }
                } catch (e) {}
              }}
            >
              {finalIsPlaying ? '⏸️ Остановить развязку' : '▶️ Воспроизвести развязку'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <input
                type="range"
                min={0}
                max={finalAudioDuration || 0}
                step={0.1}
                value={finalAudioCurrent}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (finalAudioRef.current) finalAudioRef.current.currentTime = v;
                  setFinalAudioCurrent(v);
                }}
                style={{ flex: 1 }}
              />
              <div style={{ minWidth: 80, textAlign: 'right', fontSize: 12 }}>
                {formatTime(finalAudioCurrent)} / {formatTime(finalAudioDuration)}
              </div>
            </div>
          </div>
          {finalEndingText && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 8, color: '#fbbf24' }}>Дело раскрыто!</h3>
              <p style={{ color: '#d6d3d1', lineHeight: 1.7 }}>{finalEndingText}</p>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8, color: '#fbbf24' }}>Потеря рассудка</h3>
            <p style={{ color: '#d6d3d1', lineHeight: 1.7 }}>{finalInsanity}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8, color: '#fbbf24' }}>Баллы</h3>
            <p style={{ color: '#d6d3d1', fontSize: 18, fontWeight: 'bold' }}>{finalScore}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <button style={styles.actionButton} onClick={() => setScreen('menu')}>Вернуться в меню</button>
            <button style={styles.secondaryButton} onClick={() => setScreen('select_case')}>Выбрать новое дело</button>
          </div>
          <audio
            ref={finalAudioRef}
            src={activeScenario ? (activeScenario.finalAudio || `/music/${activeScenario.id}-final.mp3`) : ''}
            preload="auto"
            onLoadedMetadata={() => {
              if (!finalAudioRef.current) return;
              setFinalAudioDuration(finalAudioRef.current.duration || 0);
              setFinalAudioAvailable(true);
            }}
            onError={() => setFinalAudioAvailable(false)}
            onTimeUpdate={() => {
              if (!finalAudioRef.current) return;
              setFinalAudioCurrent(finalAudioRef.current.currentTime || 0);
            }}
            onPlay={() => setFinalIsPlaying(true)}
            onPause={() => setFinalIsPlaying(false)}
            onEnded={() => setFinalIsPlaying(false)}
            style={{ display: 'none' }}
          />
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
              <span style={{ color: '#a8a29e' }}>Поездок совершено:</span>
              <span style={styles.timeText}>{currentTime}{declaredTrips !== null ? ` / ${declaredTrips}` : ''}</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#a8a29e', fontSize: '16px', marginBottom: '8px' }}>Аудиоплеер</h3>
              <button
                type="button"
                style={{ ...styles.actionButton, padding: '8px 16px', fontSize: '14px', width: '100%' }}
                onClick={() => {
                  try {
                    if (!audioRef.current || !audioAvailable) {
                      alert('Аудиофайл не найден: поместите файл в папку public/music с именем {id}.mp3');
                      return;
                    }
                    if (isPlaying) {
                      audioRef.current.pause();
                    } else {
                      audioRef.current.play().catch(() => {});
                    }
                  } catch (e) {}
                }}
              >
                {isPlaying ? '⏸️ Остановить' : '▶️ Вступление к делу'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <input
                  type="range"
                  min={0}
                  max={audioDuration || 0}
                  step={0.1}
                  value={audioCurrent}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = v;
                    setAudioCurrent(v);
                  }}
                  style={{ flex: 1 }}
                />
                <div style={{ minWidth: 80, textAlign: 'right', fontSize: 12 }}>
                  {formatTime(audioCurrent)} / {formatTime(audioDuration)}
                </div>
              </div>
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
            <button 
              style={{ ...styles.secondaryButton, backgroundColor: '#292524', marginTop: '12px' }} 
              onClick={() => setShowAddressBook(true)}
            >
              📖 Адресная книга
            </button>
            <button 
              style={{ ...styles.secondaryButton, backgroundColor: '#7f1d1d', color: '#fecaca', marginTop: '8px', border: '1px solid #991b1b' }} 
              onClick={() => {
                if (window.confirm("Завершить дело и перейти к вопросам?")) {
                  setScreen('questions');
                }
              }}
            >
              📝 Перейти к ответам
            </button>
            {/* Кнопка безопасного выхода с сохранением прогресса */}
            <button 
              style={styles.secondaryButton} 
              onClick={() => {
                if (window.confirm("Вы хотите завершить дело и перейти к меню?")) {
                  localStorage.removeItem('arkham_save');
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
            {/* Скрытый audio-элемент: источник обновляется при выборе дела */}
            <audio
              ref={audioRef}
              src={activeScenario ? `/music/${activeScenario.id}.mp3` : ''}
              preload="auto"
              onLoadedMetadata={() => {
                if (!audioRef.current) return;
                setAudioDuration(audioRef.current.duration || 0);
                setAudioAvailable(true);
              }}
              onError={() => setAudioAvailable(false)}
              onTimeUpdate={() => {
                if (!audioRef.current) return;
                setAudioCurrent(audioRef.current.currentTime || 0);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
            <div>
              <h2 style={styles.sectionTitle}>События</h2>
              <div style={styles.storyText}>{renderStoryText(storyText)}</div>
              <div style={{ marginTop: '12px' }}>
                {(() => {
                  const tripsExceeded = activeScenario && declaredTrips !== null && currentTime >= declaredTrips;
                  return (
                  <form onSubmit={handleVisitLocation} style={styles.form}>
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Код..."
                      style={styles.input}
                      disabled={tripsExceeded}
                      ref={inputCodeRef}
                    />
                    <button type="submit" style={styles.actionButton} disabled={tripsExceeded}>Идти туда</button>
                    {tripsExceeded && (
                      <button
                        type="button"
                        style={{ ...styles.secondaryButton, marginLeft: 8 }}
                        onClick={() => setScreen('questions')}
                      >Перейти к вопросам</button>
                    )}
                  </form>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddressBookPanel
        isOpen={showAddressBook}
        onClose={() => setShowAddressBook(false)}
        onSelectAddress={handleSelectAddress}
      />
    </div>
  );
}

