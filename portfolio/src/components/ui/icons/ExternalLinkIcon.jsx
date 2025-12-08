import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';
import ExternalLinkSvg from '@/assets/svgs/External-link.svg?url';

const ExternalLinkIcon = ({ className = '', size = 16, title }) => (
  <SvgIcon src={ExternalLinkSvg} className={className} size={size} title={title} />
);

ExternalLinkIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

export default ExternalLinkIcon;
