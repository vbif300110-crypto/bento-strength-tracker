import { EXERCISES, getAgeFactor } from './data.js';

// Состояние атлета и калькулятора
const state = {
  age: 16,
  weight: 70,
  height: 177,
  selectedCategory: 'all',
  selectedExerciseId: 'bench_press',
  inputMode: '1rm', // '1rm' | 'reps'
  inputWeight: 70,
  inputReps: 8
};

// DOM узлы
const headerAthleteBadge = document.getElementById('headerAthleteBadge');
const athleteHeightDisplay = document.getElementById('athleteHeightDisplay');
const athleteCoeffDisplay = document.getElementById('athleteCoeffDisplay');
const exerciseSelect = document.getElementById('exerciseSelect');
const categoryTabs = document.getElementById('categoryTabs');
const exerciseUnitHint = document.getElementById('exerciseUnitHint');

const mode1RM = document.getElementById('mode1RM');
const modeReps = document.getElementById('modeReps');
const repsContainer = document.getElementById('repsContainer');

const weightLabel = document.getElementById('weightLabel');
const weightValue = document.getElementById('weightValue');
const weightRange = document.getElementById('weightRange');
const weightMinus = document.getElementById('weightMinus');
const weightPlus = document.getElementById('weightPlus');

const repsValue = document.getElementById('repsValue');
const repsRange = document.getElementById('repsRange');
const repsMinus = document.getElementById('repsMinus');
const repsPlus = document.getElementById('repsPlus');

const calculated1RMBadge = document.getElementById('calculated1RMBadge');

// Элементы графика
const valNovice = document.getElementById('valNovice');
const valInter = document.getElementById('valInter');
const valAdv = document.getElementById('valAdv');
const valElite = document.getElementById('valElite');

const barNovice = document.getElementById('barNovice');
const barInter = document.getElementById('barInter');
const barAdv = document.getElementById('barAdv');
const barElite = document.getElementById('barElite');

// Вердикт
const userRankTitle = document.getElementById('userRankTitle');
const userRatioBadge = document.getElementById('userRatioBadge');
const userNextRankGap = document.getElementById('userNextRankGap');
const rankProgressBar = document.getElementById('rankProgressBar');
const coachVerdictText = document.getElementById('coachVerdictText');

// Модальное окно
const athleteModal = document.getElementById('athleteModal');
const openAthleteModal = document.getElementById('openAthleteModal');
const closeAthleteModal = document.getElementById('closeAthleteModal');
const saveAthleteBtn = document.getElementById('saveAthleteBtn');
const inputAge = document.getElementById('inputAge');
const inputWeight = document.getElementById('inputWeight');
const inputHeight = document.getElementById('inputHeight');

// Инициализация выпадающего списка упражнений
function populateExercises() {
  const currentCategory = state.selectedCategory;
  const filtered = currentCategory === 'all'
    ? EXERCISES
    : EXERCISES.filter(ex => ex.category === currentCategory);

  exerciseSelect.innerHTML = '';
  filtered.forEach(ex => {
    const opt = document.createElement('option');
    opt.value = ex.id;
    opt.textContent = ex.name;
    if (ex.id === state.selectedExerciseId) opt.selected = true;
    exerciseSelect.appendChild(opt);
  });

  // Если выбранное упражнение не входит в новую категорию, переключаем на первое
  if (!filtered.some(ex => ex.id === state.selectedExerciseId) && filtered.length > 0) {
    state.selectedExerciseId = filtered[0].id;
    exerciseSelect.value = state.selectedExerciseId;
  }

  updateExerciseDetails();
}

function updateExerciseDetails() {
  const ex = EXERCISES.find(e => e.id === state.selectedExerciseId);
  if (!ex) return;

  exerciseUnitHint.textContent = ex.desc;

  // Настройка лимитов ползунка под тип упражнения
  if (ex.type === 'dumbbell') {
    weightRange.min = 4;
    weightRange.max = 70;
    weightRange.step = 1;
    weightLabel.textContent = 'Вес 1 гантели';
    if (state.inputWeight > 70) state.inputWeight = 30;
  } else if (ex.type === 'bodyweight_plus') {
    weightRange.min = 0;
    weightRange.max = 100;
    weightRange.step = 2.5;
    weightLabel.textContent = 'Дополнительный вес';
    if (state.inputWeight > 100) state.inputWeight = 15;
  } else {
    weightRange.min = 15;
    weightRange.max = 280;
    weightRange.step = 2.5;
    weightLabel.textContent = 'Вес штанги / отягощения';
  }

  weightRange.value = state.inputWeight;
  weightValue.textContent = state.inputWeight;
  calculateAndRender();
}

// Расчет 1RM по Эпли
function calculate1RM(weight, reps) {
  if (state.inputMode === '1rm' || reps <= 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

// Расчет и отрисовка данных
function calculateAndRender() {
  const ex = EXERCISES.find(e => e.id === state.selectedExerciseId);
  if (!ex) return;

  const ageFactor = getAgeFactor(state.age);
  const bw = state.weight;

  // Нормативы под вес атлета и возрастную поправку
  const targets = {
    novice: Math.round(bw * ex.ratios.novice * ageFactor),
    inter: Math.round(bw * ex.ratios.inter * ageFactor),
    adv: Math.round(bw * ex.ratios.adv * ageFactor),
    elite: Math.round(bw * ex.ratios.elite * ageFactor)
  };

  const calculated1RM = calculate1RM(Number(state.inputWeight), Number(state.inputReps));

  // Обновление цифр графика
  valNovice.textContent = `${targets.novice} кг`;
  valInter.textContent = `${targets.inter} кг`;
  valAdv.textContent = `${targets.adv} кг`;
  valElite.textContent = `${targets.elite} кг`;

  calculated1RMBadge.textContent = `${calculated1RM} кг`;

  // Определение уровня
  let rank = 'Новичок';
  let nextRankName = 'Средний';
  let currentBase = 0;
  let targetNext = targets.inter;
  let activeBarId = 'barNovice';

  if (calculated1RM < targets.novice) {
    rank = 'Начальный старт';
    nextRankName = 'Новичок';
    currentBase = 0;
    targetNext = targets.novice;
    activeBarId = null;
  } else if (calculated1RM < targets.inter) {
    rank = 'Новичок';
    nextRankName = 'Средний';
    currentBase = targets.novice;
    targetNext = targets.inter;
    activeBarId = 'barNovice';
  } else if (calculated1RM < targets.adv) {
    rank = 'Средний уровень';
    nextRankName = 'Профи';
    currentBase = targets.inter;
    targetNext = targets.adv;
    activeBarId = 'barInter';
  } else if (calculated1RM < targets.elite) {
    rank = 'Продвинутый (Профи)';
    nextRankName = 'Элита';
    currentBase = targets.adv;
    targetNext = targets.elite;
    activeBarId = 'barAdv';
  } else {
    rank = 'Элитный атлет';
    nextRankName = 'Максимум достигнут';
    currentBase = targets.elite;
    targetNext = targets.elite;
    activeBarId = 'barElite';
  }

  // Обновление подсветки столбиков
  [
    { el: barNovice, id: 'barNovice', baseHeight: 35 },
    { el: barInter, id: 'barInter', baseHeight: 55 },
    { el: barAdv, id: 'barAdv', baseHeight: 75 },
    { el: barElite, id: 'barElite', baseHeight: 100 }
  ].forEach(bar => {
    const indicator = bar.el.querySelector('.active-indicator');
    if (bar.id === activeBarId) {
      bar.el.classList.remove('bg-[#24272D]');
      bar.el.classList.add('bg-white');
      if (indicator) indicator.classList.remove('hidden');
    } else {
      bar.el.classList.add('bg-[#24272D]');
      bar.el.classList.remove('bg-white');
      if (indicator) indicator.classList.add('hidden');
    }
  });

  // Заполнение карточки вердикта
  userRankTitle.textContent = rank;
  const ratio = (calculated1RM / bw).toFixed(2);
  userRatioBadge.textContent = `${ratio}x веса тела`;

  if (calculated1RM >= targets.elite) {
    userNextRankGap.textContent = 'Элитная планка взята';
    rankProgressBar.style.width = '100%';
    coachVerdictText.textContent = 'Результат на уровне соревновательного норматива КМС/МС. Требуется строгий контроль микроциклов и восстановления.';
  } else {
    const delta = targetNext - calculated1RM;
    userNextRankGap.textContent = `+${delta} кг до ${nextRankName}`;
    const rangeSpan = targetNext - currentBase;
    const currentProgress = Math.max(5, Math.min(100, Math.round(((calculated1RM - currentBase) / rangeSpan) * 100)));
    rankProgressBar.style.width = `${currentProgress}%`;

    if (rank === 'Начальный старт') {
      coachVerdictText.textContent = 'Идет фаза нейромышечной адаптации. Первые 2-3 месяца держи акцент на контроле траектории и темпе 3-0-1.';
    } else if (rank === 'Новичок') {
      coachVerdictText.textContent = 'База заложена. Линейная прогрессия весов раз в неделю даст стабильный прирост без риска перетренированности.';
    } else if (rank === 'Средний уровень') {
      coachVerdictText.textContent = 'Хорошая силовая форма. Рекомендуется переходить на волнообразную периодизацию и работу в диапазонах 4-6 и 8-10 повторений.';
    } else {
      coachVerdictText.textContent = 'Высокий силовой уровень для твоего возраста. Фокусируйся на устранении слабых фаз амплитуды и вариативности подсобных движений.';
    }
  }
}

// Слушатели событий интерфейса
categoryTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.category-btn');
  if (!btn) return;
  document.querySelectorAll('.category-btn').forEach(b => {
    b.classList.remove('bg-white', 'text-neutral-900', 'active');
    b.classList.add('bg-neutral-800', 'text-neutral-400');
  });
  btn.classList.add('bg-white', 'text-neutral-900', 'active');
  btn.classList.remove('bg-neutral-800', 'text-neutral-400');

  state.selectedCategory = btn.dataset.cat;
  populateExercises();
});

exerciseSelect.addEventListener('change', (e) => {
  state.selectedExerciseId = e.target.value;
  updateExerciseDetails();
});

// Переключение режимов 1RM / Reps
mode1RM.addEventListener('click', () => {
  state.inputMode = '1rm';
  mode1RM.classList.add('bg-white', 'text-neutral-900', 'shadow-xs');
  mode1RM.classList.remove('text-neutral-500');
  modeReps.classList.remove('bg-white', 'text-neutral-900', 'shadow-xs');
  modeReps.classList.add('text-neutral-500');
  repsContainer.classList.add('hidden');
  weightLabel.textContent = 'Разовый максимум (1RM)';
  calculateAndRender();
});

modeReps.addEventListener('click', () => {
  state.inputMode = 'reps';
  modeReps.classList.add('bg-white', 'text-neutral-900', 'shadow-xs');
  modeReps.classList.remove('text-neutral-500');
  mode1RM.classList.remove('bg-white', 'text-neutral-900', 'shadow-xs');
  mode1RM.classList.add('text-neutral-500');
  repsContainer.classList.remove('hidden');
  weightLabel.textContent = 'Рабочий вес в подходе';
  calculateAndRender();
});

// Изменение веса
weightRange.addEventListener('input', (e) => {
  state.inputWeight = Number(e.target.value);
  weightValue.textContent = state.inputWeight;
  calculateAndRender();
});

weightMinus.addEventListener('click', () => {
  const step = Number(weightRange.step) || 2.5;
  state.inputWeight = Math.max(Number(weightRange.min), state.inputWeight - step);
  weightRange.value = state.inputWeight;
  weightValue.textContent = state.inputWeight;
  calculateAndRender();
});

weightPlus.addEventListener('click', () => {
  const step = Number(weightRange.step) || 2.5;
  state.inputWeight = Math.min(Number(weightRange.max), state.inputWeight + step);
  weightRange.value = state.inputWeight;
  weightValue.textContent = state.inputWeight;
  calculateAndRender();
});

// Чипы быстрого добавления/вычитания веса
document.querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const delta = Number(chip.dataset.delta);
    state.inputWeight = Math.max(Number(weightRange.min), Math.min(Number(weightRange.max), state.inputWeight + delta));
    weightRange.value = state.inputWeight;
    weightValue.textContent = state.inputWeight;
    calculateAndRender();
  });
});

// Изменение повторений
repsRange.addEventListener('input', (e) => {
  state.inputReps = Number(e.target.value);
  repsValue.textContent = state.inputReps;
  calculateAndRender();
});

repsMinus.addEventListener('click', () => {
  state.inputReps = Math.max(2, state.inputReps - 1);
  repsRange.value = state.inputReps;
  repsValue.textContent = state.inputReps;
  calculateAndRender();
});

repsPlus.addEventListener('click', () => {
  state.inputReps = Math.min(15, state.inputReps + 1);
  repsRange.value = state.inputReps;
  repsValue.textContent = state.inputReps;
  calculateAndRender();
});

// Модальное окно параметров атлета
openAthleteModal.addEventListener('click', () => {
  inputAge.value = state.age;
  inputWeight.value = state.weight;
  inputHeight.value = state.height;
  athleteModal.classList.remove('hidden');
});

closeAthleteModal.addEventListener('click', () => {
  athleteModal.classList.add('hidden');
});

saveAthleteBtn.addEventListener('click', () => {
  state.age = Math.max(12, Math.min(70, Number(inputAge.value) || 16));
  state.weight = Math.max(40, Math.min(180, Number(inputWeight.value) || 70));
  state.height = Math.max(130, Math.min(220, Number(inputHeight.value) || 177));

  headerAthleteBadge.textContent = `${state.age} лет · ${state.weight} кг`;
  athleteHeightDisplay.textContent = `${state.height} см`;
  const coeff = getAgeFactor(state.age);
  athleteCoeffDisplay.textContent = `${coeff} (IPF)`;

  athleteModal.classList.add('hidden');
  calculateAndRender();
});

// Первый запуск
populateExercises();
