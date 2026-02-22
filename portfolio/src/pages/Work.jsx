import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Container from '@/components/ui/Container';
import ViewToggle from '@/components/ui/ViewToggle';
import RevealAnimation from '@/components/utility/RevealAnimation';
import MouseFollowImage from '@/components/utility/MouseFollowImage';
import WorkCard from '@/components/sections/WorkCard';
import ProjectCard from '@/components/sections/ProjectCard';
import ProjectListItem from '@/components/projects/ProjectListItem';
import { usePortfolio } from '@/contexts/PortfolioContext';
import styles from './Work.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';

const extractYear = (value) => {
  if (!value) return 'Upcoming';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Upcoming';
  return String(date.getFullYear());
};

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
  const { projects, work, loading, error } = usePortfolio();
  const location = useLocation();
  const [view, setView] = useState('list');
  const [hoveredWorkSlug, setHoveredWorkSlug] = useState(null);
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const groupedProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects) || !projects.length) return [];
    const groups = projects.reduce((acc, project) => {
      // Use endDate for grouping if available, otherwise use created date
      const dateForGrouping = project.endDate || project.created;
      const year = extractYear(dateForGrouping);
      if (!acc[year]) acc[year] = [];
      acc[year].push(project);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([year, items]) => ({
        year,
        items: items.slice().sort((a, b) => {
          // Prioritize ongoing projects
          const aOngoing = a.duration === 'ongoing';
          const bOngoing = b.duration === 'ongoing';
          if (aOngoing && !bOngoing) return -1;
          if (!aOngoing && bOngoing) return 1;
          // Then sort by completion date (endDate if available, otherwise created)
          const dateA = a.endDate || a.created || 0;
          const dateB = b.endDate || b.created || 0;
          return new Date(dateB) - new Date(dateA);
        }),
      }))
      .sort((a, b) => {
        const yearA = Number(a.year);
        const yearB = Number(b.year);

        if (Number.isNaN(yearA) && Number.isNaN(yearB)) return 0;
        if (Number.isNaN(yearA)) return 1;
        if (Number.isNaN(yearB)) return -1;
        return yearB - yearA;
      });
  }, [projects]);

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
    // No tooltip image for work items
  }, []);

  const handleWorkMouseLeave = useCallback(() => {
    setHoveredWorkSlug(null);
    setHoveredImage(null);
  }, []);

  const handleProjectMouseEnter = useCallback((item) => {
    setHoveredProjectSlug(item.slug);
    // No tooltip image for projects
  }, []);

  const handleProjectMouseLeave = useCallback(() => {
    setHoveredProjectSlug(null);
    setHoveredImage(null);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  return (
    <div className={pageLayout.page}>
      {/* Recent gigs section */}
      {work && work.length > 0 && (
        <Container className={styles.workContainer}>
          <RevealAnimation triggerOnce>
            <h2>Recent work</h2>
          </RevealAnimation>

          {!loading && !error && (
            <div className={styles.timeline}>
              <RevealAnimation cascade damping={0.15} triggerOnce>
                {work.map((workItem) => {
                  const targetState = { from: `${location.pathname}${location.search}${location.hash}` };
                  return (
                    <div key={workItem.slug} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      <WorkCard
                        work={workItem}
                        targetState={targetState}
                        isDimmed={hoveredWorkSlug && hoveredWorkSlug !== workItem.slug}
                        onMouseEnter={() => handleWorkMouseEnter(workItem)}
                        onMouseLeave={handleWorkMouseLeave}
                      />
                    </div>
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
          <ViewToggle view={view} onViewChange={handleViewChange} />
        </div>

        {loading && <p className={styles.stateMessage}>Loading projects…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load projects right now.</p>}

        {!loading && !error && groupedProjects.length === 0 && (
          <p className={styles.stateMessage}>Projects will be added soon.</p>
        )}

        {!loading && !error && groupedProjects.length > 0 && (
          <LayoutGroup>
            <div className={styles.yearList}>
              {groupedProjects.map(({ year, items }) => (
                <RevealAnimation key={year} triggerOnce>
                  <section className={styles.yearSection}>
                    <h3 className={styles.yearHeading}>{year}</h3>
                    <AnimatePresence mode="wait">
                      {view === 'grid' ? (
                        <motion.div
                          key="grid"
                          className={styles.projectGrid}
                          variants={containerVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                        >
                          {items.map((project) => {
                            const targetState = { from: `${location.pathname}${location.search}${location.hash}` };
                            return (
                              <motion.div key={project.slug} variants={itemVariants} layout>
                                <ProjectCard
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
                      ) : (
                        <motion.div
                          key="list"
                          className={styles.projectList}
                          variants={containerVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                        >
                          {items.map((project) => {
                            const targetState = { from: `${location.pathname}${location.search}${location.hash}` };
                            return (
                              <motion.div key={project.slug} variants={itemVariants} layout>
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
                      )}
                    </AnimatePresence>
                  </section>
                </RevealAnimation>
              ))}
            </div>
          </LayoutGroup>
        )}
      </Container>

      <MouseFollowImage imageSrc={hoveredImage} isVisible={!!hoveredImage} />
    </div>
  );
};

export default Work;
