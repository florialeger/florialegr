import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';
import ArrowNextSvg from '@/assets/svgs/Arrow next.svg?url';

const ArrowNextIcon = ({ className = '', size = 16, title }) => (
  <SvgIcon src={ArrowNextSvg} className={className} size={size} title={title} />
);

ArrowNextIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

export default ArrowNextIcon;
