import React from 'react';
import PropTypes from 'prop-types';

// Lightweight media component that renders either an <img> or a <video>
// depending on the source extension or explicit `type` prop.
const isVideoSrc = (src) => {
  if (!src) return false;
  try {
    const u = src.split('?')[0].toLowerCase();
    return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg');
  } catch {
    return false;
  }
};

const Media = ({ src, alt = '', className = '', poster }) => {
  if (!src) return null;

  if (isVideoSrc(src)) {
    return (
      <video
        className={className}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        autoPlay
        controls={false}
        preload="metadata"
      />
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" />;
};

Media.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  poster: PropTypes.string,
};

export default Media;
