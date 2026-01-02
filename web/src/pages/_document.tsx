import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta name="description" content="FaceLift Naturally - Natural Face Rejuvenation" />
        <link rel="icon" href="/favicon.ico" />
        {/* Telegram Web App API */}
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        {/* GitHub Pages SPA redirect handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Handle redirect from 404.html
                var redirect = sessionStorage.getItem('redirect');
                if (redirect) {
                  sessionStorage.removeItem('redirect');
                  history.replaceState(null, '', redirect);
                }
                
                // Handle hash-based routing from 404.html
                if (window.location.hash && window.location.hash.startsWith('#/')) {
                  var route = window.location.hash.slice(1);
                  history.replaceState(null, '', route);
                }
              })();
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
