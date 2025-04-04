// src/components/sections/ProjectsSection.js
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useFetch from '@/hooks/useFetch';
import Container from '@/components/ui/Container';
import ProjectCard from '@/components/projects/ProjectCard';
import LoadingSpinner from '@/components/loaders/LoadingSpinner'; // Import the spinner
import CardGrid from '@/components/ui/CardGrid';
import styles from './ProjectsSection.module.css';

const ProjectsSection = ({ className = '' }) => {
  // ... (rest of the component setup) ...
  const { data: projects, loading, error } = useFetch('/api/projects');

  return (
    <section id="work" className={combinedClassName}>
      <Container>
        <h2 className={styles.heading}>My Work</h2>
        {/* Use LoadingSpinner when loading */}
        {loading && (
          <LoadingSpinner size="inline" message="Loading projects..." />
        )}{' '}
        {/* Or 'fullscreen' if preferred */}
        {error && (
          <div className={styles.error}>{/* ... error message ... */}</div>
        )}
        {!loading && !error && projects && projects.length > 0 && (
          <CardGrid>
            {projects.map((project) => (
              <ProjectCard
                key={project._id || project.slug}
                project={project}
              />
            ))}
          </CardGrid>
        )}
        {/* ... no projects message ... */}
      </Container>
    </section>
  );
};
// ... propTypes ...
export default memo(ProjectsSection);

/* --- ProjectsSection.module.css (Example) ---
.projectsSection {
  padding: var(--section-padding-y, 4rem) 0;
  background-color: var(--section-bg-alt, #f9f9f9);
}

.heading {
  font-size: var(--font-size-xl, 2rem);
  margin-bottom: 2.5rem;
  color: var(--heading-color);
  text-align: center;
}

.error {
   text-align: center;
   color: var(--error-color, red);
   background-color: var(--error-bg-color, #ffebee);
   padding: 1rem;
   border-radius: var(--border-radius-medium);
   border: 1px solid var(--error-border-color, #f44336);
}
 .error p { margin: 0.25rem 0; }
 .error em { font-size: 0.9em; opacity: 0.8; }

.noProjects {
   text-align: center;
   color: var(--text-secondary-color);
   font-style: italic;
}
*/
