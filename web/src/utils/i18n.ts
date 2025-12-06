/**
 * Internationalization utilities for Rejuvena web app
 */

export type LanguageCode = 'ru' | 'en' | 'es';

export const translations = {
  ru: {
    // Header
    myCourses: 'МОИ КУРСЫ',
    availableCourses: 'ДОСТУПНЫЕ КУРСЫ',
    noCourses: 'У вас пока нет активных курсов',
    selectCourse: 'Выберите курс из доступных ниже',
    noAvailableCourses: 'Нет доступных курсов',
    loading: 'Загрузка',
    loadingMyCourses: 'Загрузка ваших курсов...',
    loadingAvailableCourses: 'Загрузка доступных курсов...',
    
    // Course card
    progress: 'Прогресс',
    of: 'из',
    days: 'дней',
    subscriptionsFrom: 'Подписки от',
    freeCourseCall: 'Попробуй. Старт не требует оплаты',
    start: 'ПРИСТУПИТЬ',
    learnMore: 'ПОДРОБНЕЕ',
    join: 'ПРИСОЕДИНИТЬСЯ',
    
    // Duration text generation
    day: 'день',
    days2_4: 'дня',
    days5plus: 'дней',
    trainingPractice: 'обучения + курсы практики',
  },
  en: {
    // Header
    myCourses: 'MY COURSES',
    availableCourses: 'AVAILABLE COURSES',
    noCourses: 'You have no active courses yet',
    selectCourse: 'Choose a course from the available ones below',
    noAvailableCourses: 'No available courses',
    loading: 'Loading',
    loadingMyCourses: 'Loading your courses...',
    loadingAvailableCourses: 'Loading available courses...',
    
    // Course card
    progress: 'Progress',
    of: 'of',
    days: 'days',
    subscriptionsFrom: 'Subscriptions from',
    freeCourseCall: 'Try it. Start requires no payment',
    start: 'START',
    learnMore: 'LEARN MORE',
    join: 'JOIN',
    
    // Duration text generation
    day: 'day',
    days2_4: 'days',
    days5plus: 'days',
    trainingPractice: 'of training + practice courses',
  },
  es: {
    // Header
    myCourses: 'MIS CURSOS',
    availableCourses: 'CURSOS DISPONIBLES',
    noCourses: 'Aún no tienes cursos activos',
    selectCourse: 'Elige un curso de los disponibles a continuación',
    noAvailableCourses: 'No hay cursos disponibles',
    loading: 'Cargando',
    loadingMyCourses: 'Cargando tus cursos...',
    loadingAvailableCourses: 'Cargando cursos disponibles...',
    
    // Course card
    progress: 'Progreso',
    of: 'de',
    days: 'días',
    subscriptionsFrom: 'Suscripciones desde',
    freeCourseCall: 'Pruébalo. El inicio no requiere pago',
    start: 'COMENZAR',
    learnMore: 'SABER MÁS',
    join: 'UNIRSE',
    
    // Duration text generation
    day: 'día',
    days2_4: 'días',
    days5plus: 'días',
    trainingPractice: 'de entrenamiento + cursos de práctica',
  },
};

export const getCurrency = (lang: LanguageCode): string => {
  return lang === 'ru' ? '₽' : '$';
};

export const getDayText = (days: number, lang: LanguageCode): string => {
  if (lang === 'ru') {
    if (days === 1) return translations.ru.day;
    if (days >= 2 && days <= 4) return translations.ru.days2_4;
    return translations.ru.days5plus;
  }
  
  if (lang === 'en') {
    return days === 1 ? translations.en.day : translations.en.days;
  }
  
  if (lang === 'es') {
    return days === 1 ? translations.es.day : translations.es.days;
  }
  
  return 'days';
};

export const getDurationDescription = (days: number, lang: LanguageCode): string => {
  const dayText = getDayText(days, lang);
  const trainingText = translations[lang].trainingPractice;
  return `${days} ${dayText} ${trainingText}`;
};

export const t = (key: string, lang: LanguageCode): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
