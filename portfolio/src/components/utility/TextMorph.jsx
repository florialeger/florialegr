import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

export const TextMorph = ({ children, className = '' }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={children}
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(4px)' }}
        transition={{
          duration: 0.2,
          ease: [0.33, 0.14, 0.27, 1],
        }}
        className={className}
        style={{ display: 'inline-block' }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
};

TextMorph.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default TextMorph;
