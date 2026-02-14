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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all available themes from API
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/themes`);
        const data = await response.json();
        
        if (data.success && data.themes) {
          setThemes(data.themes);
          
          // Load saved theme or default
          const savedThemeSlug = localStorage.getItem(THEME_STORAGE_KEY);
          
          if (savedThemeSlug) {
            const savedTheme = data.themes.find((t: Theme) => t.slug === savedThemeSlug);
            if (savedTheme) {
              setThemeState(savedTheme);
            } else {
              // Saved theme not found, use default
              const defaultTheme = data.themes.find((t: Theme) => t.isDefault);
              setThemeState(defaultTheme || data.themes[0]);
            }
          } else {
            // No saved theme, use default
            const defaultTheme = data.themes.find((t: Theme) => t.isDefault);
            setThemeState(defaultTheme || data.themes[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      } finally {
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
