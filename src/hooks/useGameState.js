import { useState, useEffect } from 'react';
import { evaluateAnswer } from '../answerValidator';

const SAVE_KEY = 'arkham_save';

export function useGameState() {
  const [screen, setScreen] = useState('menu');
  const [activeScenario, setActiveScenario] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [declaredTrips, setDeclaredTrips] = useState(null);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [storyText, setStoryText] = useState('');
  const [notes, setNotes] = useState('');
  const [pendingScenario, setPendingScenario] = useState(null);
  const [questionsList, setQuestionsList] = useState([]);
  const [questionsAnswers, setQuestionsAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(null);
  const [finalInsanity, setFinalInsanity] = useState('');
  const [finalEndingText, setFinalEndingText] = useState('');
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Check if save exists on mount
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(SAVE_KEY);
      if (savedRaw) {
        setHasSavedGame(true);
      }
    } catch {}
  }, []);

  // Auto-save whenever state changes in game mode
  useEffect(() => {
    if (screen === 'game' && activeScenario) {
      const gameData = {
        activeScenario,
        currentTime,
        declaredTrips,
        visitedLocations,
        storyText,
        notes,
        questionsAnswers
      };
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
        setHasSavedGame(true);
      } catch {}
    }
  }, [screen, activeScenario, currentTime, declaredTrips, visitedLocations, storyText, notes, questionsAnswers]);

  const resumeGame = () => {
    try {
      const savedRaw = localStorage.getItem(SAVE_KEY);
      if (!savedRaw) return;
      const data = JSON.parse(savedRaw);
      if (data.activeScenario) {
        setActiveScenario(data.activeScenario);
        setCurrentTime(data.currentTime || 0);
        setDeclaredTrips(data.declaredTrips ?? null);
        setVisitedLocations(data.visitedLocations || []);
        setStoryText(data.storyText || data.activeScenario.paragraphs?.['start'] || '');
        setNotes(data.notes || '');
        setQuestionsList(data.activeScenario.questions || []);
        setQuestionsAnswers(data.questionsAnswers || {});
        setScreen('game');
      }
    } catch (e) {
      console.error("Failed to restore save:", e);
    }
  };

  const clearSave = () => {
    try {
      localStorage.removeItem(SAVE_KEY);
      setHasSavedGame(false);
    } catch {}
  };

  const prepareScenario = (scenario) => {
    setPendingScenario(scenario);
    setScreen('trip_prompt');
  };

  const startScenario = (scenario, tripBudget) => {
    setActiveScenario(scenario);
    setCurrentTime(0);
    setDeclaredTrips(tripBudget);
    setVisitedLocations([]);
    setStoryText(scenario.paragraphs?.['start'] || '');
    setNotes('');
    setQuestionsList(scenario.questions || []);
    setQuestionsAnswers({});
    setPendingScenario(null);
    setScreen('game');
  };

  const visitLocation = (code, text) => {
    const codeUpper = String(code).toUpperCase();
    const hasVisitedLibrary = visitedLocations.some((loc) => String(loc.code).toUpperCase() === 'У23');
    const isFreeArmitageVisit = codeUpper === 'У23А' && hasVisitedLibrary;

    if (!isFreeArmitageVisit) {
      setCurrentTime(prev => prev + 1);
    }
    setVisitedLocations(prev => [...prev, { code, text }]);
    setStoryText(text);
  };

  const calculateFinalScore = (answersToUse = questionsAnswers) => {
    let score = 0;
    if (activeScenario && Array.isArray(activeScenario.answerRules)) {
      for (let idx = 0; idx < activeScenario.answerRules.length; idx++) {
        const rule = activeScenario.answerRules[idx];
        const questionText = activeScenario.questions?.[idx] || '';
        score += evaluateAnswer(answersToUse[idx], rule, questionText);
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
      return 'Если вы посетили парк Аптауна (А67) и видели Тёмную Молодь, вы теряете одно очко. Вы испытали душевное потрясение и очень стараетесь убедить себя, что это была лишь игра воображения.';
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

  const finalizeAnswers = (answersToUse) => {
    const finalAnswers = answersToUse || questionsAnswers;
    setQuestionsAnswers(finalAnswers);
    const score = calculateFinalScore(finalAnswers);
    setFinalScore(score);
    setFinalInsanity(getInsanityText());
    setFinalEndingText(getFinalEndingText(score));
    clearSave();
    setScreen('final');
  };

  const exitToMenu = () => {
    setScreen('menu');
  };

  const exitAndResetSave = () => {
    clearSave();
    setActiveScenario(null);
    setVisitedLocations([]);
    setCurrentTime(0);
    setNotes('');
    setScreen('menu');
  };

  return {
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
    setQuestionsAnswers,
    finalScore,
    finalInsanity,
    finalEndingText,
    prepareScenario,
    startScenario,
    visitLocation,
    finalizeAnswers,
    exitToMenu,
    exitAndResetSave
  };
}
