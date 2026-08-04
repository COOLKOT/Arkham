import React, { useState, useRef } from 'react';
import AddressBookPanel from './components/AddressBookPanel';
import AlliesList from './components/AlliesList';
import NotesPanel from './components/NotesPanel';
import AudioPlayerControls from './components/AudioPlayerControls';
import LocationInputAutocomplete from './components/LocationInputAutocomplete';
import MainMenu from './components/MainMenu';
import InstructionScreen from './components/InstructionScreen';
import CaseSelector from './components/CaseSelector';
import TripPrompt from './components/TripPrompt';
import QuestionsScreen from './components/QuestionsScreen';
import FinalScreen from './components/FinalScreen';
import { ARMITAGE_HELP_ITEMS } from './helpData';
import { useGameState } from './hooks/useGameState';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { playClickSound, playPageTurnSound } from './utils/soundEffects';
import BackgroundVideo from './components/BackgroundVideo';
import './index.css';

const styles = {
  gameContainer: { width: '100%', maxWidth: '1240px', minHeight: '100vh', padding: '24px' },
  header: { borderBottom: '2px solid #78350f', paddingBottom: '16px', marginBottom: '24px', textAlign: 'center' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-title)' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '24px' },
  sidebar: { flex: '1', minWidth: '300px', padding: '24px' },
  mainContent: { flex: '2', minWidth: '340px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  sectionTitle: { fontSize: '22px', marginBottom: '16px', color: '#fbbf24', borderBottom: '1px solid #78350f', paddingBottom: '8px', marginTop: 0 },
  timeText: { fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginLeft: '8px', fontFamily: 'monospace' },
  tagButton: { backgroundColor: '#332c26', color: '#fde68a', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', border: '1px solid #fbbf24', display: 'inline-block', cursor: 'pointer', transition: 'all 0.2s' },
  storyText: { fontSize: '19px', lineHeight: '1.7', color: '#e7e5e4', fontStyle: 'italic', whiteSpace: 'pre-line' },
  ritualText: { fontFamily: 'var(--font-typewriter)', fontStyle: 'normal', color: '#fbbf24', letterSpacing: '0.08em', fontWeight: 600, display: 'inline-block', textAlign: 'center', whiteSpace: 'pre-line', margin: '20px auto', fontSize: '20px', lineHeight: '1.4' },
  noteText: { fontFamily: 'var(--font-typewriter)', fontStyle: 'normal', color: '#f8e7b5', letterSpacing: '0.02em', display: 'block', textAlign: 'center', whiteSpace: 'pre-wrap', margin: '24px auto', padding: '18px 24px', borderRadius: '12px', border: '1px dashed rgba(255, 235, 183, 0.5)', backgroundColor: 'var(--bg-paper)', maxWidth: '720px', fontSize: '18px', lineHeight: '1.5', boxShadow: '0 16px 30px rgba(0, 0, 0, 0.35)' },
  form: { marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #78350f', display: 'flex', gap: '16px', alignItems: 'center' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  tabButton: { backgroundColor: '#332c26', color: '#fde68a', border: '1px solid #78350f', borderRadius: '999px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' },
  tabButtonActive: { backgroundColor: '#b45309', color: '#fef3c7', borderColor: '#f59e0b', fontWeight: 'bold' }
};

export default function App() {
  const gameState = useGameState();
  const {
    screen,
    setScreen,
    hasSavedGame,
    resumeGame,
    clearSave,
    activeScenario,
    pendingScenario,
    currentTime,
    declaredTrips,
    visitedLocations,
    storyText,
    setStoryText,
    notes,
    setNotes,
    questionsList,
    questionsAnswers,
    finalScore,
    finalInsanity,
    finalEndingText,
    prepareScenario,
    startScenario,
    visitLocation,
    finalizeAnswers,
    exitToMenu,
    exitAndResetSave
  } = gameState;

  const [inputCode, setInputCode] = useState('');
  const [activeTab, setActiveTab] = useState('events');
  const [selectedAllyName, setSelectedAllyName] = useState('');
  const [showAddressBook, setShowAddressBook] = useState(false);
  const inputCodeRef = useRef(null);

  const introAudioSrc = activeScenario ? `/music/${activeScenario.id}.mp3` : '';
  const introAudioPlayer = useAudioPlayer(introAudioSrc);

  const executeGoToLocation = (codeToVisit) => {
    const code = String(codeToVisit || '').trim();
    if (!code) return;

    const paragraphs = activeScenario?.paragraphs || {};
    const matchedKey = Object.keys(paragraphs).find(k => String(k).toLowerCase() === String(code).toLowerCase());

    if (!matchedKey) {
      alert("По этому адресу нет информации");
      return;
    }

    const codeUpper = String(code).toUpperCase();
    const hasVisitedLibrary = visitedLocations.some((loc) => String(loc.code).toUpperCase() === 'У23');
    const isFreeArmitageVisit = codeUpper === 'У23А' && hasVisitedLibrary;
    const maxTrips = declaredTrips ?? activeScenario?.armitageTrips;

    if (maxTrips !== undefined && currentTime >= maxTrips && !isFreeArmitageVisit) {
      alert("Вы уже выполнили лимит поездок.");
      return;
    }

    playPageTurnSound();
    const textOnLocation = paragraphs[matchedKey];
    visitLocation(code, textOnLocation);
    setInputCode('');
    setActiveTab('events');
  };

  const handleVisitLocationForm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    executeGoToLocation(inputCode);
  };

  const renderStoryText = (text) => {
    if (!text) return null;
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
        parts.push(<span key={index} style={styles.ritualText}>{token}</span>);
      } else if (renderStyle === 'note') {
        parts.push(<span key={index} style={styles.noteText}>{token}</span>);
      } else {
        if (/<img\s+/.test(token)) {
          const html = token.replace(/<img\b([^>]*)>/i, (match, attrs) => {
            if (/style\s*=/.test(attrs)) {
              return `<img ${attrs.replace(/style=(['"])(.*?)\1/i, (m, q, s) => `style=${q}${s};max-width:100%;height:auto;display:block;margin:12px auto;${q}`)}>`;
            }
            return `<img ${attrs} style="max-width:100%;height:auto;display:block;margin:12px auto;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,0.5)">`;
          });
          parts.push(<span key={index} dangerouslySetInnerHTML={{ __html: html }} />);
        } else {
          parts.push(<React.Fragment key={index}>{token}</React.Fragment>);
        }
      }
    });

    return parts;
  };

  const handleSelectAddress = (code) => {
    setInputCode(code);
    setShowAddressBook(false);
    setTimeout(() => inputCodeRef.current?.focus(), 100);
  };

  const switchTab = (tab) => {
    playClickSound();
    setActiveTab(tab);
  };

  const renderScreen = () => {
    if (screen === 'menu') {
      return (
        <MainMenu
          hasSavedGame={hasSavedGame}
          onResume={() => { playClickSound(); resumeGame(); }}
          onSelectCase={() => { playClickSound(); setScreen('select_case'); }}
          onInstruction={() => { playClickSound(); setScreen('instruction'); }}
          onClearSave={clearSave}
        />
      );
    }

    if (screen === 'instruction') {
      return <InstructionScreen onBack={() => { playClickSound(); exitToMenu(); }} />;
    }

    if (screen === 'select_case') {
      return (
        <CaseSelector
          onSelectScenario={(scen) => { playClickSound(); prepareScenario(scen); }}
          onBack={() => { playClickSound(); exitToMenu(); }}
        />
      );
    }

    if (screen === 'trip_prompt') {
      return (
        <TripPrompt
          scenario={pendingScenario}
          onConfirm={(budget) => { playClickSound(); startScenario(pendingScenario, budget); }}
          onBack={() => { playClickSound(); setScreen('select_case'); }}
        />
      );
    }

    if (screen === 'questions') {
      return (
        <QuestionsScreen
          questionsList={questionsList}
          answers={questionsAnswers}
          onSaveAnswers={(ans) => gameState.setQuestionsAnswers(ans)}
          onFinalize={(ans) => finalizeAnswers(ans)}
          onBackToMenu={() => { playClickSound(); exitToMenu(); }}
        />
      );
    }

    if (screen === 'final') {
      return (
        <FinalScreen
          activeScenario={activeScenario}
          finalScore={finalScore}
          finalInsanity={finalInsanity}
          finalEndingText={finalEndingText}
          onBackToMenu={() => { playClickSound(); exitToMenu(); }}
          onSelectNewCase={() => { playClickSound(); setScreen('select_case'); }}
        />
      );
    }

    // SCREEN === 'game'
    const tripsExceeded = activeScenario && declaredTrips !== null && currentTime >= declaredTrips;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', minHeight: '100vh' }}>
        <div style={styles.gameContainer}>
          <header style={styles.header}>
            <h1 style={styles.title}>{activeScenario?.title || 'Расследование'}</h1>
          </header>

          <div style={styles.grid}>
            {/* SIDEBAR */}
            <div className="arkham-card" style={styles.sidebar}>
              <h2 style={styles.sectionTitle}>Журнал</h2>

              <div style={{ marginBottom: '18px' }}>
                <span style={{ color: '#a8a29e' }}>Поездок совершено:</span>
                <span style={styles.timeText}>{currentTime}{declaredTrips !== null ? ` / ${declaredTrips}` : ''}</span>
              </div>

              {/* AUDIO PLAYER */}
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

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#a8a29e', fontSize: '16px', marginBottom: '8px' }}>Посещённые места:</h3>
                {visitedLocations.length === 0 ? (
                  <div style={{ color: '#78350f', fontSize: '14px', fontStyle: 'italic' }}>Вы ещё не посещали локации</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {visitedLocations.map((loc, idx) => (
                      <button
                        key={idx}
                        style={styles.tagButton}
                        onClick={() => {
                          playPageTurnSound();
                          setStoryText(loc.text);
                          setActiveTab('events');
                        }}
                      >
                        Локация {loc.code} 🔍
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => { playClickSound(); setShowAddressBook(true); }}
                >
                  📖 Адресная книга
                </button>

                <button
                  className="btn-danger"
                  style={{ width: '100%' }}
                  onClick={() => {
                    playClickSound();
                    if (window.confirm("Завершить дело и перейти к вопросам?")) {
                      setScreen('questions');
                    }
                  }}
                >
                  📝 Перейти к ответам
                </button>

                <button
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '13px' }}
                  onClick={() => {
                    playClickSound();
                    if (window.confirm("Выйти в меню? Прогресс сохранён на этом устройстве.")) {
                      exitToMenu();
                    }
                  }}
                >
                  ↩ В меню (С сохранением)
                </button>

                <button
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '12px', color: '#ef4444' }}
                  onClick={() => {
                    playClickSound();
                    if (window.confirm("Удалить сохранение этого дела и выйти в меню?")) {
                      exitAndResetSave();
                    }
                  }}
                >
                  🗑️ Сбросить дело и выйти
                </button>
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="arkham-card" style={styles.mainContent}>
              <div>
                <div style={styles.tabs}>
                  <button
                    type="button"
                    style={{ ...styles.tabButton, ...(activeTab === 'events' ? styles.tabButtonActive : {}) }}
                    onClick={() => switchTab('events')}
                  >
                    📖 Текст делопроизводства
                  </button>
                  <button
                    type="button"
                    style={{ ...styles.tabButton, ...(activeTab === 'notes' ? styles.tabButtonActive : {}) }}
                    onClick={() => switchTab('notes')}
                  >
                    📓 Блокнот сыщика
                  </button>
                  <button
                    type="button"
                    style={{ ...styles.tabButton, ...(activeTab === 'allies' ? styles.tabButtonActive : {}) }}
                    onClick={() => switchTab('allies')}
                  >
                    🤝 Союзники
                  </button>
                  <button
                    type="button"
                    style={{ ...styles.tabButton, ...(activeTab === 'armitage' ? styles.tabButtonActive : {}) }}
                    onClick={() => switchTab('armitage')}
                  >
                    🏛️ Помощь Армитеджа
                  </button>
                </div>

                {activeTab === 'events' && (
                  <div className="animate-fade-in">
                    <div style={styles.storyText}>{renderStoryText(storyText)}</div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="animate-fade-in">
                    <NotesPanel notes={notes} onSaveNotes={setNotes} />
                  </div>
                )}

                {activeTab === 'allies' && (
                  <div className="animate-fade-in">
                    <AlliesList
                      allies={activeScenario?.allies || []}
                      selectedAllyName={selectedAllyName}
                      onSelectAlly={setSelectedAllyName}
                      onGoToAddress={(code) => executeGoToLocation(code)}
                    />
                  </div>
                )}

                {activeTab === 'armitage' && (
                  <div className="animate-fade-in">
                    <AlliesList
                      allies={ARMITAGE_HELP_ITEMS}
                      selectedAllyName={selectedAllyName}
                      onSelectAlly={setSelectedAllyName}
                      onGoToAddress={(code) => executeGoToLocation(code)}
                    />
                  </div>
                )}
              </div>

              {/* LOCATION VISIT FORM WITH SMART AUTOCOMPLETE */}
              <form onSubmit={handleVisitLocationForm} style={styles.form}>
                <LocationInputAutocomplete
                  value={inputCode}
                  onChange={setInputCode}
                  onSubmit={(code) => executeGoToLocation(code)}
                  activeScenario={activeScenario}
                  visitedLocations={visitedLocations}
                  disabled={tripsExceeded}
                  inputRef={inputCodeRef}
                />
                <button type="submit" className="btn-primary" disabled={tripsExceeded}>
                  Отправиться
                </button>
                {tripsExceeded && (
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => setScreen('questions')}
                  >
                    К вопросам
                  </button>
                )}
              </form>
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
  };

  return (
    <>
      <BackgroundVideo src="/video/bg.mp4" overlayOpacity={0.65} />
      {renderScreen()}
    </>
  );
}
