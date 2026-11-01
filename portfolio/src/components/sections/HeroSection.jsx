import { memo, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '@/contexts/PortfolioContext';
import RevealAnimation from '@/components/utility/RevealAnimation';
import Container from '@/components/ui/Container';
import styles from './HeroSection.module.css';
import Button from '@/components/ui/Button';
import WorkCard from '@/components/sections/WorkCard';

const HeroSection = () => {
  const featuredSlugs = useMemo(() => ['creator-visibility', 'vmt', 'emco'], []);

  const location = useLocation();
  const { work = [], projectsInDataOrder = [] } = usePortfolio();
  const [hoveredWorkSlug, setHoveredWorkSlug] = useState(null);
  const handleWorkMouseEnter = useCallback((item) => {
    setHoveredWorkSlug(item.slug);
  }, []);

  const handleWorkMouseLeave = useCallback(() => {
    setHoveredWorkSlug(null);
  }, []);

  const featuredItems = useMemo(() => {
    const allItems = [...work, ...projectsInDataOrder];
    return featuredSlugs.map((slug) => allItems.find((item) => item.slug === slug)).filter(Boolean);
  }, [work, projectsInDataOrder, featuredSlugs]);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container className={styles.heroContainer}>
        <RevealAnimation cascade damping={0.12} delay={0} triggerOnce>
          <div className={styles.heroContent}>
            <div className={styles.heroWording}>
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
                <Button variant="secondary" icon="next" label="browse projects" to="/" />
              </div>
            </div>

            <div className={styles.MainProjects}>
              {featuredItems.map((item) => {
                const targetState = { from: `${location.pathname}${location.search}${location.hash}` };
                return (
                  <WorkCard
                    key={item.slug}
                    work={item}
                    targetState={targetState}
                    isDimmed={hoveredWorkSlug && hoveredWorkSlug !== item.slug}
                    onMouseEnter={() => handleWorkMouseEnter(item)}
                    onMouseLeave={handleWorkMouseLeave}
                  />
                );
              })}
            </div>
          </div>
        </RevealAnimation>
      </Container>
    </section>
  );
};

export default memo(HeroSection);
