import React, { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button'; // Example: Add a CTA button
import styles from './HeroSection.module.css';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

/**
 * The main introductory section of the portfolio.
 */
const HeroSection = ({ className = '' }) => {
  const combinedClassName = `${styles.heroSection} ${className}`.trim();

  return (
    <section className={combinedClassName}>
      <Container>
        <motion.div
          className={styles.contentWrapper}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className={styles.name} variants={itemVariants}>
            Floria Leger {/* Or pass as prop */}
          </motion.h1>
          <motion.p className={styles.title} variants={itemVariants}>
            Illustrator & UX Designer {/* Or pass as prop */}
          </motion.p>
          <motion.p className={styles.subtitle} variants={itemVariants}>
            {/* Add a short, compelling tagline or description */}
            Creating engaging visuals and intuitive digital experiences.
          </motion.p>
          <motion.div variants={itemVariants} className={styles.actions}>
            {/* Example Call to Action Button */}
            <Button to="/work" variant="primary" size="large">
              View My Work
            </Button>
            <Button href="#contact" variant="outline" size="large"> {/* Link to contact section */}
              Get In Touch
            </Button>
          </motion.div>
        </motion.div>
        {/* You could add a visual element here (image, illustration, animation) */}
        {/* <motion.div className={styles.visualElement} variants={itemVariants}> ... </motion.div> */}
      </Container>
    </section>
  );
};

HeroSection.propTypes = {
    className: PropTypes.string,
};

export default memo(HeroSection);

/* --- HeroSection.module.css (Example) ---
.heroSection {
  padding: var(--section-padding-y-large, 6rem) 0;
  background-color: var(--hero-bg-color, transparent); 
  text-align: center;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contentWrapper {
  max-width: 800px;
  margin: 0 auto;
}

.name {
  font-size: var(--font-size-xxl, 3rem);
  margin-bottom: 0.5rem;
  color: var(--heading-color, inherit);
}

.title {
  font-size: var(--font-size-xl, 2rem);
  color: var(--primary-color, blue); 
  margin-bottom: 1.5rem;
  font-weight: 500;
}

 .subtitle {
     font-size: var(--font-size-large, 1.25rem);
     color: var(--text-secondary-color, grey);
     margin-bottom: 2.5rem;
     max-width: 600px;
     margin-left: auto;
     margin-right: auto;
 }

 .actions {
     display: flex;
     justify-content: center;
     gap: 1rem;
     flex-wrap: wrap; 
*/