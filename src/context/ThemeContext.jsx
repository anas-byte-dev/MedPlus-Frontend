import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Supported modes: 'light', 'dark', 'eye-comfort'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('medplus_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('medplus_theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      // Cycle: light -> dark -> eye-comfort -> light
      setTheme(prev => {
        if (prev === 'light') return 'dark';
        if (prev === 'dark') return 'eye-comfort';
        return 'light';
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
