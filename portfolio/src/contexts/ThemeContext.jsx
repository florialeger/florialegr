/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { themes } from '@assets/styles/theme'; // Make sure this path is correct

// Define a default theme. Temporarily force 'white' (light) theme so the site
// stays in light mode while the theme switcher is hidden. To restore the
// previous behavior (respecting localStorage), revert this to the original
// implementation using Object.keys(themes)[0].
const defaultTheme = 'white';

// Create the context
const ThemeContext = createContext(null);

// Define the provider component
export const ThemeProvider = ({ children }) => {
  // Temporarily ignore any previously saved theme and always start with
  // the light `white` theme. This makes it easy to keep the site in light
  // mode while the ThemeSwitcher is hidden. Revert if you want to restore
  // persisted theme behavior.
  const [theme, setTheme] = useState(() => defaultTheme);

  // Effect to apply the theme to the document root
  useEffect(() => {
    const root = document.documentElement;
    const currentThemeStyles = themes[theme];

    // Clear previous theme properties (optional but good practice)
    // You might need to adapt this if you have other root variables
    // Object.keys(themes[defaultTheme]).forEach(key => {
    //   root.style.removeProperty(`--${key}`);
    // });

    // Apply new theme properties
    Object.entries(currentThemeStyles).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      // console.log(`Setting --${key} to ${value}`); // For debugging
    });

    // Optional: Add class to body or root for broader CSS targeting
    // root.className = ''; // Clear previous theme classes
    // root.classList.add(`theme-${theme}`);
  }, [theme]); // Re-run only when theme changes

  // Effect to save the theme to localStorage
  // Persist the forced light theme so reloading the page remains in light mode.
  // You can remove this effect to stop persisting, or uncomment the block
  // below to restore the original persisted behavior.
  useEffect(() => {
    try {
      window.localStorage.setItem('app-theme', theme);
    } catch (error) {
      // ignore
    }
  }, [theme]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      availableThemes: Object.keys(themes), // Provide available theme names
      themes,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

// Create a custom hook for consuming the context easily
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
    // This error check is crucial!
  }
  return context;
};

// Optional: Export the context itself if needed elsewhere (less common)
// export default ThemeContext;
