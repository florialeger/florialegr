import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';
import DownloadSvg from '@/assets/svgs/Download.svg?url';

const DownloadIcon = ({ className = '', size = 16, title }) => (
  <SvgIcon src={DownloadSvg} className={className} size={size} title={title} />
);

DownloadIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

export default DownloadIcon;
