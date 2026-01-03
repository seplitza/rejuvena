/**
 * Exercise Data Parser
 * Parses exercise data from admin panel API
 * 
 * Usage: node scripts/parseExercises.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Admin credentials
const ADMIN_EMAIL = 'admin@miyabi.com';
const ADMIN_PASSWORD = 'QR+L&9aS';
const API_BASE_URL = 'https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net/api';

// Exercise IDs to fetch
const EXERCISE_IDS = [
  '4c203ead-0590-4ad4-81ae-34ceead16eac', // Базовая растяжка шеи
  'c54d0429-db51-48af-a890-03e2b257cae6', // Вращения головой
  'c31c761f-ef35-4189-9f05-a12009775c22', // Растяжка передней поверхности шеи
  '9dd63c7a-60e0-476c-acfb-5264d0de3fc2', // На заднюю поверхность шеи
  '2ed8b873-e5dc-4d83-8058-f926827afaf0', // На боковую поверхность шеи
  'eae9d289-4eb5-4c8f-9617-20f1d88b19e1', // На мышцы трапеции
  'bec0210f-646d-4d63-b4a0-aa8e419aeca2', // Раскрытие плечевых 1
  '24a6f431-9200-4c27-b491-09c9f4b96a20', // Раскрытие плечевых 2
  'a8d8a1f3-6765-4031-bbb8-cf0baf47f7af', // Стоечка у стены
  '2ac880c8-2c14-4b45-b7aa-d1b0d538a769', // На валике
];

let authToken = null;

/**
 * Login to admin panel
 */
async function login() {
  console.log('🔐 Logging in...');
  try {
    // OAuth2 password grant with JSON body
    const response = await axios.post(`${API_BASE_URL}/Token/auth`, {
      grant_type: 'password',
      username: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    authToken = response.data.token || response.data.access_token || response.data.accessToken;
    console.log('✅ Logged in successfully');
    console.log('Token:', authToken?.substring(0, 20) + '...');
    return authToken;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get exercise details by ID
 */
async function getExercise(exerciseId) {
  console.log(`📥 Fetching exercise: ${exerciseId}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/Marathon/GetExercise`, {
      params: {
        id: exerciseId,
        timeZoneOffSet: -180,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const exercise = response.data;
    console.log(`✅ Fetched: ${exercise.exerciseName || exercise.name || 'Unknown'}`);
    
    return {
      id: exercise.id || exerciseId,
      marathonExerciseId: exercise.marathonExerciseId || exercise.id || exerciseId,
      exerciseName: exercise.exerciseName || exercise.name || '',
      marathonExerciseName: exercise.marathonExerciseName || exercise.exerciseName || '',
      description: exercise.exerciseDescription || exercise.description || '',
      duration: exercise.duration || 300,
      type: exercise.type || 'Practice',
      exerciseContents: exercise.exerciseContents || [],
      videoUrl: exercise.videoUrl,
      imageUrl: exercise.imageUrl,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch exercise ${exerciseId}:`, error.response?.data || error.message);
    return null;
  }
}

/**
 * Get all exercises from list API
 */
async function getAllExercises() {
  console.log('📥 Fetching all exercises...');
  try {
    const response = await axios.get(`${API_BASE_URL}/Marathon/GetExercises`, {
      params: {
        pageSize: 100,
        pageIndex: 0,
        sortOrder: '',
        timeZoneOffSet: -180,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        pageSize: 1000,
      },
    });

    console.log(`✅ Found ${response.data.length || response.data.data?.length || 0} exercises`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('❌ Failed to fetch exercises:', error.response?.data || error.message);
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Login
    await login();

    // Try to get all exercises first (response.data.data or response.data)
    const allExercisesResponse = await getAllExercises();
    const allExercises = allExercisesResponse?.data || allExercisesResponse || [];
    
    console.log(`✅ Found ${Array.isArray(allExercises) ? allExercises.length : 'unknown'} exercises`);
    console.log('Response structure:', JSON.stringify(allExercisesResponse, null, 2).substring(0, 500));
    
    // Filter our exercises
    const exercisesData = [];
    
    for (const exerciseId of EXERCISE_IDS) {
      // Try to find in all exercises
      let exercise = Array.isArray(allExercises) ? allExercises.find(ex => 
        ex.id === exerciseId || 
        ex.marathonExerciseId === exerciseId
      ) : null;

      // If not found, fetch individually
      if (!exercise) {
        exercise = await getExercise(exerciseId);
      }

      if (exercise) {
        exercisesData.push(exercise);
      } else {
        console.warn(`⚠️ Exercise ${exerciseId} not found`);
      }
    }

    // Save to file
    const outputPath = path.join(__dirname, 'exercises-parsed.json');
    fs.writeFileSync(outputPath, JSON.stringify(exercisesData, null, 2), 'utf8');
    console.log(`\n✅ Saved ${exercisesData.length} exercises to: ${outputPath}`);

    // Print summary
    console.log('\n📊 Summary:');
    exercisesData.forEach((ex, idx) => {
      const hasVideo = ex.exerciseContents?.some(c => c.type === 'video');
      const hasDescription = ex.description && ex.description.length > 50;
      console.log(`${idx + 1}. ${ex.exerciseName} - Video: ${hasVideo ? '✅' : '❌'} | Desc: ${hasDescription ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run
main();
