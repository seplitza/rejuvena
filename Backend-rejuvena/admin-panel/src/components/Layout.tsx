import { Outlet, Link, useLocation } from 'react-router-dom';
import { removeAuthToken } from '../utils/auth';

interface LayoutProps {
  onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
  const location = useLocation();

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        background: '#1F2937',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>
          Rejuvena Admin
        </h1>
        
        <nav style={{ flex: 1 }}>
          <Link
            to="/dashboard"
            style={{
              display: 'block',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'white',
              background: isActive('/dashboard') ? '#4F46E5' : 'transparent',
              transition: 'background 0.2s'
            }}
          >
            📊 Dashboard
          </Link>
          
          <Link
            to="/exercises"
            style={{
              display: 'block',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'white',
              background: isActive('/exercises') ? '#4F46E5' : 'transparent',
              transition: 'background 0.2s'
            }}
          >
            💪 Упражнения
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#DC2626',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Выйти
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, background: '#F9FAFB', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
