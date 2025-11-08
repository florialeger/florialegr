// src/components/sections/ProjectsSection.js
import { memo } from 'react';
import PropTypes from 'prop-types';
import useFetch from '@/hooks/useFetch';
import Container from '@/components/ui/Container';
import ProjectCard from '@/components/projects/ProjectCard';
import CardGrid from '@/components/projects/CardGrid';
import styles from './ProjectsSection.module.css';

const ProjectsSection = ({ className = '' }) => {
  const { data: projects, loading, error } = useFetch('/api/projects');
  const combinedClassName = [styles.projectsSection, className].filter(Boolean).join(' ');

  return (
    <section id="work" className={combinedClassName}>
      <Container>
        <h2 className={styles.heading}>My Work</h2>
        {loading && (
          <p className={styles.statusMessage} role="status" aria-live="polite">
            Loading projects…
          </p>
        )}
        {error && <div className={styles.error}>{error.message}</div>}
        {!loading && !error && projects && projects.length > 0 && (
          <CardGrid>
            {projects.map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} />
            ))}
          </CardGrid>
        )}
        {!loading && !error && (!projects || projects.length === 0) && (
          <p className={styles.emptyState}>No projects available right now.</p>
        )}
      </Container>
    </section>
  );
};
ProjectsSection.propTypes = {
  className: PropTypes.string,
};
export default memo(ProjectsSection);
