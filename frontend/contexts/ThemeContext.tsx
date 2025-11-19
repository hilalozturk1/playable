import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'rose' | 'blue' | 'green' | 'purple' | 'orange';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  bg: string;
  bgLight: string;
  text: string;
  border: string;
}

const themes: Record<Theme, ThemeColors> = {
  rose: {
    primary: 'rose-600',
    primaryDark: 'rose-700',
    primaryLight: 'rose-500',
    secondary: 'pink-500',
    accent: 'rose-400',
    bg: 'rose-50',
    bgLight: 'rose-100',
    text: 'rose-900',
    border: 'rose-200',
  },
  blue: {
    primary: 'blue-600',
    primaryDark: 'blue-700',
    primaryLight: 'blue-500',
    secondary: 'cyan-500',
    accent: 'blue-400',
    bg: 'blue-50',
    bgLight: 'blue-100',
    text: 'blue-900',
    border: 'blue-200',
  },
  green: {
    primary: 'green-600',
    primaryDark: 'green-700',
    primaryLight: 'green-500',
    secondary: 'emerald-500',
    accent: 'green-400',
    bg: 'green-50',
    bgLight: 'green-100',
    text: 'green-900',
    border: 'green-200',
  },
  purple: {
    primary: 'purple-600',
    primaryDark: 'purple-700',
    primaryLight: 'purple-500',
    secondary: 'violet-500',
    accent: 'purple-400',
    bg: 'purple-50',
    bgLight: 'purple-100',
    text: 'purple-900',
    border: 'purple-200',
  },
  orange: {
    primary: 'orange-600',
    primaryDark: 'orange-700',
    primaryLight: 'orange-500',
    secondary: 'amber-500',
    accent: 'orange-400',
    bg: 'orange-50',
    bgLight: 'orange-100',
    text: 'orange-900',
    border: 'orange-200',
  },
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('green');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && themes[savedTheme]) {
        setThemeState(savedTheme);
      }
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

