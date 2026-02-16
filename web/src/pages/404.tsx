/**
 * Custom 404 Page for GitHub Pages SPA Routing
 * Redirects to the correct path after preserving it in sessionStorage
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Get the attempted path
    const path = window.location.pathname;
    const search = window.location.search;
    const basePath = '/rejuvena';

    // Store path for _app.tsx to handle
    sessionStorage.setItem('redirectPath', path + search);

    // Redirect to index to trigger the app's redirect logic
    window.location.replace(basePath + '/' + search);
  }, [router]);

  return (
    <>
      <Head>
        <title>Загрузка... - Rejuvena</title>
        <meta name="robots" content="noindex" />
      </Head>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #fef3f8 0%, #f3e7ff 100%)'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          {/* Animated spinner */}
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #B794F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }} />
          
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Загрузка...
          </h1>
          
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Перенаправление на запрошенную страницу
          </p>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
