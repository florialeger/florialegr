import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import RevealAnimation from '@/components/utility/RevealAnimation';
import WorkCard from '@/components/sections/WorkCard';
import ProjectListItem from '@/components/projects/ProjectListItem';
import Button from '@/components/ui/Button';
import TextMorph from '@/components/utility/TextMorph';
import { usePortfolio } from '@/contexts/PortfolioContext';
import styles from './Work.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';

// Animation variants for view transitions
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

const Work = () => {
  const { projectsInDataOrder, work, loading, error } = usePortfolio();
  const location = useLocation();
  const [hoveredWorkSlug, setHoveredWorkSlug] = useState(null);
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailCopy = useCallback(async () => {
    const email = 'floria.leger@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
    }
  }, []);

  // Scroll restoration when returning from detail page
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      // Wait for projects to render
      setTimeout(() => {
        const targetCard = document.querySelector(`[data-slug="${scrollTo.slug}"]`);
        if (targetCard) {
          const rect = targetCard.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementHeight = rect.height;
          const viewportHeight = window.innerHeight;
          const scrollPosition = elementTop - viewportHeight / 2 + elementHeight / 2;

          window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [location.state?.scrollTo]);

  const handleWorkMouseEnter = useCallback((item) => {
    setHoveredWorkSlug(item.slug);
  }, []);

  const handleWorkMouseLeave = useCallback(() => {
    setHoveredWorkSlug(null);
  }, []);

  const handleProjectMouseEnter = useCallback((item) => {
    setHoveredProjectSlug(item.slug);
  }, []);

  const handleProjectMouseLeave = useCallback(() => {
    setHoveredProjectSlug(null);
  }, []);

  return (
    <div className={pageLayout.page}>
      <Container className={styles.introContainer}>
        <RevealAnimation cascade damping={0.08} triggerOnce>
          <p>
            <strong>Hi, I&apos;m Floria.</strong> I merge human psychology and UI to craft data-driven experiences. My
            approach is backed by 3+ years of dedicated practice and a deep expertise in{' '}
            illustration, allowing me to build products that are as functional as they are visually
            immersive.
          </p>
          <p>
            Previously at{' '}
            <a className={styles.dottedLink} href="https://www.airbus.com/en" target="_blank" rel="noreferrer">
              Airbus,
            </a>{' '}
            <a className={styles.dottedLink} href="https://www.ims-bordeaux.fr/" target="_blank" rel="noreferrer">
              IMS
            </a>{' '}
            and{' '}
            <a className={styles.dottedLink} href="https://www.ubisoft.com/fr-fr" target="_blank" rel="noreferrer">
              Ubisoft,
            </a>{' '}
            I am now seeking a UX Designer role where I can apply cognitive engineering principles to immersive digital
            products. Feel free to connect with me on{' '}
            <a
              className={styles.dottedLink}
              href="https://www.linkedin.com/in/florialeger/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn.
            </a>
          </p>
          <div className={styles.introAction}>
            <Button
              variant="primary"
              size="small"
              icon="send"
              label={<TextMorph>{emailCopied ? 'Email copied!' : 'send email'}</TextMorph>}
              onClick={handleEmailCopy}
            />
          </div>
        </RevealAnimation>
      </Container>

      {/* Recent gigs section */}
      {work && work.length > 0 && (
        <Container className={styles.workContainer}>
          {!loading && !error && (
            <div className={styles.workList}>
              <RevealAnimation cascade damping={0.15} triggerOnce>
                {work.map((workItem) => {
                  const targetState = { from: `${location.pathname}${location.search}${location.hash}` };
                  return (
                    <WorkCard
                      key={workItem.slug}
                      work={workItem}
                      targetState={targetState}
                      isDimmed={hoveredWorkSlug && hoveredWorkSlug !== workItem.slug}
                      onMouseEnter={() => handleWorkMouseEnter(workItem)}
                      onMouseLeave={handleWorkMouseLeave}
                    />
                  );
                })}
              </RevealAnimation>
            </div>
          )}
        </Container>
      )}

      {/* Some of my projects section */}
      <Container className={styles.projectsContainer}>
        <div className={styles.projectsHeader}>
          <RevealAnimation triggerOnce>
            <h2>Some of my projects</h2>
          </RevealAnimation>
        </div>

        {loading && <p className={styles.stateMessage}>Loading projects…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load projects right now.</p>}

        {!loading && !error && projectsInDataOrder.length === 0 && (
          <p className={styles.stateMessage}>Projects will be added soon.</p>
        )}

        {!loading && !error && projectsInDataOrder.length > 0 && (
          <RevealAnimation triggerOnce>
            <motion.div className={styles.projectList} variants={containerVariants} initial="hidden" animate="show">
              {projectsInDataOrder.map((project) => {
                const targetState = { from: `${location.pathname}${location.search}${location.hash}` };
                return (
                  <motion.div key={project.slug} variants={itemVariants}>
                    <ProjectListItem
                      project={project}
                      targetState={targetState}
                      isDimmed={hoveredProjectSlug && hoveredProjectSlug !== project.slug}
                      onMouseEnter={() => handleProjectMouseEnter(project)}
                      onMouseLeave={handleProjectMouseLeave}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </RevealAnimation>
        )}
      </Container>
    </div>
  );
};

export default Work;
