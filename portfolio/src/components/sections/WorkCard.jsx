import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';
import Media from '@/components/ui/Media';
import { resolveMediaPath } from '@/utils/media';
import styles from './WorkCard.module.css';

const formatEndDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? dateString : String(date.getFullYear());
};

const WorkCard = ({ work, isDimmed, onMouseEnter, onMouseLeave, targetState }) => {
  const [setIsHovered] = useState(false);
  const [lastY, setLastY] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });
  const opacity = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const rotateCaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const thumbnail = resolveMediaPath(work.primaryImage?.[0]);
  const displayTitle = work.title || work.company;
  const date = formatEndDate(work.endDate || work.created);
  const company = work.company ? `${work.company} – ` : '';
 // const description = work.description || work.shortDescription;

  return (
    <Link
      to={`/projects/${work.slug}`}
      state={targetState}
      className={styles.workCardLink}
      data-dimmed={isDimmed || undefined}
      onMouseEnter={(event) => {
        setIsHovered(true);
        scale.set(1.1);
        opacity.set(1);
        onMouseEnter?.(event);
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        x.set(offsetX);
        y.set(offsetY);
        rotateCaption.set(-(offsetY - lastY) * 0.6);
        setLastY(offsetY);
      }}
      onMouseLeave={(event) => {
        setIsHovered(false);
        opacity.set(0);
        scale.set(1);
        rotateCaption.set(0);
        onMouseLeave?.(event);
      }}
    >
      <div className={styles.workCard}>
        <div className={styles.header}>
          <p className={styles.title}>
            {displayTitle}
          </p>
        </div>
        {thumbnail && (
          <Media
            src={thumbnail}
            alt={`${displayTitle} thumbnail`}
            className={styles.thumbnail}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 33vw"
          />
        )}
        <p className={styles.meta}>
          {company}
          {date}
        </p>
      </div>
    </Link>
  );
};

WorkCard.propTypes = {
  work: PropTypes.shape({
    company: PropTypes.string,
    role: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    created: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    primaryImage: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string.isRequired,
    companyUrl: PropTypes.string,
  }).isRequired,
  isDimmed: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  targetState: PropTypes.object,
};

export default WorkCard;