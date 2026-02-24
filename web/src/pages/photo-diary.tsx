import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import Head from 'next/head';
import { setUser } from '../store/modules/auth/slice';
import * as faceapi from 'face-api.js';
import NavigationMenu from '../components/common/NavigationMenu';

interface PhotoSet {
  front: string | null;
  left34: string | null;
  leftProfile: string | null;
  right34: string | null;
  rightProfile: string | null;
  closeup: string | null;
}

interface PhotoDiaryData {
  before: PhotoSet;
  after: PhotoSet;
  botAgeBefore: number | null;
  botAgeAfter: number | null;
  realAgeBefore: number | null;
  realAgeAfter: number | null;
  weightBefore: number | null;
  weightAfter: number | null;
  heightBefore: number | null;
  heightAfter: number | null;
  commentBefore: string;
  commentAfter: string;
}

const photoTypes: Array<{ id: keyof PhotoSet; label: string; example: string }> = [
  { id: 'front', label: 'Вид спереди', example: 'https://api-rejuvena.duckdns.org/uploads/example-front.png?v=2' },
  { id: 'left34', label: '3/4 слева', example: 'https://api-rejuvena.duckdns.org/uploads/example-left34.png?v=2' },
  { id: 'leftProfile', label: 'Профиль слева', example: 'https://api-rejuvena.duckdns.org/uploads/example-left-profile.png?v=2' },
  { id: 'right34', label: '3/4 справа', example: 'https://api-rejuvena.duckdns.org/uploads/example-right34.png?v=2' },
  { id: 'rightProfile', label: 'Профиль справа', example: 'https://api-rejuvena.duckdns.org/uploads/example-right-profile.png?v=2' },
  { id: 'closeup', label: 'твоё\nпроблемное\nместо\nкрупный план', example: 'https://api-rejuvena.duckdns.org/uploads/example-closeup.png?v=2' },
];

const PhotoDiaryPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showRules, setShowRules] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cropError, setCropError] = useState<string | null>(null);
  const isDataLoadedRef = useRef(false); // Синхронный флаг что данные загружены
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);
  
  // Отслеживание загрузки на сервер
  const [uploadingToServer, setUploadingToServer] = useState<Set<string>>(new Set());
  const [uploadComplete, setUploadComplete] = useState(false);
  const uploadingToServerRef = useRef<Set<string>>(new Set());
  
  // State для ручной обрезки
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState<{
    dataUrl: string;
    period: 'before' | 'after';
    photoType: keyof PhotoSet;
  } | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 300, height: 300 });
  const [zoom, setZoom] = useState(1);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [data, setData] = useState<PhotoDiaryData>({
    before: { front: null, left34: null, leftProfile: null, right34: null, rightProfile: null, closeup: null },
    after: { front: null, left34: null, leftProfile: null, right34: null, rightProfile: null, closeup: null },
    botAgeBefore: null,
    botAgeAfter: null,
    realAgeBefore: null,
    realAgeAfter: null,
    weightBefore: null,
    weightAfter: null,
    heightBefore: null,
    heightAfter: null,
    commentBefore: '',
    commentAfter: '',
  });

  // Оригинальные фото (необрезанные) для возможности корректировки в течение 24 часов
  const [originalPhotos, setOriginalPhotos] = useState<{
    before: PhotoSet;
    after: PhotoSet;
  }>({
    before: { front: null, left34: null, leftProfile: null, right34: null, rightProfile: null, closeup: null },
    after: { front: null, left34: null, leftProfile: null, right34: null, rightProfile: null, closeup: null },
  });

  // Метаданные фотографий (даты загрузки, EXIF)
  const [photoMetadata, setPhotoMetadata] = useState<{
    before: { [K in keyof PhotoSet]?: { uploadDate: string; exifData?: any } };
    after: { [K in keyof PhotoSet]?: { uploadDate: string; exifData?: any } };
  }>({
    before: {},
    after: {},
  });

  // Ряды, выбранные для коллажа (клик по примеру слева)
  const [collageSelectedRows, setCollageSelectedRows] = useState<Set<keyof PhotoSet>>(
    () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('collage_selected_rows');
        if (saved) {
          try {
            return new Set<keyof PhotoSet>(JSON.parse(saved) as (keyof PhotoSet)[]);
          } catch (e) {
            console.error('Failed to parse saved collage rows:', e);
          }
        }
      }
      return new Set<keyof PhotoSet>();
    }
  );

  // Функция сжатия изображения для localStorage с умным выбором качества
  // Файлы >2MB сжимаются до 60%, файлы ≤2MB хранятся без изменений
  const compressImageForStorage = async (dataUrl: string | null, forceQuality?: number): Promise<string | null> => {
    if (!dataUrl) return null;
    
    try {
      // Если указано принудительное качество, используем его
      if (forceQuality !== undefined) {
        const img = new Image();
        const loaded = new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
        });
        img.src = dataUrl;
        await loaded;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return dataUrl;
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        return canvas.toDataURL('image/jpeg', forceQuality);
      }
      
      // Определяем размер файла (base64)
      const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
      const sizeInBytes = (base64Length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      console.log(`📏 Image size: ${sizeInMB.toFixed(2)} MB`);
      
      // Если файл ≤2MB, возвращаем без сжатия
      if (sizeInMB <= 2) {
        console.log('✅ File ≤2MB, storing without compression');
        return dataUrl;
      }
      
      // Если >2MB, сжимаем до 60%
      console.log('🗜️ File >2MB, compressing to 60%');
      const img = new Image();
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      img.src = dataUrl;
      await loaded;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return dataUrl;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      return canvas.toDataURL('image/jpeg', 0.6);
    } catch (error) {
      console.error('Failed to compress image:', error);
      return dataUrl;
    }
  };

  // Async функция сжатия оригиналов для preview (50% качество)
  const compressOriginalForPreview = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0);
        // Сжимаем оригинал до 50% для preview в модалке обрезки
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Сохранение оригинала на сервер (100% качество, хранится 1 месяц)
  // Отметить первую загрузку фото в дневник
  const markFirstPhotoDiaryUpload = async () => {
    if (!isAuthenticated || !user?._id) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527'}/api/photo-diary/mark-first-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ First photo diary upload marked:', data.firstPhotoDiaryUpload);
        
        // Обновить пользователя в Redux с новой датой
        dispatch(setUser({
          ...user,
          firstPhotoDiaryUpload: data.firstPhotoDiaryUpload
        }));
      }
    } catch (error) {
      console.error('❌ Failed to mark first photo upload:', error);
    }
  };

  const saveOriginalToServer = async (imageDataUrl: string, type: 'before' | 'after', photoKey: keyof PhotoSet) => {
    if (!user?._id) {
      console.log('⚠️ No user ID, skipping metadata save');
      return;
    }

    try {
      // Извлекаем EXIF метаданные из изображения (если есть)
      const img = new Image();
      img.src = imageDataUrl;
      
      // Даём изображению загрузиться
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Извлекаем EXIF данные с помощью exif-js
      let exifData: any = null;
      
      try {
        // Динамический импорт exif-js (используем default export)
        const EXIF = (await import('exif-js')).default || await import('exif-js');
        
        // Извлекаем EXIF данные
        const exifTags = await new Promise<any>((resolve) => {
          EXIF.getData(img as any, function(this: any) {
            resolve(EXIF.getAllTags(this));
          });
        });
        
        console.log('📷 EXIF tags extracted:', exifTags);
        
        // Пытаемся найти дату съёмки
        const dateTimeOriginal = exifTags?.DateTimeOriginal || exifTags?.DateTime;
        
        if (dateTimeOriginal) {
          // Конвертируем EXIF дату (формат: "YYYY:MM:DD HH:MM:SS") в ISO
          const exifDateParts = dateTimeOriginal.split(' ');
          const datePart = exifDateParts[0].replace(/:/g, '-');
          const timePart = exifDateParts[1] || '00:00:00';
          const captureDate = new Date(`${datePart}T${timePart}`).toISOString();
          
          exifData = {
            DateTime: dateTimeOriginal,
            captureDate,
            camera: exifTags?.Make ? `${exifTags.Make} ${exifTags.Model || ''}`.trim() : null,
            orientation: exifTags?.Orientation
          };
          console.log('✅ EXIF date found:', captureDate);
        } else if (Object.keys(exifTags || {}).length > 0) {
          // EXIF есть, но даты нет
          exifData = {
            reason: 'EXIF found but no capture date',
            camera: exifTags?.Make ? `${exifTags.Make} ${exifTags.Model || ''}`.trim() : null
          };
          console.log('⚠️ EXIF found but no date');
        } else {
          // EXIF данных нет совсем
          exifData = {
            reason: 'No EXIF data found (screenshot or edited photo)'
          };
          console.log('⚠️ No EXIF data');
        }
      } catch (error) {
        console.error('❌ EXIF extraction error:', error);
        exifData = {
          reason: 'No EXIF data found (screenshot or edited photo)'
        };
      }

      const uploadDate = new Date().toISOString();

      // Сохраняем метаданные локально
      setPhotoMetadata(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [photoKey]: {
            uploadDate,
            exifData
          }
        }
      }));

      console.log(`✅ Metadata saved for ${photoKey} (${type}):`, { uploadDate, exifData });

      /* TODO: Реализовать endpoint на сервере /api/save-original для долгосрочного хранения
      const base64Data = imageDataUrl.split(',')[1];
      const response = await fetch('https://api.seplitza.ru/api/save-original', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data,
          userId: user._id,
          period: type,
          photoType: photoKey,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save original to server');
      }
      
      const result = await response.json();
      console.log(`✅ Original saved to server: ${result.fileId}`);
      */
    } catch (error) {
      console.error('❌ Failed to save metadata:', error);
      // Не блокируем загрузку если произошла ошибка
    }
  };

  // Автосохранение метаданных в localStorage (без изображений)
  useEffect(() => {
    if (isAuthenticated && user?._id && isDataLoadedRef.current) {
      const metadataKey = `photo_diary_metadata_${user._id}`;
      
      try {
        // Сохраняем только метаданные (даты, EXIF) - без изображений
        localStorage.setItem(metadataKey, JSON.stringify(photoMetadata));
        console.log('💾 Metadata saved to localStorage');
      } catch (error: any) {
        console.error('❌ LocalStorage save error:', error);
      }
    }
  }, [photoMetadata, isAuthenticated, user]);

  // Проверка авторизации (отложенный промпт на 3-м фото)
  useEffect(() => {
    if (!isAuthenticated) {
      // Не редиректим сразу - даём пользователю попробовать сервис
      const userId = 'guest';
      const uploadCountKey = `rejuvena_upload_count_${userId}`;
      const currentCount = parseInt(localStorage.getItem(uploadCountKey) || '0', 10);
      
      // Показываем промпт регистрации только после 3-го фото
      if (currentCount >= 3) {
        setShowRegistrationPrompt(true);
      }
    }
  }, [isAuthenticated]);

  // Загрузка фото с сервера и метаданных из localStorage
  useEffect(() => {
    if (user?._id && !isDataLoadedRef.current && isAuthenticated) {
      const loadData = async () => {
        // 1. Загружаем фото с сервера
        await loadPhotosFromServer();
        
        // 2. Загружаем метаданные из localStorage (EXIF, даты)
        const metadataKey = `photo_diary_metadata_${user._id}`;
        const savedMetadata = localStorage.getItem(metadataKey);
        if (savedMetadata) {
          try {
            const parsed = JSON.parse(savedMetadata);
            setPhotoMetadata(parsed);
            console.log('📅 Loaded metadata from localStorage');
          } catch (error) {
            console.error('❌ Failed to load metadata:', error);
          }
        }
        
        // Данные загружены - СИНХРОННО
        isDataLoadedRef.current = true;
        console.log('✅ Data load complete');
      };
      
      loadData();
    }
  }, [user?._id, isAuthenticated]);
  
  // Загрузка моделей face-api.js (только один раз)
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/rejuvena/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log('✅ Face-api models loaded');
      } catch (error) {
        console.error('❌ Failed to load face-api models:', error);
      }
    };
    
    if (!modelsLoaded) {
      loadModels();
    }
  }, [modelsLoaded]);

  // Предупреждение при попытке уйти со страницы во время загрузки
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadingToServerRef.current.size > 0) {
        e.preventDefault();
        e.returnValue = 'Фотографии ещё загружаются на сервер. Если вы уйдёте, они не сохранятся. Остаться на странице?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Синхронизация состояния uploadingToServer с ref
  useEffect(() => {
    uploadingToServerRef.current = uploadingToServer;
  }, [uploadingToServer]);

  const cropFaceImage = async (imageDataUrl: string, photoType?: keyof PhotoSet): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Детекция лица
          const detection = await faceapi.detectSingleFace(
            img,
            new faceapi.TinyFaceDetectorOptions()
          ).withFaceLandmarks();

          if (!detection) {
            reject(new Error('Лицо не найдено на фотографии'));
            return;
          }

          const { box } = detection.detection;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          // Расчет кропа с учетом отступов
          // Для closeup (6й кадр) - без отступов (0%), для остальных - 20% сверху
          const topPadding = photoType === 'closeup' ? 0 : 0.20; // 20% сверху для стандартных кадров
          const bottomPadding = photoType === 'closeup' ? 0 : 0.15; // 15% снизу для стандартных кадров
          
          // Высота области от верха лица до низа с отступами
          const totalHeight = box.height / (1 - topPadding - bottomPadding);
          const cropTop = box.y - (totalHeight * topPadding);
          
          // Квадратный кроп - берем размер по высоте
          const cropSize = totalHeight;
          
          // Горизонтально - центрируем относительно лица
          const faceCenterX = box.x + box.width / 2;
          const cropLeft = faceCenterX - cropSize / 2;

          // Установка размера canvas (квадрат)
          canvas.width = cropSize;
          canvas.height = cropSize;

          // Отрисовка кропнутого изображения
          ctx.drawImage(
            img,
            cropLeft, cropTop, cropSize, cropSize,
            0, 0, cropSize, cropSize
          );

          // Высокое качество для коллажа
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
      img.src = imageDataUrl;
    });
  };

  const savePhotoToServer = async (imageDataUrl: string, type: 'before' | 'after', photoKey: keyof PhotoSet) => {
    const uploadKey = `${type}_${photoKey}`;
    
    try {
      // Отмечаем начало загрузки
      setUploadingToServer(prev => new Set([...prev, uploadKey]));
      setUploadComplete(false);
      
      console.log(`💾 Saving ${photoKey} photo for ${type} to server...`);
      
      const isBeforePhoto = type === 'before';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photo-diary/save-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          image: imageDataUrl,
          photoType: photoKey,
          isBeforePhoto: isBeforePhoto,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сохранения фото');
      }

      const result = await response.json();
      console.log(`✅ Photo saved to server:`, result.photoUrl);
      
      return result.photoUrl;
    } catch (error) {
      console.error('❌ Photo save error:', error);
      return null;
    } finally {
      // Убираем из списка загружающихся
      setUploadingToServer(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        
        // Если больше нет загрузок - показываем уведомление
        if (newSet.size === 0) {
          setUploadComplete(true);
          setTimeout(() => setUploadComplete(false), 5000); // Скрыть через 5 секунд
        }
        
        return newSet;
      });
    }
  };

  const loadPhotosFromServer = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photo-diary/photos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load photos');
      }

      const result = await response.json();
      
      if (result.success && result.photos) {
        // Конвертируем URLs в полные пути
        const photos = result.photos;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const convertToFullUrl = (url: string | null) => {
          if (!url) return null;
          return url.startsWith('http') ? url : `${baseUrl}${url}`;
        };

        setData(prev => ({
          ...prev,
          before: {
            front: convertToFullUrl(photos.before.front),
            left34: convertToFullUrl(photos.before.left34),
            leftProfile: convertToFullUrl(photos.before.leftProfile),
            right34: convertToFullUrl(photos.before.right34),
            rightProfile: convertToFullUrl(photos.before.rightProfile),
            closeup: convertToFullUrl(photos.before.closeup),
          },
          after: {
            front: convertToFullUrl(photos.after.front),
            left34: convertToFullUrl(photos.after.left34),
            leftProfile: convertToFullUrl(photos.after.leftProfile),
            right34: convertToFullUrl(photos.after.right34),
            rightProfile: convertToFullUrl(photos.after.rightProfile),
            closeup: convertToFullUrl(photos.after.closeup),
          },
        }));

        console.log('✅ Photos loaded from server');
      }
    } catch (error) {
      console.error('❌ Failed to load photos from server:', error);
    }
  };

  const estimateAge = async (imageDataUrl: string, type: 'before' | 'after') => {
    console.log(`🎯 Calling estimateAge for ${type}...`);
    try {
      // Извлекаем base64 из data URL
      const base64Data = imageDataUrl.split(',')[1];
      console.log(`📸 Image size: ${base64Data.length} chars`);
      
      // Используем Age-bot API через Cloudflare с SSL
      const response = await fetch('https://api.seplitza.ru/api/estimate-age', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Data }),
      });

      console.log(`📡 API response status: ${response.status}`);

      if (!response.ok) {
        throw new Error('Ошибка определения возраста');
      }

      const result = await response.json();
      
      console.log('✅ Age API response:', result);
      
      if (result.success && result.age) {
        console.log(`🎂 Setting age ${result.age} for ${type}`);
        if (type === 'before') {
          setData(prev => ({ ...prev, botAgeBefore: result.age }));
        } else {
          setData(prev => ({ ...prev, botAgeAfter: result.age }));
        }
      } else {
        console.error('❌ Age estimation failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Age estimation error:', error);
      // В случае ошибки используем fallback (130-140 для определения что это не реальная оценка)
      const fallbackAge = Math.floor(Math.random() * 11) + 130;
      if (type === 'before') {
        setData(prev => ({ ...prev, botAgeBefore: fallbackAge }));
      } else {
        setData(prev => ({ ...prev, botAgeAfter: fallbackAge }));
      }
    }
  };

  const handleFileUpload = async (type: 'before' | 'after', photoKey: keyof PhotoSet, file: File) => {
    setCropError(null);
    setProcessing(true);

    try {
      // Увеличиваем счётчик загрузок (для отложенного промпта регистрации)
      const userId = user?._id || 'guest';
      const uploadCountKey = `rejuvena_upload_count_${userId}`;
      const currentCount = parseInt(localStorage.getItem(uploadCountKey) || '0', 10);
      localStorage.setItem(uploadCountKey, String(currentCount + 1));
      console.log(`📊 Upload count: ${currentCount + 1}`);
      
      // Читаем файл
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        
        // 1. Сохраняем оригинал на СЕРВЕР (100% качество, хранится 1 месяц)
        await saveOriginalToServer(result, type, photoKey);
        
        // Отметить первую загрузку (если это первое фото)
        await markFirstPhotoDiaryUpload();
        
        // 2. Сохраняем сжатый оригинал в браузер для preview (50% качество, 24 часа)
        const compressedOriginal = await compressOriginalForPreview(result);
        setOriginalPhotos(prev => ({
          ...prev,
          [type]: { ...prev[type], [photoKey]: compressedOriginal }
        }));

        // Для профилей и closeup - сразу ручная обрезка
        if (photoKey === 'leftProfile' || photoKey === 'rightProfile' || photoKey === 'closeup') {
          // Сохраняем сжатый для отображения (60%)
          const compressedForDisplay = await compressImageForStorage(result, 0.6);
          setData(prev => ({
            ...prev,
            [type]: { ...prev[type], [photoKey]: compressedForDisplay }
          }));
          setProcessing(false);
          
          // Открываем модалку ручной обрезки сразу
          setTimeout(() => openCropModal(type, photoKey), 100);
          return;
        }

        // Автокроп только для front, left34, right34
        if (!modelsLoaded) {
          setCropError('Модели распознавания лиц еще загружаются. Попробуйте через несколько секунд.');
          setProcessing(false);
          return;
        }

        try {
          const croppedImage = await cropFaceImage(result, photoKey);
          
          // Сохраняем обрезанное фото на сервер и получаем URL
          const photoUrl = await savePhotoToServer(croppedImage, type, photoKey);
          
          // Сохраняем URL в state (или fallback на локальный base64 если сервер не ответил)
          setData(prev => ({
            ...prev,
            [type]: { ...prev[type], [photoKey]: photoUrl || croppedImage }
          }));

          // Определение возраста для фронтального фото через Age-bot API
          // Отправляем КРОПНУТОЕ фото с 30% padding - InsightFace видит всё лицо
          console.log(`📷 Photo uploaded: ${photoKey} for ${type}`);
          if (photoKey === 'front') {
            console.log(`🔍 Front photo detected - calling estimateAge`);
            await estimateAge(croppedImage, type);
            
            // Автозаполнение 6-го ряда (closeup) фронтальным фото с автокропом 0%
            console.log(`🔄 Auto-filling closeup (row 6) with front photo (0% crop)`);
            try {
              // Используем тот же кроп, но с 0% отступами (как для closeup)
              const closeupCropped = await cropFaceImage(result, 'closeup');
              const closeupUrl = await savePhotoToServer(closeupCropped, type, 'closeup');
              setData(prev => ({
                ...prev,
                [type]: { ...prev[type], closeup: closeupUrl || closeupCropped }
              }));
              console.log(`✅ Closeup auto-filled from front photo`);
            } catch (error) {
              console.error(`⚠️ Failed to auto-fill closeup: ${error}`);
            }
          } else {
            console.log(`⏭️ Skipping age estimation for ${photoKey}`);
          }

          setProcessing(false);
        } catch (error: any) {
          console.error('Crop error:', error);
          setCropError(error.message || 'Не удалось обработать фото');
          
          // Предлагаем загрузить без кропа
          if (confirm('Не удалось автоматически обрезать фото. Загрузить как есть?')) {
            setData(prev => ({
              ...prev,
              [type]: { ...prev[type], [photoKey]: result }
            }));
          }
          setProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      setProcessing(false);
    }
  };

  // Открыть модальное окно ручной обрезки
  const openCropModal = (period: 'before' | 'after', photoType: keyof PhotoSet) => {
    // Используем ОРИГИНАЛ (необрезанный) если он есть, иначе текущее фото
    const originalPhoto = originalPhotos[period][photoType];
    const photoData = originalPhoto || data[period][photoType];
    
    if (photoData) {
      // Загружаем изображение чтобы узнать его реальные размеры
      const img = new Image();
      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        // Устанавливаем начальный размер области обрезки (min размера изображения)
        const initialSize = Math.min(imgWidth, imgHeight, 400);
        const centerX = (imgWidth - initialSize) / 2;
        const centerY = (imgHeight - initialSize) / 2;
        
        setCropImage({ dataUrl: photoData, period, photoType });
        setCropArea({ 
          x: Math.max(0, centerX), 
          y: Math.max(0, centerY), 
          width: initialSize, 
          height: initialSize 
        });
        setZoom(1);
        setShowCropModal(true);
        
        if (originalPhoto) {
          console.log(`📷 Opening crop modal with ORIGINAL photo for ${photoType} (${imgWidth}x${imgHeight})`);
        } else {
          console.log(`⚠️ No original found, using current photo for ${photoType} (${imgWidth}x${imgHeight})`);
        }
      };
      img.src = photoData;
    }
  };

  // Применить ручную обрезку - отправляем координаты на сервер
  const handleApplyCrop = async () => {
    if (!cropImage) return;

    setProcessing(true);
    
    try {
      // TODO: Отправить координаты на сервер для обрезки оригинала
      // Пока временно обрезаем локально из preview
      const img = new Image();
      img.onload = async () => {
        // Вычисляем соотношение между preview и оригинальным размером
        // Preview сжат до 50%, но размеры пропорциональны
        const previewWidth = img.naturalWidth;  // Реальная ширина изображения
        const previewHeight = img.naturalHeight; // Реальная высота изображения
        
        // ВАЖНО: cropArea содержит координаты относительно отображаемого размера в браузере
        // Нужно найти элемент img в модальном окне чтобы узнать displayed размер
        const modalImg = document.querySelector('.crop-modal-image') as HTMLImageElement;
        if (!modalImg) {
          console.error('❌ Modal image not found');
          return;
        }
        
        const displayedWidth = modalImg.width;   // Размер на экране
        const displayedHeight = modalImg.height;
        
        // Вычисляем масштаб между displayed и actual размерами
        const scaleX = previewWidth / displayedWidth;
        const scaleY = previewHeight / displayedHeight;
        
        // Пересчитываем координаты обрезки в реальные пиксели изображения
        const actualCropX = Math.round(cropArea.x * scaleX);
        const actualCropY = Math.round(cropArea.y * scaleY);
        const actualCropWidth = Math.round(cropArea.width * scaleX);
        const actualCropHeight = Math.round(cropArea.height * scaleY);
        
        console.log(`🔍 Crop coordinates:
          Display: (${cropArea.x}, ${cropArea.y}) ${cropArea.width}x${cropArea.height}
          Image: ${displayedWidth}x${displayedHeight} → ${previewWidth}x${previewHeight}
          Scale: ${scaleX.toFixed(2)}x, ${scaleY.toFixed(2)}x
          Actual: (${actualCropX}, ${actualCropY}) ${actualCropWidth}x${actualCropHeight}`);
        
        // Создаём canvas для обрезанного изображения из preview
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = actualCropWidth;
        cropCanvas.height = actualCropHeight;
        const cropCtx = cropCanvas.getContext('2d');
        if (!cropCtx) return;

        // Вырезаем область из preview используя РЕАЛЬНЫЕ координаты
        cropCtx.drawImage(
          img,
          actualCropX,
          actualCropY,
          actualCropWidth,
          actualCropHeight,
          0,
          0,
          actualCropWidth,
          actualCropHeight
        );

        // Конвертируем в base64 с качеством 95% (высокое качество для сервера)
        const croppedHighQuality = cropCanvas.toDataURL('image/jpeg', 0.95);
        
        // Создаём уменьшенную версию для отображения (максимум 800x800px для коллажа)
        const maxDisplaySize = 800;
        const scale = Math.min(1, maxDisplaySize / Math.max(actualCropWidth, actualCropHeight));
        const displayWidth = Math.round(actualCropWidth * scale);
        const displayHeight = Math.round(actualCropHeight * scale);
        
        const displayCanvas = document.createElement('canvas');
        displayCanvas.width = displayWidth;
        displayCanvas.height = displayHeight;
        const displayCtx = displayCanvas.getContext('2d');
        if (!displayCtx) return;
        
        displayCtx.drawImage(cropCanvas, 0, 0, displayWidth, displayHeight);
        
        // Сжимаем до 60% для отображения в сетке
        const croppedDataUrl = displayCanvas.toDataURL('image/jpeg', 0.6);

        /* TODO: Реализовать на сервере endpoint /api/crop-original
        // Отправляем координаты на сервер для обрезки оригинала
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crop-original`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({
            userId: user?._id,
            period: cropImage.period,
            photoType: cropImage.photoType,
            cropX: cropArea.x,
            cropY: cropArea.y,
            cropWidth: cropArea.width,
            cropHeight: cropArea.height,
            // Передаём размеры preview для пересчёта координат на стороне сервера
            previewWidth: previewWidth,
            previewHeight: previewHeight,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to crop original on server');
        }
        
        const result = await response.json();
        croppedDataUrl = result.croppedImage; // Получаем обрезанный оригинал с сервера
        */

        // Обновляем данные
        setData(prev => ({
          ...prev,
          [cropImage.period]: {
            ...prev[cropImage.period],
            [cropImage.photoType]: croppedDataUrl
          }
        }));

        // Закрываем модальное окно
        setShowCropModal(false);
        setCropImage(null);
        setProcessing(false);
        
        console.log('✂️ Manual crop applied (from preview, server crop TODO)');
      };
      img.src = cropImage.dataUrl;
    } catch (error) {
      console.error('Crop failed:', error);
      alert('Не удалось обрезать изображение');
      setProcessing(false);
    }
  };

  // Функции управления выбором рядов для коллажа
  const toggleCollageRow = (photoType: keyof PhotoSet) => {
    setCollageSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoType)) {
        newSet.delete(photoType);
      } else {
        newSet.add(photoType);
      }
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('collage_selected_rows', JSON.stringify(Array.from(newSet)));
      }
      return newSet;
    });
  };

  const selectAllRows = () => {
    const allPhotoTypes: (keyof PhotoSet)[] = ['front', 'left34', 'leftProfile', 'right34', 'rightProfile', 'closeup'];
    const newSet = new Set<keyof PhotoSet>(allPhotoTypes);
    setCollageSelectedRows(newSet);
    if (typeof window !== 'undefined') {
      localStorage.setItem('collage_selected_rows', JSON.stringify(allPhotoTypes));
    }
  };

  const deselectAllRows = () => {
    setCollageSelectedRows(new Set());
    if (typeof window !== 'undefined') {
      localStorage.setItem('collage_selected_rows', JSON.stringify([]));
    }
  };

  const handleDownloadCollage = async () => {
    try {
      setProcessing(true);
      
      // Проверяем что выбран хотя бы один ряд
      if (collageSelectedRows.size === 0) {
        alert('Выберите ряды для коллажа!\n\nНажимайте на ПРИМЕРЫ СЛЕВА (первая колонка) чтобы выбрать ряды.');
        setProcessing(false);
        return;
      }
      
      // Собираем только выбранные ряды
      const photoTypesOrder: (keyof PhotoSet)[] = ['front', 'left34', 'leftProfile', 'right34', 'rightProfile', 'closeup'];
      
      const rowsToInclude: {
        beforePhoto: string | null;
        afterPhoto: string | null;
        photoType: keyof PhotoSet;
      }[] = [];
      
      photoTypesOrder.forEach(photoType => {
        // Проверяем что ряд выбран пользователем
        if (!collageSelectedRows.has(photoType)) {
          return; // Пропускаем невыбранные ряды
        }
        
        const hasBefore = !!data.before[photoType];
        const hasAfter = !!data.after[photoType];
        
        // Включаем ряд если выбран И есть хотя бы 1 фото
        if (hasBefore || hasAfter) {
          rowsToInclude.push({
            beforePhoto: data.before[photoType] || null,
            afterPhoto: data.after[photoType] || null,
            photoType: photoType,
          });
        }
      });
      
      if (rowsToInclude.length === 0) {
        alert('Загрузите хотя бы одну фотографию для создания коллажа!');
        setProcessing(false);
        return;
      }
      
      console.log(`🎨 Creating collage with ${rowsToInclude.length} rows...`);
      
      // Отправляем запрос на создание коллажа
      const response = await fetch('https://api.seplitza.ru/api/create-collage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rows: rowsToInclude,
          metadata: photoMetadata,
          userInfo: {
            username: user?.email?.split('@')[0] || user?.firstName || 'Пользователь',
            realAgeBefore: data.realAgeBefore,
            realAgeAfter: data.realAgeAfter,
            weightBefore: data.weightBefore,
            weightAfter: data.weightAfter,
            heightBefore: data.heightBefore,
            heightAfter: data.heightAfter,
            commentsBefore: data.commentBefore,
            commentsAfter: data.commentAfter,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка создания коллажа');
      }

      const result = await response.json();
      
      if (result.success && result.collage) {
        // Скачиваем коллаж (с поддержкой мобильных устройств)
        const username = user?.email?.split('@')[0] || user?.firstName || 'user';
        const dateStr = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-');
        const filename = `Фотодневник_${username}_${dateStr}.jpg`;
        
        // Конвертируем base64 в blob для корректного скачивания на мобильных
        const base64Data = result.collage.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        // Для мобильных устройств используем data URI напрямую
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // Мобильные устройства: открываем data URI напрямую
          const link = document.createElement('a');
          link.href = result.collage; // data:image/jpeg;base64,...
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          
          // Для iOS Safari нужен клик с задержкой
          setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            console.log('✅ Collage download triggered (mobile)');
          }, 100);
        } else {
          // Desktop: стандартное скачивание через blob
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
          console.log('✅ Collage downloaded (desktop)');
        }
      } else {
        throw new Error('Не удалось создать коллаж');
      }
      
      setProcessing(false);
    } catch (error) {
      console.error('❌ Collage error:', error);
      alert('Ошибка при создании коллажа. Попробуйте еще раз.');
      setProcessing(false);
    }
  };

  return (
    <>
      <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <Head>
        <title>Фотодневник - Rejuvena</title>
      </Head>
      
      {/* Промпт регистрации на 3-м фото */}
      {showRegistrationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              🎉 Отличное начало!
            </h3>
            <p className="text-gray-700 mb-4">
              Вы загрузили уже 3 фото. Чтобы продолжить и получить доступ ко всем функциям:
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-2">
              <li>✅ Генерация персональной ссылки с вашим username</li>
              <li>✅ Уведомления об удалении фото (за 7, 3 и 1 день)</li>
              <li>✅ Сохранение прогресса в облаке</li>
              <li>✅ Доступ к истории фотодневника</li>
            </ul>
            <p className="text-sm text-gray-600 mb-4">
              После регистрации вы сможете настроить уведомления Telegram.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRegistrationPrompt(false);
                  // Redirect to generate-link with prefill (UX improvement from 5ced541)
                  const userId = user?._id || 'guest';
                  const username = (user as any)?.username || '';
                  router.push(`/generate-link?prefill=true&tg_user_id=${userId}&tg_username=${username}`);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Настроить доступ
              </button>
              <button
                onClick={() => {
                  setShowRegistrationPrompt(false);
                  router.push('/auth/login');
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Войти
              </button>
            </div>
            <button
              onClick={() => setShowRegistrationPrompt(false)}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Продолжить без регистрации
            </button>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-700 hover:text-blue-800"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full mr-3 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-blue-800">Rejuvena</h1>
            </div>
            
            <button 
              onClick={() => setMenuOpen(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Меню"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="border-b">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2">
              <h2 className="text-xl font-bold text-blue-800">Фотодневник</h2>
              <button 
                onClick={() => setShowRules(true)}
                className="text-blue-700 underline font-medium"
              >
                правила
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6 text-blue-800 space-y-3 text-sm leading-relaxed">
            <p className="font-bold">Время загрузить твои новые фото!</p>
            <p>
              Сделай 6 снимков, как показано в примерах. После окончания каждого курса возвращайся сюда с новым 
              набором из 6 фотографий и зафиксируй изменения «До» и «После».
            </p>
            <p>
              Ты сможешь скачать коллаж с результатами, чтобы поделиться им или оставить себе на память.
            </p>
            <p className="font-bold">Удачи!</p>
          </div>

          <div className="mb-6 bg-pink-50 border border-pink-200 rounded-lg p-3 flex items-center">
            <div className="flex-shrink-0 mr-3">
              <span className="text-2xl">💡</span>
            </div>
            <p className="text-sm text-blue-800 flex-1">
              <span className="font-bold">Совет!</span> При съёмке держите камеру горизонтально
            </p>
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-12 h-10 bg-white border-2 border-blue-800 rounded flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              </div>
              <span className="text-2xl">👌</span>
              <div className="w-10 h-12 bg-white border-2 border-red-500 rounded flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              </div>
              <span className="text-2xl">❌</span>
            </div>
          </div>

          {/* Правила хранения фотографий - заголовок с прокруткой */}
          <div 
            className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => {
              const policyElement = document.getElementById('storage-policy-detail');
              if (policyElement) {
                policyElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-bold text-base text-blue-800">Хранение фотографий и автосохранение</p>
              </div>
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-blue-800">Пример</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-blue-800">До</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-blue-800">После</h3>
            </div>
          </div>

          {/* Collage Row Selection Controls */}
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Выбрано рядов для коллажа: {collageSelectedRows.size} из 6
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={selectAllRows}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200 shadow-sm"
                  disabled={processing}
                >
                  ✓ Выбрать все
                </button>
                <button
                  onClick={deselectAllRows}
                  className="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors duration-200 shadow-sm"
                  disabled={processing}
                >
                  ✗ Снять все
                </button>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              💡 Нажимайте на ПРИМЕРЫ слева чтобы выбрать ряды для включения в коллаж
            </p>
          </div>

          {/* Processing/Error Messages */}
          {processing && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800">Обработка фото...</span>
            </div>
          )}
          
          {cropError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{cropError}</p>
            </div>
          )}

          {/* Uploading to Server Indicator */}
          {uploadingToServer.size > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
                <span className="text-yellow-800 font-medium">Сохранение на сервер... ({uploadingToServer.size} фото)</span>
              </div>
              <span className="text-xs text-yellow-700">Не закрывайте страницу</span>
            </div>
          )}
          
          {/* Upload Complete Notification */}
          {uploadComplete && (
            <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg flex items-center">
              <svg className="h-5 w-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">✓ Все фотографии сохранены на сервер</span>
            </div>
          )}

          <div className="space-y-4">
            {photoTypes.map((photoType) => (
              <div key={photoType.id} className="grid grid-cols-3 gap-4">
                <div 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => toggleCollageRow(photoType.id)}
                  title="Нажмите чтобы выбрать/снять для коллажа"
                >
                  <div className={`w-full aspect-square rounded-lg overflow-hidden border-2 mb-2 transition-all duration-200 ${
                    collageSelectedRows.has(photoType.id) 
                      ? 'bg-green-100 border-green-500 shadow-lg' 
                      : 'bg-gray-200 border-gray-300 hover:border-gray-400'
                  }`}>
                    <img 
                      src={photoType.example} 
                      alt={`Пример ${photoType.label}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-blue-800 text-center whitespace-pre-line">
                    {photoType.label}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300 mb-2 relative group">
                    {data.before[photoType.id] ? (
                      <div className="w-full h-full relative">
                        <img src={data.before[photoType.id]!} alt="До" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                          <label className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:underline">
                            Изменить
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={processing}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload('before', photoType.id, file);
                              }}
                            />
                          </label>
                          <button
                            onClick={() => openCropModal('before', photoType.id)}
                            className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:underline"
                            disabled={processing}
                          >
                            Корректировать
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={processing}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('before', photoType.id, file);
                          }}
                        />
                        <span className="text-blue-600 font-medium">
                          {processing ? 'Обработка...' : 'загрузить'}
                        </span>
                      </label>
                    )}
                  </div>
                  {photoMetadata.before[photoType.id] && (
                    <div className="text-[11px] sm:text-xs text-gray-600 text-center w-full px-1 space-y-0.5">
                      <div className="truncate">
                        {photoMetadata.before[photoType.id]?.exifData?.captureDate 
                          ? `Снято: ${new Date(photoMetadata.before[photoType.id]!.exifData.captureDate).toLocaleDateString('ru-RU')}`
                          : photoMetadata.before[photoType.id]?.exifData?.reason 
                            ? `Снято: ${photoMetadata.before[photoType.id]!.exifData.reason.includes('No EXIF') ? 'отсутствует инфо. Скриншот или корректированное фото' : photoMetadata.before[photoType.id]!.exifData.reason}`
                            : 'Снято: отсутствует инфо'}
                      </div>
                      <div className="truncate">
                        📤 {new Date(photoMetadata.before[photoType.id]!.uploadDate).toLocaleDateString('ru-RU', { 
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  )}
                  <p className="text-sm font-medium text-blue-800 text-center whitespace-pre-line mt-1">
                    {photoType.label}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300 mb-2 relative group">
                    {data.after[photoType.id] ? (
                      <div className="w-full h-full relative">
                        <img src={data.after[photoType.id]!} alt="После" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                          <label className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:underline">
                            Изменить
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={processing}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload('after', photoType.id, file);
                              }}
                            />
                          </label>
                          <button
                            onClick={() => openCropModal('after', photoType.id)}
                            className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:underline"
                            disabled={processing}
                          >
                            Корректировать
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={processing}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('after', photoType.id, file);
                          }}
                        />
                        <span className="text-blue-600 font-medium">
                          {processing ? 'Обработка...' : 'загрузить'}
                        </span>
                      </label>
                    )}
                  </div>
                  {photoMetadata.after[photoType.id] && (
                    <div className="text-[11px] sm:text-xs text-gray-600 text-center w-full px-1 space-y-0.5">
                      <div className="truncate">
                        {photoMetadata.after[photoType.id]?.exifData?.captureDate 
                          ? `Снято: ${new Date(photoMetadata.after[photoType.id]!.exifData.captureDate).toLocaleDateString('ru-RU')}`
                          : photoMetadata.after[photoType.id]?.exifData?.reason 
                            ? `Снято: ${photoMetadata.after[photoType.id]!.exifData.reason.includes('No EXIF') ? 'отсутствует инфо. Скриншот или корректированное фото' : photoMetadata.after[photoType.id]!.exifData.reason}`
                            : 'Снято: отсутствует инфо'}
                      </div>
                      <div className="truncate">
                        📤 {new Date(photoMetadata.after[photoType.id]!.uploadDate).toLocaleDateString('ru-RU', { 
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  )}
                  <p className="text-sm font-medium text-blue-800 text-center whitespace-pre-line mt-1">
                    {photoType.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-blue-800">Бот определил возраст</div>
              <input type="text" value={data.botAgeBefore || ''} readOnly placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
              <input type="text" value={data.botAgeAfter || ''} readOnly placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-blue-800">возраст</div>
              <input type="number" value={data.realAgeBefore || ''} onChange={(e) => setData(prev => ({ ...prev, realAgeBefore: parseInt(e.target.value) || null }))} placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
              <input type="number" value={data.realAgeAfter || ''} onChange={(e) => setData(prev => ({ ...prev, realAgeAfter: parseInt(e.target.value) || null }))} placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-blue-800">вес</div>
              <input type="number" value={data.weightBefore || ''} onChange={(e) => setData(prev => ({ ...prev, weightBefore: parseInt(e.target.value) || null }))} placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
              <input type="number" value={data.weightAfter || ''} onChange={(e) => setData(prev => ({ ...prev, weightAfter: parseInt(e.target.value) || null }))} placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-blue-800">рост</div>
              <input type="number" value={data.heightBefore || ''} onChange={(e) => setData(prev => ({ ...prev, heightBefore: parseInt(e.target.value) || null }))} placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
              <input type="number" value={data.heightAfter || ''} onChange={(e) => setData(prev => ({ ...prev, heightAfter: parseInt(e.target.value) || null }))} placeholder="..." className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-blue-800">комментарий</div>
              <textarea value={data.commentBefore} onChange={(e) => setData(prev => ({ ...prev, commentBefore: e.target.value }))} placeholder="..." rows={3} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg resize-none" />
              <textarea value={data.commentAfter} onChange={(e) => setData(prev => ({ ...prev, commentAfter: e.target.value }))} placeholder="..." rows={3} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg resize-none" />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadCollage}
                disabled={processing}
                className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
              >
                скачать коллаж
                <svg className="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Удалить все загруженные фотографии? Это действие нельзя отменить.')) {
                    setData({
                      before: { front: null, left34: null, leftProfile: null, right34: null, rightProfile: null, closeup: null },
                      after: { front: null, left34: null, leftProfile: null, right34: null, rightProfile: null, closeup: null },
                      botAgeBefore: null,
                      botAgeAfter: null,
                      realAgeBefore: null,
                      realAgeAfter: null,
                      weightBefore: null,
                      weightAfter: null,
                      heightBefore: null,
                      heightAfter: null,
                      commentBefore: '',
                      commentAfter: '',
                    });
                    if (user?._id) {
                      localStorage.removeItem(`photo_diary_${user._id}`);
                    }
                    alert('Все фотографии удалены');
                  }
                }}
                className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              >
                Очистить всё
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="text-sm text-gray-500 flex items-center">
              <svg className="h-4 w-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Фотографии автоматически сохраняются
            </div>

            {/* Детали правил хранения фотографий */}
            <div id="storage-policy-detail" className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-sm text-blue-800 space-y-2">
                  <p className="font-bold text-base">Хранение фотографий и автосохранение:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><span className="font-semibold">В браузере:</span> сжатые копии оригиналов (50% качество) хранятся локально 24 часа для предпросмотра в окне корректировки обрезки</li>
                    <li><span className="font-semibold">На сервере - оригиналы:</span> необрезанные фото (100% качество) хранятся 1 день для возможности коррекции обрезки</li>
                    <li><span className="font-semibold">На сервере - обрезанные:</span> финальные фото для коллажа хранятся 1 месяц бесплатно, потом автоматически удаляются</li>
                    <li><span className="font-semibold">С оплаченным курсом:</span> хранение на всё время курса + 1 месяц после его окончания</li>
                    <li><span className="font-semibold">Уведомления:</span> мы пришлём напоминания о удалении фото за 7, 3 и 1 день. Вы сможете продлить хранение, оформив курс</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        {showRules && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-800">Правила фотодневника</h2>
                <button
                  onClick={() => setShowRules(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-blue-800">
                <p className="font-bold">Проверьте, как вы выглядите сейчас. Сделайте снимок и загрузите его, посмотрите результат.</p>
                <p>Наш Age-bot угадает, сколько лет выглядит ваше лицо сейчас. Точность работы Age-bot очень высока - 95% результатов корректны.</p>
                <p>Можно ли обмануть его? Нет... и да. Age-bot видит возрастные изменения в структуре костей - это невозможно подделать! Но он также проверяет состояние и расположение ваших мягких тканей. Это мы можем улучшить в приложении Rejuvena.</p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowRules(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно ручной обрезки */}
        {showCropModal && cropImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-white rounded-lg p-4 w-auto max-w-[95vw] max-h-[95vh] flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-blue-800">Корректировать обрезку</h2>
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setCropImage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-3 overflow-auto flex-shrink">
                <div className="relative inline-block">
                  <img
                    src={cropImage.dataUrl}
                    alt="Crop preview"
                    className="border-2 border-gray-300 crop-modal-image"
                    style={{ 
                      display: 'block',
                      maxWidth: '85vw',
                      maxHeight: '60vh',
                      width: 'auto',
                      height: 'auto'
                    }}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      // Обновляем максимальные границы для перетаскивания
                      const maxX = img.width - cropArea.width;
                      const maxY = img.height - cropArea.height;
                      if (cropArea.x > maxX) setCropArea(prev => ({ ...prev, x: Math.max(0, maxX) }));
                      if (cropArea.y > maxY) setCropArea(prev => ({ ...prev, y: Math.max(0, maxY) }));
                    }}
                  />
                  {/* Область обрезки */}
                  <div
                    className="absolute border-4 border-blue-500 cursor-move"
                    style={{
                      left: `${cropArea.x}px`,
                      top: `${cropArea.y}px`,
                      width: `${cropArea.width}px`,
                      height: `${cropArea.height}px`,
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                      touchAction: 'none'
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const imgElement = e.currentTarget.parentElement?.querySelector('img');
                      if (!imgElement) return;
                      
                      const imgWidth = imgElement.width;
                      const imgHeight = imgElement.height;
                      const rect = imgElement.getBoundingClientRect();
                      const startX = e.clientX - rect.left - cropArea.x;
                      const startY = e.clientY - rect.top - cropArea.y;
                      
                      const handleMove = (e: MouseEvent) => {
                        const newX = Math.max(0, Math.min(imgWidth - cropArea.width, e.clientX - rect.left - startX));
                        const newY = Math.max(0, Math.min(imgHeight - cropArea.height, e.clientY - rect.top - startY));
                        setCropArea(prev => ({ ...prev, x: newX, y: newY }));
                      };
                      
                      const handleUp = () => {
                        document.removeEventListener('mousemove', handleMove);
                        document.removeEventListener('mouseup', handleUp);
                      };
                      
                      document.addEventListener('mousemove', handleMove);
                      document.addEventListener('mouseup', handleUp);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const imgElement = e.currentTarget.parentElement?.querySelector('img');
                      if (!imgElement) return;
                      
                      const imgWidth = imgElement.width;
                      const imgHeight = imgElement.height;
                      const rect = imgElement.getBoundingClientRect();
                      const touch = e.touches[0];
                      const startX = touch.clientX - rect.left - cropArea.x;
                      const startY = touch.clientY - rect.top - cropArea.y;
                      
                      const handleTouchMove = (e: TouchEvent) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const newX = Math.max(0, Math.min(imgWidth - cropArea.width, touch.clientX - rect.left - startX));
                        const newY = Math.max(0, Math.min(imgHeight - cropArea.height, touch.clientY - rect.top - startY));
                        setCropArea(prev => ({ ...prev, x: newX, y: newY }));
                      };
                      
                      const handleTouchEnd = () => {
                        document.removeEventListener('touchmove', handleTouchMove);
                        document.removeEventListener('touchend', handleTouchEnd);
                      };
                      
                      document.addEventListener('touchmove', handleTouchMove, { passive: false });
                      document.addEventListener('touchend', handleTouchEnd);
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold" style={{ textShadow: '0 0 4px black' }}>
                      Перетащите
                    </div>
                  </div>
                </div>
              </div>

              {/* Управление */}
              <div className="space-y-3 mb-4 flex-shrink-0">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Размер области обрезки: {cropArea.width}×{cropArea.height}px (квадрат)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max={(() => {
                      const img = document.querySelector('.relative.inline-block img') as HTMLImageElement;
                      if (img) {
                        return Math.min(img.width, img.height);
                      }
                      return 1000;
                    })()}
                    step="10"
                    value={cropArea.width}
                    onChange={(e) => {
                      const img = document.querySelector('.relative.inline-block img') as HTMLImageElement;
                      if (!img) return;
                      
                      const newSize = parseInt(e.target.value);
                      const maxSize = Math.min(img.width, img.height);
                      const finalSize = Math.min(newSize, maxSize);
                      
                      setCropArea(prev => ({
                        ...prev,
                        width: finalSize,
                        height: finalSize,
                        x: Math.min(prev.x, img.width - finalSize),
                        y: Math.min(prev.y, img.height - finalSize)
                      }));
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Область обрезки всегда остаётся квадратной</p>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex justify-end gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setCropImage(null);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleApplyCrop}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PhotoDiaryPage;
