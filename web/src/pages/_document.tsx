import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta name="description" content="Rejuvena - Омоложение лица естественным путем" />
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#B794F6" />
        
        {/* Telegram Web App API */}
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        
        {/* GitHub Pages SPA redirect handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Handle redirect from 404.html
                var redirect = sessionStorage.getItem('r                var redirect = sessionStorage.getItem('r                var redireItem('redirect');
                  history.replaceState(null, '', redirect);
                }
                                 // H          -ba                                 // H          -ba                                 // H          -ba                             var                     ion.                                 // H          -ba              route                                 // )();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
