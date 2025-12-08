import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';
import GoBackSvg from '@/assets/svgs/Go-back.svg?url';

const GoBackIcon = ({ className = '', size = 12, title }) => (
  <SvgIcon src={GoBackSvg} className={className} size={size} title={title} />
);

GoBackIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

export default GoBackIcon;
