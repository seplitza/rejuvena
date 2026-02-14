/**
 * Theme Context
 * Manages application theming with dynamic color schemes
 * Fetches themes from backend API and applies CSS variables
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '@/config/api';

// Theme interface matching backend model
export interface Theme {
  _id: string;
  name: string;
  slug: string;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
  isDefault: boolean;
  isActive: boolean;
  order: number;
}

interface ThemeContextType {
  theme: Theme | null;
  themes: Theme[];
  setTheme: (slug: string) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'rejuvena_selected_theme';

// Fallback themes in case backend is unavailable
const FALLBACK_THEMES: Theme[] = [
  {
    _id: 'fallback-1',
    name: 'Rejuvena Classic',
    slug: 'rejuvena-classic',
    isDark: false,
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#f97316',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
    },
    gradients: {
      primary: 'from-purple-600 to-pink-600',
      secondary: 'from-orange-500 to-pink-500',
      background: 'from-pink-50 to-purple-50',
    },
    isDefault: true,
    isActive: true,
    order: 1,
  },
  {
    _id: 'fallback-2',
    name: 'Ocean Breeze',
    slug: 'ocean-breeze',
    isDark: false,
    colors: {
      primary: '#2563eb',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      background: '#ffffff',
      surface: '#f0f9ff',
      text: '#1e3a8a',
      textSecondary: '#64748b',
    },
    gradients: {
      primary: 'from-blue-600 to-cyan-600',
      secondary: 'from-cyan-500 to-teal-500',
      background: 'from-blue-50 to-cyan-50',
    },
    isDefault: false,
    isActive: true,
    order: 2,
  },
  {
    _id: 'fallback-3',
    name: 'Dark Mode',
    slug: 'dark-mode',
    isDark: true,
    colors: {
      primary: '#a855f7',
      secondary: '#f472b6',
      accent: '#fb923c',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
    },
    gradients: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-orange-400 to-pink-400',
      background: 'from-gray-900 to-gray-800',
    },
    isDefault: false,
    isActive: true,
    order: 5,
  },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all available themes from API
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        console.log('🎨 ThemeContext: Fetching themes from:', `${API_URL}/api/themes`);
        const response = await fetch(`${API_URL}/api/themes`);
        console.log('🎨 ThemeContext: Response status:', response.status);
        const data = await response.json();
        console.log('🎨 ThemeContext: Response data:', data);
        
        if (data.success && data.themes && data.themes.length > 0) {
          console.log('🎨 ThemeContext: Setting themes:', data.themes.length, 'themes found');
          setThemes(data.themes);
          
          // Load saved theme or default
          const savedThemeSlug = localStorage.getItem(THEME_STORAGE_KEY);
          console.log('🎨 ThemeContext: Saved theme slug:', savedThemeSlug);
          
          if (savedThemeSlug) {
            const savedTheme = data.themes.find((t: Theme) => t.slug === savedThemeSlug);
            if (savedTheme) {
              console.log('🎨 ThemeContext: Applying saved theme:', savedTheme.name);
              setThemeState(savedTheme);
            } else {
              // Saved theme not found, use default
              const defaultTheme = data.themes.find((t: Theme) => t.isDefault);
              console.log('🎨 ThemeContext: Saved theme not found, using default:', defaultTheme?.name);
              setThemeState(defaultTheme || data.themes[0]);
            }
          } else {
            // No saved theme, use default
            const defaultTheme = data.themes.find((t: Theme) => t.isDefault);
            console.log('🎨 ThemeContext: No saved theme, using default:', defaultTheme?.name);
            setThemeState(defaultTheme || data.themes[0]);
          }
        } else {
          // No themes from API, use fallback
          console.warn('🎨 ThemeContext: No themes from API, using fallback themes');
          setThemes(FALLBACK_THEMES);
          const defaultTheme = FALLBACK_THEMES.find(t => t.isDefault) || FALLBACK_THEMES[0];
          setThemeState(defaultTheme);
        }
      } catch (error) {
        console.error('🎨 ThemeContext: Failed to fetch themes, using fallback:', error);
        // Use fallback themes if API fails
        setThemes(FALLBACK_THEMES);
        const savedThemeSlug = localStorage.getItem(THEME_STORAGE_KEY);
        const savedTheme = savedThemeSlug 
          ? FALLBACK_THEMES.find(t => t.slug === savedThemeSlug)
          : null;
        const defaultTheme = savedTheme || FALLBACK_THEMES.find(t => t.isDefault) || FALLBACK_THEMES[0];
        setThemeState(defaultTheme);
      } finally {
        console.log('🎨 ThemeContext: Loading complete');
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  // Apply CSS variables when theme changes
  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply color CSS variables
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    
    // Apply gradient classes (Tailwind classes stored as strings)
    root.style.setProperty('--gradient-primary', theme.gradients.primary);
    root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
    root.style.setProperty('--gradient-background', theme.gradients.background);
    
    // Set dark mode class on body if needed
    if (theme.isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Set theme and save to localStorage
  const setTheme = (slug: string) => {
    const newTheme = themes.find(t => t.slug === slug);
    if (newTheme) {
      setThemeState(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, slug);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themes, setTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
