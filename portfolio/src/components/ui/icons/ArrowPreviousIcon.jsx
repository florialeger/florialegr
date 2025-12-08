import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';
import ArrowPreviousSvg from '@/assets/svgs/Arrow previous.svg?url';

const ArrowPreviousIcon = ({ className = '', size = 16, title }) => (
  <SvgIcon src={ArrowPreviousSvg} className={className} size={size} title={title} />
);

ArrowPreviousIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

export default ArrowPreviousIcon;
