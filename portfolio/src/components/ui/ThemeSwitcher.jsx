import { useState, useRef } from 'react'; // Removed useEffect
import { useTheme } from '@contexts/ThemeContext'; // Import the hook
import useThemeMotion from '@hooks/useThemeMotion';
// Removed import { themes } - no longer needed directly here if context provides names
import wheel from '/wheel.png';
import styles from './ThemeSwitcher.module.css';

// Keep ThemeCircle as is, but it needs the background color info
// Let's pass the whole theme object for flexibility or just the required color
const ThemeCircle = ({ themeName, themeData, handleThemeChange }) => {
  return (
    <div
      className={styles['theme-circle']}
      style={{ background: themeData.backgroundTheme }} // Access the color from themeData
      onClick={(e) => {
        e.stopPropagation();
        handleThemeChange(themeName);
      }}
    />
  );
};

const getRandomTheme = (currentTheme, availableThemes) => {
  // Use availableThemes from context
  const otherThemes = availableThemes.filter((t) => t !== currentTheme);
  if (otherThemes.length === 0) return currentTheme; // Handle edge case
  const randomIndex = Math.floor(Math.random() * otherThemes.length);
  return otherThemes[randomIndex];
};

// REMOVED props: currentTheme, setCurrentTheme
const ThemeSwitcher = () => {
  // Get theme state and functions from context
  const {
    theme: currentTheme,
    setTheme,
    availableThemes,
    themes: themeDataMap,
  } = useTheme(); // themes: themeDataMap added if needed by ThemeCircle

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const themeSwitcherRef = useRef(null);

  // REMOVED useEffect that applied theme styles - This is now handled by ThemeProvider

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme); // Use setTheme from context
    setIsOpen(false);
    setIsHovered(false);
  };

  const handleClick = () => {
    if (isOpen) {
      // Pass availableThemes from context to getRandomTheme
      const randomTheme = getRandomTheme(currentTheme, availableThemes);
      handleThemeChange(randomTheme);
    } else {
      setIsOpen(true);
    }
  };

  useThemeMotion(isHovered, themeSwitcherRef);

  // You might need the actual theme data if ThemeCircle uses more than just the name
  // If so, modify ThemeContext to also provide the full `themes` object
  // Option 1: Context provides `themes` object (modify ThemeContext value)
  // const { theme: currentTheme, setTheme, availableThemes, themes: themeDataMap } = useTheme();
  // Option 2: Import `themes` here if ThemeCircle needs it (less ideal separation)
  // import { themes as themeDataMap } from '@assets/styles/theme';

  return (
    <div
      ref={themeSwitcherRef}
      className={`${styles['theme-switcher']} ${isOpen ? styles.open : ''}`}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsOpen(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsOpen(false);
        setIsHovered(false);
      }}
    >
      <img src={wheel} alt="Color Wheel" className={styles['color-wheel']} />
      {availableThemes // Use availableThemes from context
        .filter((t) => t !== currentTheme)
        .map((themeName) => (
          <ThemeCircle
            key={themeName}
            themeName={themeName}
            // You need themeData for the background. Let's assume context provides it
            // If not, import 'themes' here. Best is context provides it.
            themeData={themes[themeName]} // Assuming themes is imported or passed via context
            handleThemeChange={handleThemeChange}
          />
        ))}
    </div>
  );
};

// If ThemeCircle needs themeData, make sure `themes` is accessible.
// Easiest is importing it directly, but cleaner to add it to context value.
// Let's assume you import it for now:
import { themes } from '@assets/styles/theme';

export default ThemeSwitcher;
