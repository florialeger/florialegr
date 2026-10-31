import { memo } from 'react';
import RevealAnimation from '@/components/utility/RevealAnimation';
import Container from '@/components/ui/Container';
import styles from './HeroSection.module.css';
import Button from '@/components/ui/Button';
//import heroVideo from '@/assets/images/hero.mp4';

const HeroSection = () => {

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container className={styles.heroContainer}>
        <RevealAnimation cascade damping={0.12} delay={0} triggerOnce>
          <div className={styles.heroContent}>
            <h1 id="hero-title" className={styles.heroTitle}>
              UX Designer
            </h1>
            <p className={styles.heroSubtitle}>
              Bridging cognitive engineering and visual craft to simplify mission-critical software, enterprise design
              systems, and complex human-machine workflows.
            </p>
            <div className={styles.buttonWrapper}>
              <Button
                variant="primary"
                href="https://florialeger.github.io/deck/"
                size="small"
                icon="external"
                label="view case studies"
              />
              <Button variant="secondary" icon="next" label="browse projects" to="/work" />
            </div>
          </div>
        </RevealAnimation>
      </Container>
    </section>
  );
};

export default memo(HeroSection);

//   <div className={styles.heroVisual}>
//        <video className={styles.heroVideo} src={heroVideo} autoPlay loop muted playsInline />{' '}
//    </div>
