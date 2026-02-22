import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import NdaBadge from '@/components/ui/NdaBadge';
import styles from './WorkCard.module.css';

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  // If both dates are the same, show only once
  if (start === end) {
    return start;
  }

  return `${start} - ${end}`;
};

const WorkCard = ({ work, isDimmed, onMouseEnter, onMouseLeave, targetState }) => {
  const [isHovered, setIsHovered] = useState(false);

  const dateRange = formatDateRange(work.startDate, work.endDate);
  const isLocked = work.iconFilename === 'locked-icone.png';
  const iconPath = work.icon;
  const hasCompanyUrl = work.companyUrl !== null && work.companyUrl !== undefined;

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <Link
      to={`/work/${work.slug}`}
      state={targetState}
      className={styles.workCardLink}
      data-dimmed={isDimmed || undefined}
      data-hovered={isHovered || undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={styles.workCard}
        animate={{
          paddingLeft: isHovered ? 'var(--stack-gap-sm)' : 0,
          paddingRight: isHovered ? 'var(--stack-gap-sm)' : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.33, 0.14, 0.27, 1],
        }}
      >
        <div className={styles.workHeader}>
          <div className={styles.companyWrapper}>
            {hasCompanyUrl ? (
              <a
                href={work.companyUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.companyLink}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={styles.company}>{work.company}</h3>
              </a>
            ) : (
              <h3 className={styles.company}>{work.company}</h3>
            )}
            {isLocked && iconPath && <NdaBadge iconSrc={iconPath} isExpanded={isHovered} />}
          </div>
          <p className={styles.date}>{dateRange}</p>
        </div>

        <p className={styles.description}>{work.description}</p>

        <p className={styles.role}>{work.role}</p>
      </motion.div>
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
    companyUrl: PropTypes.string,
  }).isRequired,
  isDimmed: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  targetState: PropTypes.object,
};

export default WorkCard;
