import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Get basePath from environment or use default
  const basePath = process.env.NODE_ENV === 'production' ? '/rejuvena' : '';
  
  return (
    <Html lang="ru">
      <Head>
        <meta name="description" content="Rejuvena - Омоложение лица естественным путем" />
        
        {/* Favicons */}
        <link rel="icon" type="image/png" href={`${basePath}/favicon.png`} />
        <link rel="alternate icon" href={`${basePath}/favicon.ico`} />
        <link rel="apple-touch-icon" href={`${basePath}/apple-touch-icon.png`} />
        <meta name="theme-color" content="#B794F6" />
        
        {/* Telegram Web App API */}
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        
        {/* GitHub Pages SPA redirect handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                                            var red                                            var red         if                                    io                                            var                                               var red                           f (window.loc                  ow.      on.hash.startsWith('#/')) {
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
