import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from './NdaBadge.module.css';

const NdaBadge = ({ iconSrc, className = '', isExpanded = false }) => {
  return (
    <motion.div
      className={`${styles.ndaBadge} ${className}`.trim()}
      initial={false}
      animate={{
        width: isExpanded ? 'auto' : '2rem',
        paddingRight: isExpanded ? '0.8rem' : '0.4rem',
      }}
      transition={{
        duration: 0.05,
        ease: 'linear',
      }}
    >
      <div className={styles.content}>
        <img src={iconSrc} alt="Locked" className={styles.lockIcon} />
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              className={styles.text}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{
                duration: 0.15,
                ease: 'linear',
              }}
            >
              under NDA
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

NdaBadge.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  isExpanded: PropTypes.bool,
};

export default NdaBadge;
