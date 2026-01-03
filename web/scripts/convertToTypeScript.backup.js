const fs = require('fs');
const path = require('path');

// Read parsed exercises
const parsedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'exercises-parsed.json'), 'utf8')
);

// Status mapping (first 6 free, last 4 locked)
const STATUS_MAP = {
  0: 'free',
  1: 'free',
  2: 'free',
  3: 'free',
  4: 'free',
  5: 'free',
  6: 'locked',
  7: 'locked',
  8: 'locked',
  9: 'locked',
};

// Convert to TypeScript format
const tsExercises = parsedData.map((ex, index) => {
  const blockExercise = STATUS_MAP[index] === 'locked';
  // Map "Theory" to "Reading" to match Redux type
  const exerciseType = ex.type === 'Theory' ? 'Reading' : 'Practice';
  // Map status to Redux format
  const reduxStatus = 'NotStarted'; // All exercises start as NotStarted
  return `  {
    id: '${ex.id}',
    marathonExerciseId: '${ex.marathonExerciseId}',
    exerciseName: '${ex.exerciseName.replace(/'/g, "\\'")}',
    marathonExerciseName: '${ex.marathonExerciseName.replace(/'/g, "\\'")}',
    description: \`${ex.description.replace(/`/g, '\\`')}\`,
    duration: ${ex.duration},
    status: '${reduxStatus}' as const,
    type: '${exerciseType}' as const,
    exerciseContents: ${JSON.stringify(ex.exerciseContents, null, 6).replace(/"([^"]+)":/g, '$1:')},
    order: ${index + 1},
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: ${blockExercise},
  }`;
}).join(',\n');

// Create full TypeScript file content
const tsContent = `// Auto-generated from exercises-parsed.json
// Generated: ${new Date().toISOString()}

export interface ExerciseContent {
  id: string;
  type: 'video' | 'image';
  contentPath: string;
  azureExerciseVideoId: string | null;
  isActive: boolean;
  order: number;
  exerciseId: string;
  createdBy: string | null;
  modifiedBy: string | null;
  createdDate: string;
  modifiedDate: string | null;
  azureVideo: any | null;
  videoServer: string | null;
}

export interface Exercise {
  id: string;
  marathonExerciseId: string;
  exerciseName: string;
  marathonExerciseName: string;
  description: string;
  duration: number;
  status: 'NotStarted' | 'InProgress' | 'Completed';
  type: 'Practice' | 'Video' | 'Reading';
  exerciseContents: ExerciseContent[];
  order: number;
  commentsCount: number;
  isDone: boolean;
  isNew: boolean;
  blockExercise: boolean;
}

export const POSTURE_EXERCISES: Exercise[] = [
${tsExercises}
];

export const EXERCISES_MAP = POSTURE_EXERCISES.reduce((acc, exercise) => {
  acc[exercise.id] = exercise;
  return acc;
}, {} as Record<string, Exercise>);
`;

// Write to file
const outputPath = path.join(__dirname, '../src/data/exercisesData.generated.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log(`✅ Generated TypeScript file: ${outputPath}`);
console.log(`📊 Total exercises: ${parsedData.length}`);
