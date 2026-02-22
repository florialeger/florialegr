import PropTypes from 'prop-types';
import styles from './ShinyText.module.css';

const ShinyText = ({
  text = '✨ Shiny Text Effect',
  speed = 2,
  delay = 0,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
}) => {
  const animationDuration = `${speed}s`;
  const animationDelay = `${delay}s`;
  const animationDirection = yoyo ? 'alternate' : 'normal';
  const animationIterationCount = yoyo ? 'infinite' : 'infinite';

  const style = {
    '--text-color': color,
    '--shine-color': shineColor,
    '--spread': `${spread}deg`,
    '--animation-duration': animationDuration,
    '--animation-delay': animationDelay,
    '--animation-direction': animationDirection,
    '--animation-iteration-count': animationIterationCount,
  };

  const className = [
    styles.shinyText,
    disabled && styles.disabled,
    pauseOnHover && styles.pauseOnHover,
    direction === 'right' && styles.directionRight,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
};

ShinyText.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
  delay: PropTypes.number,
  color: PropTypes.string,
  shineColor: PropTypes.string,
  spread: PropTypes.number,
  direction: PropTypes.oneOf(['left', 'right']),
  yoyo: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ShinyText;
