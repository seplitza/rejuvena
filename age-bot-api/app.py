#!/usr/bin/env python3
"""
Age-bot API Service
Flask API для определения возраста по фотографии лица
Использует MXNet модель из age-gender-estimation
"""

import os
import base64
import io
import numpy as np
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageDraw, ImageFont
from insightface.app import FaceAnalysis

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для фронтенда

# Face++ API credentials
FACEPP_API_KEY = os.environ.get('FACEPP_API_KEY', '')
FACEPP_API_SECRET = os.environ.get('FACEPP_API_SECRET', '')
FACEPP_API_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect'

# InsightFace app (fallback)
face_app = None
model_loaded = False
use_facepp = bool(FACEPP_API_KEY and FACEPP_API_SECRET)

def load_insightface_model():
    """Загрузка InsightFace модели для определения возраста (fallback если Face++ недоступен)"""
    global face_app, model_loaded, use_facepp
    
    # Проверяем Face++ credentials
    if FACEPP_API_KEY and FACEPP_API_SECRET:
        print('✅ Face++ API configured (primary method)')
        print(f'   API Key: {FACEPP_API_KEY[:8]}...')
        model_loaded = True
        use_facepp = True
        return True
    
    # Fallback на InsightFace если Face++ недоступен
    try:
        print('⚠️ Face++ not configured, loading InsightFace as fallback...')
        face_app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
        face_app.prepare(ctx_id=-1, det_size=(640, 640))
        model_loaded = True
        use_facepp = False
        print('✅ InsightFace buffalo_l model loaded successfully (fallback method)')
        return True
    except Exception as e:
        print(f'❌ Failed to load InsightFace model: {e}')
        import traceback
        traceback.print_exc()
        return False

def estimate_age(image):
    """
    Определение возраста по изображению
    Использует Face++ API (primary) или InsightFace (fallback)
    
    Возвращает: возраст (int) или None при ошибке
    """
    global use_facepp
    
    # Метод 1: Face++ API (предпочтительный)
    if use_facepp:
        try:
            print('🔍 Using Face++ API for age estimation...')
            
            # Конвертируем PIL Image в bytes
            img_buffer = io.BytesIO()
            if isinstance(image, Image.Image):
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                image.save(img_buffer, format='JPEG', quality=95)
            else:
                # Если numpy array, конвертируем через PIL
                img_pil = Image.fromarray(image)
                img_pil.save(img_buffer, format='JPEG', quality=95)
            
            img_buffer.seek(0)
            image_bytes = img_buffer.read()
            
            print(f'📸 Image size: {len(image_bytes)} bytes')
            
            # Запрос к Face++ API
            files = {'image_file': ('image.jpg', image_bytes, 'image/jpeg')}
            payload = {
                'api_key': FACEPP_API_KEY,
                'api_secret': FACEPP_API_SECRET,
                'return_attributes': 'age,gender'
            }
            
            response = requests.post(FACEPP_API_URL, data=payload, files=files, timeout=30)
            
            if response.status_code != 200:
                print(f'⚠️ Face++ API error: {response.status_code}, falling back to InsightFace')
                use_facepp = False  # Временно переключаемся на fallback
                return estimate_age(image)  # Retry with InsightFace
            
            result = response.json()
            
            if 'error_message' in result:
                print(f'⚠️ Face++ error: {result["error_message"]}, falling back')
                use_facepp = False
                return estimate_age(image)
            
            if 'faces' not in result or len(result['faces']) == 0:
                print('⚠️ No face detected by Face++')
                return None
            
            face = result['faces'][0]
            age = face['attributes']['age']['value']
            gender = face['attributes'].get('gender', {}).get('value', 'Unknown')
            
            print(f'✅ Face++ estimated age: {age}, gender: {gender}')
            return int(age)
            
        except Exception as e:
            print(f'❌ Face++ error: {e}, falling back to InsightFace')
            use_facepp = False
            # Продолжаем с InsightFace fallback
    
    # Метод 2: InsightFace (fallback)
    if face_app is None:
        print('❌ No age estimation method available')
        return None
    
    try:
        print('🔍 Using InsightFace for age estimation (fallback)...')
        
        # Конвертируем PIL Image в numpy array (BGR)
        if isinstance(image, Image.Image):
            if image.mode != 'RGB':
                image = image.convert('RGB')
            img_array = np.array(image)
        else:
            img_array = image
        
        img_bgr = img_array[:, :, ::-1]
        print(f'📸 Input shape: {img_bgr.shape}')
        
        faces = face_app.get(img_bgr)
        
        if len(faces) == 0:
            print('⚠️ No face detected by InsightFace')
            return None
        
        face = faces[0]
        estimated_age = int(face.age)
        
        print(f'✅ InsightFace estimated age: {estimated_age}')
        return estimated_age
        
    except Exception as e:
        print(f'❌ InsightFace error: {e}')
        import traceback
        traceback.print_exc()
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Проверка здоровья сервиса"""
    provider = 'Face++ API' if use_facepp else 'InsightFace (fallback)'
    return jsonify({
        'status': 'ok',
        'model_loaded': model_loaded,
        'provider': provider
    })

@app.route('/api/estimate-age', methods=['POST'])
def estimate_age_endpoint():
    """
    Endpoint для определения возраста
    
    Request JSON:
    {
        "image": "base64_encoded_image_data"
    }
    
    Response JSON:
    {
        "age": 35,
        "confidence": 0.95
    }
    """
    try:
        # Получаем данные
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Декодируем base64 изображение
        image_data = data['image']
        
        # Убираем data:image prefix если есть
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Декодируем
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Конвертируем в RGB если нужно
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Определяем возраст
        age = estimate_age(image)
        
        if age is None:
            return jsonify({
                'success': False,
                'message': 'Failed to estimate age',
                'age': None
            }), 500
        
        # Возвращаем результат в формате, ожидаемом фронтендом
        return jsonify({
            'success': True,
            'age': age,
            'confidence': 0.95,
            'status': 'success'
        })
        
    except Exception as e:
        print(f'❌ Error processing request: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/create-collage', methods=['POST'])
def create_collage():
    """
    Создание коллажа из загруженных фотографий
    
    Request JSON (new format):
    {
        "rows": [
            {"beforePhoto": "base64_img", "afterPhoto": "base64_img", "photoType": "front"},
            ...
        ],
        "metadata": {...},
        "userInfo": {
            "username": "user@email.com",
            "realAgeBefore": 36,
            "realAgeAfter": 36,
            ...
        }
    }
    """
    try:
        print('🎨 create_collage called')
        data = request.get_json()
        
        if not data:
            print('❌ No data provided')
            return jsonify({'error': 'No data provided'}), 400
        
        print(f'📦 Received data keys: {list(data.keys())}')
        
        # Поддержка новой структуры с rows
        rows = data.get('rows', [])
        
        if not rows or len(rows) == 0:
            return jsonify({'error': 'No photo rows provided'}), 400
        
        print(f'📸 Processing {len(rows)} photo rows for collage...')
        
        # Декодируем изображения из rows
        before_images = []
        after_images = []
        
        for idx, row in enumerate(rows):
            # Обрабатываем фото "До"
            before_base64 = row.get('beforePhoto')
            if before_base64:
                try:
                    if ',' in before_base64:
                        before_base64 = before_base64.split(',')[1]
                    img_bytes = base64.b64decode(before_base64)
                    img = Image.open(io.BytesIO(img_bytes))
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    before_images.append(img)
                    print(f'  ✅ Row {idx}: Before photo loaded')
                except Exception as e:
                    print(f'  ⚠️ Row {idx}: Failed to load before photo: {e}')
                    before_images.append(None)
            else:
                before_images.append(None)
                print(f'  ⏭️ Row {idx}: No before photo')
            
            # Обрабатываем фото "После"
            after_base64 = row.get('afterPhoto')
            if after_base64:
                try:
                    if ',' in after_base64:
                        after_base64 = after_base64.split(',')[1]
                    img_bytes = base64.b64decode(after_base64)
                    img = Image.open(io.BytesIO(img_bytes))
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    after_images.append(img)
                    print(f'  ✅ Row {idx}: After photo loaded')
                except Exception as e:
                    print(f'  ⚠️ Row {idx}: Failed to load after photo: {e}')
                    after_images.append(None)
            else:
                after_images.append(None)
                print(f'  ⏭️ Row {idx}: No after photo')
        
        # Извлекаем userInfo и metadata
        user_info = data.get('userInfo', {})
        metadata = data.get('metadata', {})
        username = user_info.get('username', 'Пользователь')
        site_url = user_info.get('siteUrl', '')
        print(f'📄 UserInfo: {user_info}')
        print(f'🌐 Site URL: {site_url}')
        print(f'📊 Metadata: {list(metadata.keys())}')
        
        # Создаём вертикальный коллаж с заголовком и футером
        # Размеры одного фото в коллаже (КВАДРАТНЫЕ) - Увеличено для лучшего качества
        photo_size = 800  # квадратные фото 800x800
        
        # Отступы (пропорционально увеличены)
        padding = 30  # отступ между фото в паре
        row_spacing = 120  # отступ между парами (увеличено для метаданных)
        border = 60  # рамка по краям
        header_height = 120  # высота заголовка
        footer_height = 500  # высота футера с анкетой
        metadata_height = 50  # высота для метаданных под фото
        
        # Определяем количество пар
        num_pairs = len(rows)
        
        # Размер коллажа
        pair_width = photo_size * 2 + padding
        collage_width = pair_width + border * 2
        photos_height = (photo_size + row_spacing) * num_pairs - row_spacing
        collage_height = header_height + photos_height + footer_height + border * 2
        
        # Создаём белый фон
        collage = Image.new('RGB', (collage_width, collage_height), 'white')
        draw = ImageDraw.Draw(collage)
        
        # Шрифты (увеличенные для 800px фото)
        try:
            font_large = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 48)
            font_normal = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 36)
            font_small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
            print('✅ Fonts loaded successfully')
        except Exception as e:
            print(f'⚠️ Font loading failed: {e}, using default')
            font_large = ImageFont.load_default()
            font_normal = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # ЗАГОЛОВОК: "Фотодневник | Имя | Дата"
        current_date = datetime.now().strftime('%d.%m.%Y')
        header_text = f"Фотодневник | {username} | {current_date}"
        draw.text((border, 30), header_text, fill='black', font=font_large)
        
        # Функция для обрезки изображения в квадрат (для лица: 5% сверху, 15% снизу)
        def crop_to_square(img):
            width, height = img.size
            size = min(width, height)
            
            # Центрируем по горизонтали
            left = (width - size) // 2
            
            # Для вертикальной обрезки: 5% отступ сверху для лица
            if height > width:
                # Портретная ориентация - смещаем вверх для лица
                top = int(height * 0.05)  # 5% отступ сверху
            else:
                # Горизонтальная или квадратная - центрируем
                top = (height - size) // 2
            
            return img.crop((left, top, left + size, top + size))
        
        # Размещаем пары фото (До слева, После справа) с метаданными
        photos_start_y = header_height + border
        for i in range(num_pairs):
            y_position = photos_start_y + i * (photo_size + row_spacing)
            row = rows[i]
            photo_type = row.get('photoType', 'front')
            
            # Фото "До" (левое)
            if i < len(before_images) and before_images[i]:
                img_before = before_images[i].copy()
                img_before = crop_to_square(img_before)  # Квадратное
                img_before = img_before.resize((photo_size, photo_size), Image.Resampling.LANCZOS)
                x_before = border
                collage.paste(img_before, (x_before, y_position))
                
                # Метаданные под фото "До"
                meta_before = metadata.get('before', {}).get(photo_type, {})
                exif_before = meta_before.get('exifData') or {}
                date_time = exif_before.get('DateTime') or exif_before.get('captureDate')
                upload_date = meta_before.get('uploadDate')
                
                if date_time:
                    # DateTime format: "YYYY:MM:DD HH:MM:SS" or ISO
                    if ':' in date_time[:10]:
                        date_str = date_time[:10].replace(':', '.')
                    else:
                        date_str = date_time[:10].replace('-', '.')
                    meta_text = f"↓ Снято: {date_str}"
                elif upload_date:
                    # Use upload date as fallback (ISO format)
                    upload_str = upload_date[:10].replace('-', '.')
                    meta_text = f"↓ Загружено: {upload_str}"
                else:
                    meta_text = f"↓ No EXIF data found (screenshot)"
                draw.text((x_before + 10, y_position + photo_size + 10), meta_text, fill='#666666', font=font_small)
            
            # Фото "После" (правое)
            if i < len(after_images) and after_images[i]:
                img_after = after_images[i].copy()
                img_after = crop_to_square(img_after)  # Квадратное
                img_after = img_after.resize((photo_size, photo_size), Image.Resampling.LANCZOS)
                x_after = border + photo_size + padding
                collage.paste(img_after, (x_after, y_position))
                
                # Метаданные под фото "После"
                meta_after = metadata.get('after', {}).get(photo_type, {})
                exif_after = meta_after.get('exifData') or {}
                date_time = exif_after.get('DateTime') or exif_after.get('captureDate')
                upload_date = meta_after.get('uploadDate')
                
                if date_time:
                    # DateTime format: "YYYY:MM:DD HH:MM:SS" or ISO
                    if ':' in date_time[:10]:
                        date_str = date_time[:10].replace(':', '.')
                    else:
                        date_str = date_time[:10].replace('-', '.')
                    meta_text = f"↓ Снято: {date_str}"
                elif upload_date:
                    # Use upload date as fallback (ISO format)
                    upload_str = upload_date[:10].replace('-', '.')
                    meta_text = f"↓ Загружено: {upload_str}"
                else:
                    meta_text = f"↓ No EXIF data found (screenshot)"
                draw.text((x_after + 10, y_position + photo_size + 10), meta_text, fill='#666666', font=font_small)
            
            # Водяной знак: ссылка на фотодневник поверх фотографий внизу по центру
            if site_url:
                # Центр между двумя фотографиями (spanning both photos)
                watermark_x = border + pair_width // 2
                watermark_y = y_position + photo_size - 45  # Поверх фото снизу
                
                # Получаем размер текста для центрирования
                bbox = draw.textbbox((0, 0), site_url, font=font_small)
                text_width = bbox[2] - bbox[0]
                
                # Рисуем водяной знак с центрированием (без фона)
                draw.text(
                    (watermark_x - text_width // 2, watermark_y), 
                    site_url, 
                    fill='#999999',  # Серый цвет
                    font=font_small
                )
        
        # ФУТЕР С АНКЕТОЙ (только заполненные поля)
        footer_y = photos_start_y + photos_height + 60
        
        # Рисуем светлый фон для футера (лучшее визуальное отделение)
        draw.rectangle(
            [(border, footer_y - 20), (collage_width - border, collage_height - border)],
            fill='#f5f5f5',
            outline='#cccccc',
            width=2
        )
        
        draw.text((border + 20, footer_y), "Анкета:", fill='black', font=font_normal)
        
        # Собираем ВСЕ заполненные поля в порядке как в форме
        footer_fields = []
        
        # Бот определил возраст
        if user_info.get('botAgeBefore') or user_info.get('botAgeAfter'):
            bot_ages = []
            if user_info.get('botAgeBefore'):
                bot_ages.append(str(user_info['botAgeBefore']))
            if user_info.get('botAgeAfter'):
                bot_ages.append(str(user_info['botAgeAfter']))
            if bot_ages:
                footer_fields.append(f"Бот определил возраст: {' / '.join(bot_ages)}")
        
        # Реальный возраст
        if user_info.get('realAgeBefore') or user_info.get('realAgeAfter'):
            ages = []
            if user_info.get('realAgeBefore'):
                ages.append(str(user_info['realAgeBefore']))
            if user_info.get('realAgeAfter'):
                ages.append(str(user_info['realAgeAfter']))
            if ages:
                footer_fields.append(f"Возраст: {' / '.join(ages)}")
        
        # Вес
        if user_info.get('weightBefore') or user_info.get('weightAfter'):
            weights = []
            if user_info.get('weightBefore'):
                weights.append(str(user_info['weightBefore']))
            if user_info.get('weightAfter'):
                weights.append(str(user_info['weightAfter']))
            if weights:
                footer_fields.append(f"Вес: {' / '.join(weights)} кг")
        
        # Рост
        if user_info.get('heightBefore') or user_info.get('heightAfter'):
            heights = []
            if user_info.get('heightBefore'):
                heights.append(str(user_info['heightBefore']))
            if user_info.get('heightAfter'):
                heights.append(str(user_info['heightAfter']))
            if heights:
                footer_fields.append(f"Рост: {' / '.join(heights)} см")
        
        # Пол
        if user_info.get('gender'):
            footer_fields.append(f"Пол: {user_info['gender']}")
        
        # Тип кожи
        if user_info.get('skinType'):
            footer_fields.append(f"Тип кожи: {user_info['skinType']}")
        
        # Процедуры
        if user_info.get('procedures'):
            footer_fields.append(f"Процедуры: {user_info['procedures']}")
        
        # Комментарии (До и После)
        if user_info.get('commentsBefore'):
            footer_fields.append(f"Комментарий До: {user_info['commentsBefore']}")
        if user_info.get('commentsAfter'):
            footer_fields.append(f"Комментарий После: {user_info['commentsAfter']}")
        
        print(f'📝 Footer fields: {footer_fields}')
        print(f'📏 Footer position: y={footer_y}, collage_height={collage_height}')
        
        line_y = footer_y + 50
        for field in footer_fields:
            draw.text((border + 20, line_y), field, fill='black', font=font_small)
            line_y += 45
        
        # Сохраняем в буфер как JPEG с максимальным качеством
        output = io.BytesIO()
        collage.save(output, format='JPEG', quality=95, optimize=True)
        output.seek(0)
        print(f'✅ Collage created: {collage.size}, {len(output.getvalue())} bytes')
        
        # Возвращаем как base64
        collage_base64 = base64.b64encode(output.getvalue()).decode('utf-8')
        
        return jsonify({
            'success': True,
            'collage': f'data:image/jpeg;base64,{collage_base64}'
        })
        
    except Exception as e:
        print(f'❌ Error creating collage: {e}')
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def index():
    """Главная страница API"""
    return jsonify({
        'service': 'Age-bot API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'estimate_age': '/api/estimate-age (POST)',
            'create_collage': '/api/create-collage (POST)'
        }
    })

# Загружаем InsightFace модель при импорте (для gunicorn workers)
print('🔄 Initializing Age-bot API with InsightFace...')
load_insightface_model()

if __name__ == '__main__':
    print('🚀 Starting Age-bot API...')
    
    # Загружаем модель при старте
    if not model_loaded:
        load_insightface_model()
    
    # Запускаем сервер
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
