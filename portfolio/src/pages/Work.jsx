import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { ArrowIcon, LockIcon } from '@/components/ui/icons';
import { usePortfolio } from '@/contexts/PortfolioContext';
import useMagneticEffect from '@/hooks/useMagneticEffect';
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

const isProjectLocked = (project) => {
  if (!project) return true;
  if (typeof project.isLocked !== 'undefined') {
    return Boolean(project.isLocked);
  }
  if (typeof project.locked !== 'undefined') {
    if (typeof project.locked === 'string') {
      const normalized = project.locked.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return Boolean(project.locked);
  }
  if (!project.link) return true;
  if (Array.isArray(project.link)) {
    return project.link.length === 0 || project.link.every((entry) => !entry || !entry.url);
  }
  if (typeof project.link === 'string') {
    return project.link.trim().length === 0;
  }
  return true;
};

const extractYear = (value) => {
  if (!value) return 'Upcoming';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Upcoming';
  return String(date.getFullYear());
};

const ProjectListItem = ({ project, typeLabel, locked, targetState }) => {
  const setMagneticNode = useMagneticEffect({ maxDistance: locked ? 8 : 14, scale: locked ? 1.015 : 1.04 });

  const assignRef = useCallback(
    (node) => {
      setMagneticNode(node);
    },
    [setMagneticNode]
  );

  useEffect(
    () => () => {
      setMagneticNode(null);
    },
    [setMagneticNode]
  );

  return (
    <Link to={`/work/${project.slug}`} state={targetState} className={styles.projectLink}>
      <li className={styles.projectItem} ref={assignRef} data-locked={locked || undefined}>
        <span className={styles.projectType}>{typeLabel}</span>
        {locked ? (
          <span className={`${styles.projectTitle} ${styles.locked}`.trim()}>
            {project.title}
            <LockIcon size={18} />
          </span>
        ) : (
          <span to={`/work/${project.slug}`} state={targetState} className={styles.projectLink}>
            <span>{project.title}</span>
            <ArrowIcon size={18} />
          </span>
        )}
      </li>
    </Link>
  );
};

const Work = () => {
  const { projects, loading, error } = usePortfolio();
  const location = useLocation();

  const groupedProjects = useMemo(() => {
    if (!projects?.length) return [];
    const groups = projects.reduce((acc, project) => {
      const year = extractYear(project.created);
      if (!acc[year]) acc[year] = [];
      acc[year].push(project);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([year, items]) => ({
        year,
        items: items.slice().sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0)),
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

  const [headerVisible, setHeaderVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setHeaderVisible(true);
      setListVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={styles.workPage}>
      <Container className={`${styles.pageHeader} reveal-hero ${headerVisible ? 'is-visible' : ''}`}>
        <h3>Recent projects</h3>
      </Container>

      <Container className={`${styles.listContainer} reveal-hero ${listVisible ? 'is-visible' : ''}`}>
        {loading && <p className={styles.stateMessage}>Loading projects…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load projects right now.</p>}

        {!loading && !error && groupedProjects.length === 0 && (
          <p className={styles.stateMessage}>Projects will be added soon.</p>
        )}

        {!loading && !error && groupedProjects.length > 0 && (
          <div className={styles.yearList}>
            {groupedProjects.map(({ year, items }) => (
              <section key={year} className={styles.yearSection}>
                <h3>{year}</h3>
                <ul className={styles.projectList}>
                  {items.map((project) => {
                    const typeLabel = normalizeDuty(project.projectDuty);
                    const locked = isProjectLocked(project);
                    const targetState = { from: `${location.pathname}${location.search}${location.hash}` };

                    return (
                      <ProjectListItem
                        key={project.slug}
                        project={project}
                        typeLabel={typeLabel}
                        locked={locked}
                        targetState={targetState}
                      />
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Work;
