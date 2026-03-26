export interface Word {
  id: string;
  original: string;
  translation: string;
  pronunciation?: string;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'translate' | 'match' | 'fill_blank';
  prompt: string;
  correctAnswer: string;
  options?: string[];
  sentence?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  icon: string;
  color: string;
  xpReward: number;
  words: Word[];
  questions: Question[];
  requiredLevel: number;
}

export interface Unit {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  lessons: Lesson[];
}

export const units: Unit[] = [
  {
    id: 'unit_1',
    title: 'Basics',
    titleRu: 'Основы',
    description: 'Greetings and simple phrases',
    lessons: [
      {
        id: 'lesson_1_1',
        title: 'Greetings',
        titleRu: 'Приветствия',
        description: 'Learn basic greetings',
        icon: '👋',
        color: '#58CC02',
        xpReward: 10,
        requiredLevel: 0,
        words: [
          { id: 'w1', original: 'Hello', translation: 'Привет', pronunciation: 'həˈloʊ' },
          { id: 'w2', original: 'Goodbye', translation: 'До свидания', pronunciation: 'ɡʊdˈbaɪ' },
          { id: 'w3', original: 'Good morning', translation: 'Доброе утро', pronunciation: 'ɡʊd ˈmɔːrnɪŋ' },
          { id: 'w4', original: 'Good evening', translation: 'Добрый вечер', pronunciation: 'ɡʊd ˈiːvnɪŋ' },
          { id: 'w5', original: 'Thank you', translation: 'Спасибо', pronunciation: 'θæŋk juː' },
        ],
        questions: [
          {
            id: 'q1_1',
            type: 'multiple_choice',
            prompt: 'Как переводится "Hello"?',
            correctAnswer: 'Привет',
            options: ['Привет', 'До свидания', 'Спасибо', 'Пожалуйста'],
          },
          {
            id: 'q1_2',
            type: 'multiple_choice',
            prompt: 'Как переводится "Goodbye"?',
            correctAnswer: 'До свидания',
            options: ['Привет', 'До свидания', 'Доброе утро', 'Спасибо'],
          },
          {
            id: 'q1_3',
            type: 'translate',
            prompt: 'Переведите: "Спасибо"',
            correctAnswer: 'Thank you',
            options: ['Thank you', 'Hello', 'Goodbye', 'Good morning'],
          },
          {
            id: 'q1_4',
            type: 'multiple_choice',
            prompt: 'What does "Доброе утро" mean?',
            correctAnswer: 'Good morning',
            options: ['Good evening', 'Good morning', 'Good night', 'Hello'],
          },
          {
            id: 'q1_5',
            type: 'fill_blank',
            prompt: 'Заполните пропуск',
            sentence: 'Good _____ (утро)',
            correctAnswer: 'morning',
            options: ['morning', 'evening', 'night', 'day'],
          },
        ],
      },
      {
        id: 'lesson_1_2',
        title: 'Introductions',
        titleRu: 'Знакомство',
        description: 'Introduce yourself',
        icon: '🤝',
        color: '#58CC02',
        xpReward: 10,
        requiredLevel: 0,
        words: [
          { id: 'w6', original: 'My name is', translation: 'Меня зовут' },
          { id: 'w7', original: 'Nice to meet you', translation: 'Приятно познакомиться' },
          { id: 'w8', original: 'How are you?', translation: 'Как дела?' },
          { id: 'w9', original: 'I am fine', translation: 'У меня всё хорошо' },
          { id: 'w10', original: 'And you?', translation: 'А у тебя?' },
        ],
        questions: [
          {
            id: 'q2_1',
            type: 'multiple_choice',
            prompt: 'Как переводится "My name is"?',
            correctAnswer: 'Меня зовут',
            options: ['Меня зовут', 'Как дела?', 'Привет', 'Спасибо'],
          },
          {
            id: 'q2_2',
            type: 'translate',
            prompt: 'Переведите: "Как дела?"',
            correctAnswer: 'How are you?',
            options: ['How are you?', 'Nice to meet you', 'My name is', 'I am fine'],
          },
          {
            id: 'q2_3',
            type: 'multiple_choice',
            prompt: 'What does "Приятно познакомиться" mean?',
            correctAnswer: 'Nice to meet you',
            options: ['Nice to meet you', 'How are you?', 'I am fine', 'And you?'],
          },
          {
            id: 'q2_4',
            type: 'fill_blank',
            prompt: 'Заполните пропуск',
            sentence: 'How ___ you? (дела)',
            correctAnswer: 'are',
            options: ['are', 'is', 'am', 'do'],
          },
          {
            id: 'q2_5',
            type: 'multiple_choice',
            prompt: 'Как переводится "I am fine"?',
            correctAnswer: 'У меня всё хорошо',
            options: ['У меня всё хорошо', 'Меня зовут', 'А у тебя?', 'Приятно познакомиться'],
          },
        ],
      },
      {
        id: 'lesson_1_3',
        title: 'Numbers',
        titleRu: 'Числа',
        description: 'Learn numbers 1-10',
        icon: '🔢',
        color: '#58CC02',
        xpReward: 15,
        requiredLevel: 1,
        words: [
          { id: 'w11', original: 'One', translation: 'Один' },
          { id: 'w12', original: 'Two', translation: 'Два' },
          { id: 'w13', original: 'Three', translation: 'Три' },
          { id: 'w14', original: 'Four', translation: 'Четыре' },
          { id: 'w15', original: 'Five', translation: 'Пять' },
          { id: 'w16', original: 'Six', translation: 'Шесть' },
          { id: 'w17', original: 'Seven', translation: 'Семь' },
          { id: 'w18', original: 'Eight', translation: 'Восемь' },
          { id: 'w19', original: 'Nine', translation: 'Девять' },
          { id: 'w20', original: 'Ten', translation: 'Десять' },
        ],
        questions: [
          {
            id: 'q3_1',
            type: 'multiple_choice',
            prompt: 'Как переводится "Three"?',
            correctAnswer: 'Три',
            options: ['Один', 'Два', 'Три', 'Четыре'],
          },
          {
            id: 'q3_2',
            type: 'translate',
            prompt: 'Переведите: "Семь"',
            correctAnswer: 'Seven',
            options: ['Five', 'Six', 'Seven', 'Eight'],
          },
          {
            id: 'q3_3',
            type: 'multiple_choice',
            prompt: 'What is "Десять" in English?',
            correctAnswer: 'Ten',
            options: ['Eight', 'Nine', 'Ten', 'Seven'],
          },
          {
            id: 'q3_4',
            type: 'multiple_choice',
            prompt: 'Как переводится "Five"?',
            correctAnswer: 'Пять',
            options: ['Три', 'Четыре', 'Пять', 'Шесть'],
          },
          {
            id: 'q3_5',
            type: 'translate',
            prompt: 'Переведите: "Восемь"',
            correctAnswer: 'Eight',
            options: ['Six', 'Seven', 'Eight', 'Nine'],
          },
        ],
      },
    ],
  },
  {
    id: 'unit_2',
    title: 'Family',
    titleRu: 'Семья',
    description: 'Family members and relationships',
    lessons: [
      {
        id: 'lesson_2_1',
        title: 'Family Members',
        titleRu: 'Члены семьи',
        description: 'Learn family vocabulary',
        icon: '👨‍👩‍👧‍👦',
        color: '#CE82FF',
        xpReward: 15,
        requiredLevel: 2,
        words: [
          { id: 'w21', original: 'Mother', translation: 'Мама' },
          { id: 'w22', original: 'Father', translation: 'Папа' },
          { id: 'w23', original: 'Sister', translation: 'Сестра' },
          { id: 'w24', original: 'Brother', translation: 'Брат' },
          { id: 'w25', original: 'Family', translation: 'Семья' },
        ],
        questions: [
          {
            id: 'q4_1',
            type: 'multiple_choice',
            prompt: 'Как переводится "Mother"?',
            correctAnswer: 'Мама',
            options: ['Мама', 'Папа', 'Сестра', 'Брат'],
          },
          {
            id: 'q4_2',
            type: 'translate',
            prompt: 'Переведите: "Брат"',
            correctAnswer: 'Brother',
            options: ['Mother', 'Father', 'Sister', 'Brother'],
          },
          {
            id: 'q4_3',
            type: 'multiple_choice',
            prompt: 'What does "Семья" mean?',
            correctAnswer: 'Family',
            options: ['Mother', 'Father', 'Family', 'Sister'],
          },
          {
            id: 'q4_4',
            type: 'fill_blank',
            prompt: 'Заполните пропуск',
            sentence: 'My _____ is kind. (сестра)',
            correctAnswer: 'sister',
            options: ['sister', 'brother', 'mother', 'father'],
          },
          {
            id: 'q4_5',
            type: 'multiple_choice',
            prompt: 'Как переводится "Father"?',
            correctAnswer: 'Папа',
            options: ['Мама', 'Папа', 'Брат', 'Семья'],
          },
        ],
      },
    ],
  },
  {
    id: 'unit_3',
    title: 'Food & Drinks',
    titleRu: 'Еда и напитки',
    description: 'Food, drinks, and ordering',
    lessons: [
      {
        id: 'lesson_3_1',
        title: 'Food',
        titleRu: 'Еда',
        description: 'Learn food vocabulary',
        icon: '🍕',
        color: '#FF9600',
        xpReward: 15,
        requiredLevel: 3,
        words: [
          { id: 'w26', original: 'Water', translation: 'Вода' },
          { id: 'w27', original: 'Bread', translation: 'Хлеб' },
          { id: 'w28', original: 'Apple', translation: 'Яблоко' },
          { id: 'w29', original: 'Coffee', translation: 'Кофе' },
          { id: 'w30', original: 'Tea', translation: 'Чай' },
        ],
        questions: [
          {
            id: 'q5_1',
            type: 'multiple_choice',
            prompt: 'Как переводится "Water"?',
            correctAnswer: 'Вода',
            options: ['Вода', 'Хлеб', 'Яблоко', 'Кофе'],
          },
          {
            id: 'q5_2',
            type: 'translate',
            prompt: 'Переведите: "Чай"',
            correctAnswer: 'Tea',
            options: ['Water', 'Coffee', 'Tea', 'Bread'],
          },
          {
            id: 'q5_3',
            type: 'multiple_choice',
            prompt: 'What does "Яблоко" mean?',
            correctAnswer: 'Apple',
            options: ['Water', 'Apple', 'Bread', 'Coffee'],
          },
          {
            id: 'q5_4',
            type: 'fill_blank',
            prompt: 'Заполните пропуск',
            sentence: 'I like _____ (кофе)',
            correctAnswer: 'coffee',
            options: ['coffee', 'tea', 'water', 'bread'],
          },
          {
            id: 'q5_5',
            type: 'multiple_choice',
            prompt: 'Как переводится "Bread"?',
            correctAnswer: 'Хлеб',
            options: ['Вода', 'Хлеб', 'Чай', 'Яблоко'],
          },
        ],
      },
    ],
  },
];
