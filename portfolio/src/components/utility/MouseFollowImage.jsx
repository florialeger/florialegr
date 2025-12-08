import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from './MouseFollowImage.module.css';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const MouseFollowImage = ({ imageSrc, isVisible }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const rotate = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });
  const scale = useSpring(1, springValues);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newX = e.clientX;
      const newY = e.clientY;

      setPosition({ x: newX, y: newY });
      if (!isReady) setIsReady(true);

      if (isVisible) {
        // Calculate velocity based on Y movement
        const velocityY = newY - lastPositionRef.current.y;
        // Rotate based on vertical velocity (moving down = positive rotation, moving up = negative)
        rotate.set(-velocityY * 0.6);
      }

      lastPositionRef.current = { x: newX, y: newY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReady, isVisible, rotate]);

  useEffect(() => {
    if (isVisible) {
      scale.set(1);
    } else {
      scale.set(0.8);
      rotate.set(0);
    }
  }, [isVisible, scale, rotate]);

  if (!imageSrc) return null;

  return (
    <motion.div
      ref={imageRef}
      className={styles.followImage}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isVisible && isReady ? 1 : 0,
        rotate,
        scale,
        translateX: '10px',
        translateY: '10px',
      }}
    >
      <img src={imageSrc} alt="" />
    </motion.div>
  );
};

MouseFollowImage.propTypes = {
  imageSrc: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
};

export default MouseFollowImage;
