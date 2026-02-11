#!/bin/bash

# Скрипт для копирования примеров 3D модели в фотодневник
# Использование: сохраните все 6 изображений в папку ~/Downloads/photo-examples/
# затем запустите: bash copy-examples.sh

SOURCE_DIR="$HOME/Downloads/photo-examples"
TARGET_DIR="/Users/alexeipinaev/Documents/Rejuvena/web/public/examples"

echo "🎨 Копирование примеров для фотодневника..."

# Проверяем существование исходной папки
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Папка $SOURCE_DIR не найдена!"
  echo ""
  echo "Инструкция:"
  echo "1. Создайте папку: mkdir -p ~/Downloads/photo-examples"
  echo "2. Сохраните все 6 изображений 3D модели в эту папку"
  echo "3. Запустите этот скрипт снова"
  exit 1
fi

# Создаем целевую папку если не существует
mkdir -p "$TARGET_DIR"

# Подсчитываем файлы
file_count=$(ls -1 "$SOURCE_DIR" | wc -l | tr -d ' ')
echo "📁 Найдено файлов в $SOURCE_DIR: $file_count"

if [ "$file_count" -lt 6 ]; then
  echo "⚠️  Ожидается 6 файлов, найдено только $file_count"
  echo "Убедитесь что все изображения сохранены!"
fi

# Получаем список файлов и сортируем
files=($(ls -1 "$SOURCE_DIR" | sort))

if [ ${#files[@]} -ge 6 ]; then
  echo ""
  echo "Копирование файлов:"
  
  # Маппинг: порядок файлов -> целевое имя
  cp "${SOURCE_DIR}/${files[0]}" "$TARGET_DIR/front.png"
  echo "✓ ${files[0]} → front.png (Вид спереди)"
  
  cp "${SOURCE_DIR}/${files[1]}" "$TARGET_DIR/left34.png"
  echo "✓ ${files[1]} → left34.png (3/4 слева)"
  
  cp "${SOURCE_DIR}/${files[2]}" "$TARGET_DIR/leftProfile.png"
  echo "✓ ${files[2]} → leftProfile.png (Профиль слева)"
  
  cp "${SOURCE_DIR}/${files[3]}" "$TARGET_DIR/right34.png"
  echo "✓ ${files[3]} → right34.png (3/4 справа)"
  
  cp "${SOURCE_DIR}/${files[4]}" "$TARGET_DIR/rightProfile.png"
  echo "✓ ${files[4]} → rightProfile.png (Профиль справа)"
  
  cp "${SOURCE_DIR}/${files[5]}" "$TARGET_DIR/back.png"
  echo "✓ ${files[5]} → back.png (Вид сзади)"
  
  echo ""
  echo "✅ Готово! Примеры скопированы в $TARGET_DIR"
  echo "🌐 Откройте http://localhost:3000/photo-diary для проверки"
else
  echo "❌ Недостаточно файлов для копирования"
  exit 1
fi
