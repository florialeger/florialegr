import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '@/components/ui/Container';
import RevealAnimation from '@/components/utility/RevealAnimation';
import MouseFollowImage from '@/components/utility/MouseFollowImage';
import WorkCard from '@/components/sections/WorkCard';
import ProjectCard from '@/components/sections/ProjectCard';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { getImagePath } from '@/utils/getImagePath';
import styles from './Work.module.css';

const normalizeDuty = (duty) => {
  if (!duty) return 'Design';
  if (Array.isArray(duty)) return duty[0];
  if (typeof duty === 'string') {
    const parts = duty.split(',');
    return parts[0].trim();
  }
  return 'Design';
};

const extractYear = (value) => {
  if (!value) return 'Upcoming';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Upcoming';
  return String(date.getFullYear());
};

const Work = () => {
  const { projects, work, loading, error } = usePortfolio();
  const location = useLocation();
  const [hoveredWorkSlug, setHoveredWorkSlug] = useState(null);
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  // Filter out work items from projects (Purely, VMT, Tuto Figma)
  const workSlugs = useMemo(() => new Set(['purely', 'vmt', 'tuto-figma']), []);

  const actualProjects = useMemo(() => {
    return projects.filter((project) => !workSlugs.has(project.slug));
  }, [projects, workSlugs]);

  const groupedProjects = useMemo(() => {
    if (!actualProjects?.length) return [];
    const groups = actualProjects.reduce((acc, project) => {
      const year = extractYear(project.created);
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
          // Then sort by date (newest first)
          return new Date(b.created || 0) - new Date(a.created || 0);
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
  }, [actualProjects]);

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

  const handleWorkMouseEnter = (item) => {
    setHoveredWorkSlug(item.slug);
    const primaryImagePath = item.primaryImage?.[0] ? getImagePath(item.primaryImage[0]) : null;
    if (primaryImagePath) {
      setHoveredImage(primaryImagePath);
    }
  };

  const handleWorkMouseLeave = () => {
    setHoveredWorkSlug(null);
    setHoveredImage(null);
  };

  const handleProjectMouseEnter = (item) => {
    setHoveredProjectSlug(item.slug);
    const primaryImagePath = item.primaryImage?.[0] ? getImagePath(item.primaryImage[0]) : null;
    if (primaryImagePath) {
      setHoveredImage(primaryImagePath);
    }
  };

  const handleProjectMouseLeave = () => {
    setHoveredProjectSlug(null);
    setHoveredImage(null);
  };

  return (
    <div className={styles.workPage}>
      {/* Recent gigs section */}
      {work && work.length > 0 && (
        <Container className={styles.workContainer}>
          <RevealAnimation triggerOnce>
            <h2>Recent gigs</h2>
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
        <RevealAnimation triggerOnce>
          <h2>Some of my projects</h2>
        </RevealAnimation>

        {loading && <p className={styles.stateMessage}>Loading projects…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load projects right now.</p>}

        {!loading && !error && groupedProjects.length === 0 && (
          <p className={styles.stateMessage}>Projects will be added soon.</p>
        )}

        {!loading && !error && groupedProjects.length > 0 && (
          <div className={styles.yearList}>
            {groupedProjects.map(({ year, items }) => (
              <RevealAnimation key={year} triggerOnce>
                <section className={styles.yearSection}>
                  <h3 className={styles.yearHeading}>{year}</h3>
                  <div className={styles.projectGrid}>
                    {items.map((project) => {
                      const typeLabel = normalizeDuty(project.projectDuty);
                      const targetState = { from: `${location.pathname}${location.search}${location.hash}` };

                      return (
                        <ProjectCard
                          key={project.slug}
                          project={project}
                          typeLabel={typeLabel}
                          targetState={targetState}
                          isDimmed={hoveredProjectSlug && hoveredProjectSlug !== project.slug}
                          onMouseEnter={() => handleProjectMouseEnter(project)}
                          onMouseLeave={handleProjectMouseLeave}
                        />
                      );
                    })}
                  </div>
                </section>
              </RevealAnimation>
            ))}
          </div>
        )}
      </Container>

      <MouseFollowImage imageSrc={hoveredImage} isVisible={!!hoveredImage} />
    </div>
  );
};

export default Work;
