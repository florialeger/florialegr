import { memo, useCallback, useState } from 'react';
import RevealAnimation from '@/components/utility/RevealAnimation';
import Container from '@/components/ui/Container';
import TextMorph from '@/components/utility/TextMorph';
import styles from './HeroSection.module.css';
import Button from '@/components/ui/Button';

const HeroSection = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailCopy = useCallback(async () => {
    const email = 'floria.leger@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container className={styles.heroContainer}>
        <RevealAnimation cascade damping={0.12} delay={0} triggerOnce>
          <div className={styles.heroContent}>
            <h1 id="hero-title" className={styles.heroTitle}>
              Cognitive UX Designer
            </h1>
            <p className={styles.heroSubtitle}>
              Bridging cognitive engineering and visual craft to simplify mission-critical software, enterprise design
              systems, and complex human-machine workflows.
            </p>
            <div className={styles.buttonWrapper}>
              <Button
                variant="secondary"
                size="small"
                icon="send"
                label={<TextMorph>{emailCopied ? 'Email copied!' : 'send email'}</TextMorph>}
                onClick={(e) => {
                  e.preventDefault();
                  handleEmailCopy();
                }}
              />
              <Button variant="primary" icon="next" label="see my work" to="/work" />
            </div>
          </div>
        </RevealAnimation>
      </Container>
    </section>
  );
};

export default memo(HeroSection);
