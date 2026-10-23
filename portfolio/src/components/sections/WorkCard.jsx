import { Link } from 'react-router-dom';
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
  const thumbnail = resolveMediaPath(work.primaryImage?.[0]);

  return (
    <Link
      to={`/work/${work.slug}`}
      state={targetState}
      className={styles.workCardLink}
      data-dimmed={isDimmed || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave} 
    >
      <div className={styles.workCard}>
        <div className={styles.header}>
        <p className={styles.title}>{work.role}</p>
        <p className={styles.meta}>
          {work.company} <span aria-hidden="true">–</span> {formatEndDate(work.endDate)}
          </p>
        </div>
        {thumbnail && <Media src={thumbnail} alt={`${work.role} at ${work.company}`} className={styles.thumbnail} />}
      </div>
    </Link>
  );
};

WorkCard.propTypes = {
  work: PropTypes.shape({
    company: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    description: PropTypes.string,
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
