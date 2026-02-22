import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import styles from './ProjectListItem.module.css';

const ProjectListItem = ({ project, targetState, isDimmed, onMouseEnter, onMouseLeave }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconName = project.icon?.replace('.png', '').replace('-icone', '');

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
      to={`/work/${project.slug}`}
      state={targetState}
      className={styles.listItemLink}
      data-slug={project.slug}
      data-dimmed={isDimmed || undefined}
      data-hovered={isHovered || undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={styles.listItem}
        animate={{
          paddingLeft: isHovered ? 'var(--stack-gap-sm)' : 0,
          paddingRight: isHovered ? 'var(--stack-gap-sm)' : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.33, 0.14, 0.27, 1],
        }}
      >
        <span className={styles.bullet}></span>
        <div className={styles.iconFrame}>
          <Icon name={iconName} className={styles.icon} />
        </div>
        <p className={styles.content}>
          <span className={styles.title}>{project.title}</span>
          {'  —  '}
          <span className={styles.description}>{project.shortDescription}</span>
        </p>
      </motion.div>
    </Link>
  );
};

ProjectListItem.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  targetState: PropTypes.object,
  isDimmed: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default ProjectListItem;
