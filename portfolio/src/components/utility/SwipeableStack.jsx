import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './SwipeableStack.module.css';

// Import all stack images
import Stack01 from '@/assets/images/Stack-01.jpg';
import Stack02 from '@/assets/images/Stack-02.jpg';
import Stack03 from '@/assets/images/Stack-03.jpg';
import Stack04 from '@/assets/images/Stack-04.jpg';
import Stack05 from '@/assets/images/Stack-05.jpg';
import Stack06 from '@/assets/images/Stack-06.jpg';
import Stack07 from '@/assets/images/Stack-07.jpg';
import Stack08 from '@/assets/images/Stack-08.jpg';
import Stack09 from '@/assets/images/Stack-09.jpg';
import Stack10 from '@/assets/images/Stack-10.jpg';
import Stack11 from '@/assets/images/Stack-11.jpg';
import Stack12 from '@/assets/images/Stack-12.jpg';
import Stack13 from '@/assets/images/Stack-13.jpg';
import Stack14 from '@/assets/images/Stack-14.jpg';
import Stack15 from '@/assets/images/Stack-15.jpg';
import Stack16 from '@/assets/images/Stack-16.jpg';
import Stack17 from '@/assets/images/Stack-17.jpg';
import Stack18 from '@/assets/images/Stack-18.jpg';
import Stack19 from '@/assets/images/Stack-19.jpg';
import Stack20 from '@/assets/images/Stack-20.jpg';
import Stack21 from '@/assets/images/Stack-21.jpg';
import Stack22 from '@/assets/images/Stack-22.jpg';
import Stack23 from '@/assets/images/Stack-23.jpg';
import Stack24 from '@/assets/images/Stack-24.jpg';
import Stack25 from '@/assets/images/Stack-25.jpg';
import Stack26 from '@/assets/images/Stack-26.jpg';

const stackImagesArray = [
  Stack01,
  Stack02,
  Stack03,
  Stack04,
  Stack05,
  Stack06,
  Stack07,
  Stack08,
  Stack09,
  Stack10,
  Stack11,
  Stack12,
  Stack13,
  Stack14,
  Stack15,
  Stack16,
  Stack17,
  Stack18,
  Stack19,
  Stack20,
  Stack21,
  Stack22,
  Stack23,
  Stack24,
  Stack25,
  Stack26,
].reverse(); // Reverse so Stack-01 is on top

function CardRotate({ children, onSendToBack }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_, info) {
    const threshold = 180;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className={styles.card}
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

CardRotate.propTypes = {
  children: PropTypes.node.isRequired,
  onSendToBack: PropTypes.func.isRequired,
};

export default function SwipeableStack() {
  // Create cards from imported images
  const stackImages = stackImagesArray.map((img, i) => ({
    id: 25 - i, // ID goes from 25 down to 1
    z: i, // z-index goes from 0 to 24
    img: img,
  }));

  const [cards, setCards] = useState(stackImages);
  const seenCardsRef = useRef(new Set(stackImages.slice(-5).map((c) => c.id)));

  const sendToBack = (id) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  // Only render the top 5 cards
  const visibleCards = cards.slice(-5);

  return (
    <div className={styles.container} style={{ perspective: 800 }}>
      {visibleCards.map((card, index) => {
        const isNewCard = !seenCardsRef.current.has(card.id);
        if (isNewCard) {
          seenCardsRef.current.add(card.id);
        }

        return (
          <CardRotate key={card.id} onSendToBack={() => sendToBack(card.id)}>
            <motion.div
              className={styles.cardInner}
              animate={{
                rotateZ: (visibleCards.length - index - 1) * 4,
                scale: 1 + index * 0.06 - visibleCards.length * 0.06,
                transformOrigin: '100% 90%',
                x: 0,
                opacity: 1,
              }}
              initial={{
                rotateZ: (visibleCards.length - index - 1) * 4,
                scale: 1 + index * 0.06 - visibleCards.length * 0.06,
                x: isNewCard && index === 0 ? 10 : 0,
                opacity: isNewCard && index === 0 ? 0 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: isNewCard && index === 0 ? 150 : 260,
                damping: isNewCard && index === 0 ? 25 : 20,
                duration: isNewCard && index === 0 ? 0.8 : undefined,
              }}
            >
              <img src={card.img} alt={`Stack card ${card.id}`} className={styles.image} />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
