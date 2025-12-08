import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, typeLabel, targetState, isDimmed, onMouseEnter, onMouseLeave }) => {
  const setMagneticNode = useMagneticEffect({ maxDistance: 4, scale: 1.04 });

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
      data-dimmed={isDimmed || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link to={`/work/${project.slug}`} state={targetState} className={styles.projectLink}>
        <div className={styles.projectInfo}>
          <div className={styles.titleRow}>
            <div className={styles.projectIcon}>
              {project.icon && <img src={project.icon} alt="" className={styles.iconImage} />}
            </div>
            <p className={styles.projectTitle}>{project.title}</p>
          </div>
          <p className={styles.projectType}>{typeLabel}</p>
        </div>
      </Link>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
  typeLabel: PropTypes.string.isRequired,
  targetState: PropTypes.object,
  isDimmed: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default ProjectCard;
