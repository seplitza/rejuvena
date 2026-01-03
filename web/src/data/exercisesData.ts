/**
 * Static exercises data - Neck and Posture exercises
 * Shared between /exercises and /exercise/[id] pages
 */

export interface ExerciseContent {
  id: string;
  type: 'video' | 'image' | 'text';
  contentPath: string;
  hint?: string;
  orderBy: number;
}

export interface Exercise {
  id: string;
  marathonExerciseId: string;
  exerciseName: string;
  marathonExerciseName: string;
  description: string;
  duration: number;
  type: 'Practice' | 'Video' | 'Reading';
  status: 'NotStarted' | 'InProgress' | 'Completed';
  order: number;
  commentsCount: number;
  isDone: boolean;
  isNew: boolean;
  blockExercise: boolean;
  exerciseContents: ExerciseContent[];
}

export const POSTURE_EXERCISES: Exercise[] = [
  {
    id: '4c203ead-0590-4ad4-81ae-34ceead16eac',
    marathonExerciseId: '4c203ead-0590-4ad4-81ae-34ceead16eac',
    exerciseName: 'Базовая растяжка шеи',
    marathonExerciseName: 'Базовая растяжка шеи',
    description: 'Базовая растяжка мышц шеи для улучшения гибкости и снятия напряжения',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 1,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [],
  },
  {
    id: 'c54d0429-db51-48af-a890-03e2b257cae6',
    marathonExerciseId: 'c54d0429-db51-48af-a890-03e2b257cae6',
    exerciseName: 'Вращения головой',
    marathonExerciseName: 'Вращения головой',
    description: 'Вращения головой для разминки шейного отдела позвоночника',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 2,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [],
  },
  {
    id: 'c31c761f-ef35-4189-9f05-a12009775c22',
    marathonExerciseId: 'c31c761f-ef35-4189-9f05-a12009775c22',
    exerciseName: 'Растяжка передней поверхности шеи',
    marathonExerciseName: 'Растяжка передней поверхности шеи',
    description: 'Растяжка передней части шеи для коррекции осанки',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 3,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [],
  },
  {
    id: '9dd63c7a-60e0-476c-acfb-5264d0de3fc2',
    marathonExerciseId: '9dd63c7a-60e0-476c-acfb-5264d0de3fc2',
    exerciseName: 'На заднюю поверхность шеи',
    marathonExerciseName: 'На заднюю поверхность шеи',
    description: 'Упражнение для укрепления задней поверхности шеи',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 4,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [],
  },
  {
    id: '2ed8b873-e5dc-4d83-8058-f926827afaf0',
    marathonExerciseId: '2ed8b873-e5dc-4d83-8058-f926827afaf0',
    exerciseName: 'На боковую поверхность шеи',
    marathonExerciseName: 'На боковую поверхность шеи',
    description: 'Боковые наклоны для растяжки боковых мышц шеи',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 5,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [],
  },
  {
    id: 'eae9d289-4eb5-4c8f-9617-20f1d88b19e1',
    marathonExerciseId: 'eae9d289-4eb5-4c8f-9617-20f1d88b19e1',
    exerciseName: 'На мышцы трапеции',
    marathonExerciseName: 'На мышцы трапеции',
    description: 'Расслабление и растяжка трапециевидных мышц',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 6,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [],
  },
  {
    id: 'bec0210f-646d-4d63-b4a0-aa8e419aeca2',
    marathonExerciseId: 'bec0210f-646d-4d63-b4a0-aa8e419aeca2',
    exerciseName: 'Раскрытие плечевых 1',
    marathonExerciseName: 'Раскрытие плечевых 1',
    description: 'Раскрытие грудной клетки и плечевого пояса для улучшения осанки',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 7,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [],
  },
  {
    id: '24a6f431-9200-4c27-b491-09c9f4b96a20',
    marathonExerciseId: '24a6f431-9200-4c27-b491-09c9f4b96a20',
    exerciseName: 'Раскрытие плечевых 2',
    marathonExerciseName: 'Раскрытие плечевых 2',
    description: 'Продолжение раскрытия плечевого пояса с углублением растяжки',
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 8,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [],
  },
  {
    id: 'a8d8a1f3-6765-4031-bbb8-cf0baf47f7af',
    marathonExerciseId: 'a8d8a1f3-6765-4031-bbb8-cf0baf47f7af',
    exerciseName: 'Стоечка у стены',
    marathonExerciseName: 'Стоечка у стены',
    description: `<h3>Стоечка у стены</h3>
<p>Это упражнение - царь упражнений для осанки!</p>
<p>Это незаменимый прием для возвращения головы в здоровое положение. Упражнение статическое, кажется лёгким, однако лучше сначала попробовать, прежде, чем высказывать такие суждения.😁</p>
<p>Первый раз попробуй выдержать минуту, затем ты можешь постепенно увеличивать продолжительность, в идеале до 10 минут в день. 💪</p>
<p><strong>Что дает нам стоечка у стены:</strong></p>
<ul>
  <li>Улучшается статика шеи.</li>
  <li>Шея становится длинной и сильной.</li>
  <li>Позвоночник вспоминает свое выпрямленное естественное положение.</li>
  <li>Потребление кислорода увеличивается, поскольку в этой позе ваши легкие могут поглощать больше воздуха.</li>
  <li>Нервная система укрепляется.</li>
</ul>`,
    duration: 300,
    type: 'Practice',
    status: 'NotStarted',
    order: 9,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [
      {
        id: '1',
        type: 'video',
        contentPath: 'https://rutube.ru/video/6e88a547d703e3f8eece1db9b62e3e77/',
        hint: '',
        orderBy: 1,
      },
    ],
  },
  {
    id: '2ac880c8-2c14-4b45-b7aa-d1b0d538a769',
    marathonExerciseId: '2ac880c8-2c14-4b45-b7aa-d1b0d538a769',
    exerciseName: 'На валике',
    marathonExerciseName: 'На валике',
    description: 'Расслабляющее упражнение на массажном валике для спины и шеи',
    duration: 600,
    type: 'Practice',
    status: 'NotStarted',
    order: 10,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [],
  },
];

// Convert array to map for quick lookups
export const EXERCISES_MAP = POSTURE_EXERCISES.reduce((acc, exercise) => {
  acc[exercise.id] = exercise;
  return acc;
}, {} as Record<string, Exercise>);
