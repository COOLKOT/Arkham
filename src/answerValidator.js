// Умная проверка ответов по смыслу (работает полностью локально)

// Стоп-слова русского языка
const STOP_WORDS = new Set([
  'и', 'в', 'не', 'на', 'с', 'по', 'к', 'у', 'из', 'от', 'до',   'о', 'об',
  'а', 'но', 'что', 'как', 'это', 'то', 'он', 'она', 'оно', 'они', 'я', 'ты',
  'мы', 'вы', 'мне', 'тебе', 'его', 'её', 'их', 'меня', 'тебя', 'нас', 'вас',
  'для', 'ли', 'бы', 'же', 'только', 'ещё', 'уже', 'очень', 'тут', 'там',
  'или', 'все', 'всё', 'каждый', 'мой', 'твой', 'свой', 'при', 'про',
  'так', 'еще', 'очень', 'тоже', 'сам', 'себя', 'ничто'
]);

// Лемматизация русских слов (упрощённая)
function lemmatize(word) {
  word = word.toLowerCase().trim();
  word = word.replace(/[^\wа-яё]/gi, '');
  if (!word || word.length < 3) return word;

  // Удаляем окончания
  const endings = [
    'ами', 'ями', 'ов', 'ев', 'ей', 'ий', 'ые',
    'ы', 'и', 'а', 'я', 'о', 'е', 'у', 'ю', 'ем', 'ом', 'ам', 'ям',
    'ая', 'яя', 'ое', 'ее', 'ые', 'ие',
    'ть', 'ти', 'л', 'ла', 'ло', 'ли', 'ся', 'сь',
    'ет', 'ют', 'ят', 'ем', 'им', 'у', 'ю',
    'ал', 'ла', 'ло', 'ли', 'ый', 'ая', 'ое', 'ые'
  ];

  let bestStem = word;
  let bestScore = 0;

  for (const ending of endings) {
    if (word.length > ending.length + 2) {
      const stem = word.slice(0, -ending.length);
      const consonants = stem.replace(/[аеёиоуыэюя]/gi, '').length;
      const score = consonants * 2 + (stem.length > 2 ? 1 : 0);
      if (score > bestScore && consonants >= 1) {
        bestStem = stem;
        bestScore = score;
      }
    }
  }

  return bestStem.length >= 3 ? bestStem : word;
}

// Разбор текста на леммы
function parseText(text) {
  return text.toLowerCase()
    .split(/[\s,;.!?-]+/)
    .map(w => lemmatize(w))
    .filter(w => w && w.length >= 3 && !STOP_WORDS.has(w));
}

// Нечёткое сравнение двух слов
function wordSimilarity(w1, w2) {
  w1 = w1.toLowerCase();
  w2 = w2.toLowerCase();
  if (w1 === w2) return 1;
  if (!w1 || !w2) return 0;

  // Проверка вхождения
  if (w1.includes(w2) || w2.includes(w1)) return 0.7;

  // Расстояние Левенштейна
  const len1 = w1.length, len2 = w2.length;
  const matrix = [];
  for (let i = 0; i <= len1; i++) matrix[i] = [i];
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      matrix[i][j] = Math.min(
        matrix[i-1][j] + 1,
        matrix[i][j-1] + 1,
        matrix[i-1][j-1] + (w1[i-1] !== w2[j-1] ? 1 : 0)
      );
    }
  }
  return 1 - matrix[len1][len2] / Math.max(len1, len2);
}

// Главная функция оценки
export function evaluateAnswer(answer, rule, _question) {
  if (!answer || !rule || !rule.correctAnswer) return 0;

  const answerText = String(answer).toLowerCase();
  const correctText = String(rule.correctAnswer).toLowerCase();

  if (!answerText.trim()) return 0;

  // 1. Точное совпадение ключевых слов
  if (rule.keywords) {
    const matched = rule.keywords.some(kw => answerText.includes(kw.toLowerCase()));
    if (matched) return rule.points;
  }

  // 2. Синонимы
  if (rule.synonyms) {
    const matched = rule.synonyms.some(syn => answerText.includes(syn.toLowerCase()));
    if (matched) return rule.points;
  }

  // 3. Fallback
  if (rule.fallback) {
    if (rule.fallback.keywords) {
      const matched = rule.fallback.keywords.some(kw => answerText.includes(kw.toLowerCase()));
      if (matched) return rule.fallback.points;
    }
    if (rule.fallback.synonyms) {
      const matched = rule.fallback.synonyms.some(syn => answerText.includes(syn.toLowerCase()));
      if (matched) return rule.fallback.points;
    }
  }

  // 4. Сравнение по смыслу (лемматизация + нечёткий поиск)
  const answerLemmas = parseText(answerText);
  const correctLemmas = parseText(correctText);

  if (answerLemmas.length === 0 || correctLemmas.length === 0) return 0;

  let matchCount = 0;
  let totalScore = 0;

  for (const cl of correctLemmas) {
    let bestMatch = 0;
    for (const al of answerLemmas) {
      const sim = wordSimilarity(cl, al);
      if (sim > bestMatch) bestMatch = sim;
    }
    totalScore += bestMatch;
    if (bestMatch > 0.5) matchCount++;
  }

  const similarity = totalScore / correctLemmas.length;

  // Если совпало больше 60% — засчитываем максимум
  if (similarity > 0.6) return rule.points;

  // Если совпало больше 40% — полбалла
  if (similarity > 0.4) return Math.round(rule.points / 2);

  return 0;
}
