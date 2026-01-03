const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../src/data/exercisesData.generated.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Exercise duration rules:
// - Most exercises: 90 seconds (1-2 minutes average)
// - "На валике": 1800 seconds (30 minutes)
// - "Стоечка у стены": 300 seconds (5 minutes, range 1-10)

// Update all duration: 300 -> 90 (1.5 minutes)
content = content.replace(/duration: 300,/g, 'duration: 90,');

// Update "На валике" to 1800 seconds (30 minutes)
content = content.replace(
  /(exerciseName: 'На валике',[\s\S]*?duration: )\d+,/,
  '$11800,'
);

// Update "Стоечка у стены" to 300 seconds (5 minutes)
content = content.replace(
  /(exerciseName: 'Стоечка у стены',[\s\S]*?duration: )\d+,/,
  '$1300,'
);

// Fix emojis - replace broken HTML entities with actual emojis
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/1f642\.svg\);">&nbsp;<\/span>/g,
  '🙂'
);
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/1f609\.svg\);">&nbsp;<\/span>/g,
  '😉'
);
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/1f4aa\.svg\);">&nbsp;<\/span>/g,
  '💪'
);
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/1f60c\.svg\);">&nbsp;<\/span>/g,
  '😌'
);
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/1f605\.svg\);">&nbsp;<\/span>/g,
  '😅'
);
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/1f44d\.svg\);">&nbsp;<\/span>/g,
  '👍'
);
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/270c\.svg\);">&nbsp;<\/span>/g,
  '✌'
);
content = content.replace(
  /<span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url\(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/emojione\/2\.0\.1\/assets\/svg\/1f449\.svg\);">&nbsp;<\/span>/g,
  '👉'
);

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Updated durations and fixed emojis!');
console.log('   - Regular exercises: 90 seconds (1-2 min)');
console.log('   - На валике: 1800 seconds (30 min)');
console.log('   - Стоечка у стены: 300 seconds (5 min)');
console.log('   - Fixed emoji HTML entities');
