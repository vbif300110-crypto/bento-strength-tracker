export const EXERCISES = [
  {
    id: 'bench_press',
    name: 'Жим штанги лёжа',
    category: 'chest',
    type: 'barbell',
    unit: 'кг',
    desc: 'Базовый жим со свободным весом',
    // Коэффициенты от массы взрослого атлета
    ratios: { novice: 0.75, inter: 1.10, adv: 1.45, elite: 1.75 }
  },
  {
    id: 'db_bench_press',
    name: 'Жим гантелей лёжа (1 гантель)',
    category: 'chest',
    type: 'dumbbell',
    unit: 'кг',
    desc: 'Вес одной гантели в руке',
    ratios: { novice: 0.28, inter: 0.40, adv: 0.52, elite: 0.65 }
  },
  {
    id: 'dips_weighted',
    name: 'Отжимания на брусьях (доп. вес)',
    category: 'chest',
    type: 'bodyweight_plus',
    unit: 'кг',
    desc: 'Только навесной дополнительный вес',
    ratios: { novice: 0.10, inter: 0.35, adv: 0.65, elite: 0.90 }
  },
  {
    id: 'squat',
    name: 'Приседания со штангой',
    category: 'legs',
    type: 'barbell',
    unit: 'кг',
    desc: 'Глубина до параллели или в угол',
    ratios: { novice: 1.05, inter: 1.50, adv: 1.95, elite: 2.40 }
  },
  {
    id: 'romanian_deadlift',
    name: 'Румынская тяга со штангой',
    category: 'legs',
    type: 'barbell',
    unit: 'кг',
    desc: 'Работа на заднюю поверхность и ягодичные',
    ratios: { novice: 0.90, inter: 1.35, adv: 1.75, elite: 2.15 }
  },
  {
    id: 'deadlift',
    name: 'Становая тяга (классика / сумо)',
    category: 'back',
    type: 'barbell',
    unit: 'кг',
    desc: 'Срыв с помоста с фиксацией вверху',
    ratios: { novice: 1.25, inter: 1.85, adv: 2.35, elite: 2.85 }
  },
  {
    id: 'pullups_weighted',
    name: 'Подтягивания (доп. вес)',
    category: 'back',
    type: 'bodyweight_plus',
    unit: 'кг',
    desc: 'Строгие подтягивания с навесным диском',
    ratios: { novice: 0.08, inter: 0.25, adv: 0.48, elite: 0.70 }
  },
  {
    id: 'lat_pulldown',
    name: 'Тяга верхнего блока к груди',
    category: 'back',
    type: 'cable',
    unit: 'кг',
    desc: 'Тренажер с грузоблочным стеком',
    ratios: { novice: 0.65, inter: 0.90, adv: 1.15, elite: 1.35 }
  },
  {
    id: 'seated_cable_row',
    name: 'Тяга блока к поясу сидя',
    category: 'back',
    type: 'cable',
    unit: 'кг',
    desc: 'Горизонтальная тяга на спину',
    ratios: { novice: 0.65, inter: 0.95, adv: 1.20, elite: 1.45 }
  },
  {
    id: 'bent_over_row',
    name: 'Тяга штанги в наклоне',
    category: 'back',
    type: 'barbell',
    unit: 'кг',
    desc: 'Угол корпуса 45-60 градусов',
    ratios: { novice: 0.70, inter: 1.05, adv: 1.35, elite: 1.65 }
  },
  {
    id: 'overhead_press',
    name: 'Армейский жим стоя (OHP)',
    category: 'shoulders',
    type: 'barbell',
    unit: 'кг',
    desc: 'Строгий жим штанги от ключиц вверх',
    ratios: { novice: 0.52, inter: 0.75, adv: 0.98, elite: 1.18 }
  }
];

export function getAgeFactor(age) {
  if (age <= 13) return 0.72;
  if (age === 14) return 0.78;
  if (age === 15) return 0.84;
  if (age === 16) return 0.89;
  if (age === 17) return 0.94;
  if (age >= 18 && age <= 35) return 1.0;
  if (age <= 40) return 0.96;
  if (age <= 45) return 0.91;
  return 0.85;
}
