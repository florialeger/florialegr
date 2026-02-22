import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import styles from './ViewToggle.module.css';

const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className={styles.viewToggle}>
      <Button
        label="List View"
        icon="list"
        iconPosition="left"
        onClick={() => onViewChange('list')}
        variant={view === 'list' ? 'primary' : 'inactive'}
        size="small"
        magnetic={view !== 'list'}
        magneticOptions={{ maxDistance: 6, scale: 1.02 }}
        aria-label="List view"
        aria-pressed={view === 'list'}
      />
      <Button
        label="Card View"
        icon="card"
        iconPosition="left"
        onClick={() => onViewChange('grid')}
        variant={view === 'grid' ? 'primary' : 'inactive'}
        size="small"
        magnetic={view !== 'grid'}
        magneticOptions={{ maxDistance: 6, scale: 1.02 }}
        aria-label="Card view"
        aria-pressed={view === 'grid'}
      />
    </div>
  );
};

ViewToggle.propTypes = {
  view: PropTypes.oneOf(['grid', 'list']).isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default ViewToggle;
