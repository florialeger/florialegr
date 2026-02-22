import { useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import { resolveMediaPath } from '@/utils/media';
import Media from '@/components/ui/Media';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, targetState, isDimmed, onMouseEnter, onMouseLeave }) => {
  const setMagneticNode = useMagneticEffect({ maxDistance: 4, scale: 1.04 });
  const primaryImage = useMemo(() => resolveMediaPath(project.primaryImage?.[0]), [project.primaryImage]);

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
    <div
      ref={assignRef}
      className={styles.projectCard}
      data-slug={project.slug}
      data-dimmed={isDimmed || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link to={`/work/${project.slug}`} state={targetState} className={styles.projectLink}>
        {primaryImage && (
          <div className={styles.imageFrame}>
            <Media src={primaryImage} alt={project.title} className={styles.projectImage} />
          </div>
        )}
        <div className={styles.projectInfo}>
          <h4 className={styles.projectTitle}>{project.title}</h4>
          <p className={styles.projectDescription}>{project.shortDescription}</p>
        </div>
      </Link>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
    primaryImage: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  targetState: PropTypes.object,
  isDimmed: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default ProjectCard;
