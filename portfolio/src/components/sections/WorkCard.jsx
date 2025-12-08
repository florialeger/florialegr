import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './WorkCard.module.css';

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const WorkCard = ({ work, isDimmed, onMouseEnter, onMouseLeave, targetState }) => {
  const setMagneticNode = useMagneticEffect({ maxDistance: 4, scale: 1.01 });

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

  const dateRange = `${formatDate(work.startDate)} - ${formatDate(work.endDate)}`;
  const isLocked = work.iconFilename === 'locked-icone.png';
  const iconPath = work.icon; // Already resolved in context

  return (
    <Link
      to={`/work/${work.slug}`}
      state={targetState}
      ref={assignRef}
      className={styles.workCard}
      data-dimmed={isDimmed || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.workHeader}>
        <div className={styles.companyWrapper}>
          <h3 className={styles.company}>{work.company}</h3>
          {isLocked && iconPath && <img src={iconPath} alt="Locked" className={styles.lockIcon} />}
        </div>
        <p className={styles.date}>{dateRange}</p>
      </div>
      <p className={styles.description}>{work.description}</p>
      <p className={styles.role}>{work.role}</p>
    </Link>
  );
};

WorkCard.propTypes = {
  work: PropTypes.shape({
    company: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    icon: PropTypes.string,
    iconFilename: PropTypes.string,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  isDimmed: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  targetState: PropTypes.object,
};

export default WorkCard;
