import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';
import CrossSvg from '@/assets/svgs/cross.svg?url';

const CloseIcon = ({ className = '', size = 20, title }) => (
  <SvgIcon src={CrossSvg} className={className} size={size} title={title} />
);

CloseIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

export default CloseIcon;
