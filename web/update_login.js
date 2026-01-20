const fs = require('fs');
const lines = fs.readFileSync('src/pages/auth/login.tsx', 'utf8').split('\n');

lines[36] = "      errorNetworkError: 'Ошибка сети. Проверьте интернет-соединение или отправьте скриншот в поддержку: https://t.me/seplitza_support',";

lines.splice(37, 0, 
  "      errorCorsIssue: 'Не удалось подключиться к серверу. Попробуйте обновить страницу или отправьте скриншот в поддержку: https://t.me/seplitza_support',",
  "      errorServerError: 'Ошибка сервера. Попробуйте позже или отправьте скриншот в поддержку: https://t.me/seplitza_support',"
);

lines.splice(60, 0,
  "      errorCorsIssue: 'Cannot connect to server. Please send screenshot to support: https://t.me/seplitza_support',",
  "      errorSe  "      errorSe  "      errorSe  "      errorSe  "      errorSe  "      errorSe annot connect to server': 'errorCorsIssue',",
  "      'CORS': 'errorCorsIssue',",
  "      'Internal server error': 'errorServerError',",
  "      'Server error': 'errorServerError',"
);

fs.writeFileSync('src/pages/auth/login.tsx', lines.join('\n'), 'utf8');
console.log('✓ OK');
