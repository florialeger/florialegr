import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { themes } from '@assets/styles/theme'; // Make sure this path is correct

// Define a default theme (e.g., the first one in your themes object)
const defaultTheme = Object.keys(themes)[0] || 'default'; // Use 'default' or a specific theme name

// Create the context
const ThemeContext = createContext(null);

// Define the provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage for a saved theme
    try {
      const savedTheme = window.localStorage.getItem('app-theme');
      // Ensure the saved theme is actually one of your defined themes
      return savedTheme && themes[savedTheme] ? savedTheme : defaultTheme;
    } catch (error) {
      console.error('Could not read theme from localStorage', error);
      return defaultTheme;
    }
  });

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
  useEffect(() => {
    try {
      window.localStorage.setItem('app-theme', theme);
    } catch (error) {
      console.error('Could not save theme to localStorage', error);
    }
  }, [theme]); // Re-run only when theme changes

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      availableThemes: Object.keys(themes), // Provide available theme names
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
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
