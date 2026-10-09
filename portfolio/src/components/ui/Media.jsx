import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getMediaDimensions } from '@/utils/media';

const isVideoSrc = (src) => {
  if (!src) return false;
  try {
    const u = src.split('?')[0].toLowerCase();
    return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg');
  } catch {
    return false;
  }
};

const Media = ({
  src,
  alt = '',
  className = '',
  poster,
  loading = 'lazy',
  fetchPriority = 'auto',
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(loading === 'eager');

  useEffect(() => {
    if (!isVideoSrc(src) || loading === 'eager') return undefined;

    // If IntersectionObserver isn't available, load immediately to avoid
    // blocking functionality in older browsers.
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoadVideo(true);
      return undefined;
    }

    const el = containerRef.current;
    if (!el) {
      setShouldLoadVideo(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setShouldLoadVideo(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loading, src]);

  if (!src) return null;
  const dimensions = getMediaDimensions(src);

  if (isVideoSrc(src)) {
    return (
      <div ref={containerRef} aria-hidden={false}>
        {!shouldLoadVideo ? (
          <img
            src={poster || ''}
            alt={alt}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            width={dimensions?.width}
            height={dimensions?.height}
          />
        ) : (
          <video
            ref={videoRef}
            className={className}
            src={src}
            poster={poster}
            loop
            muted
            playsInline
            autoPlay
            controls={false}
            preload={loading === 'eager' ? 'auto' : 'metadata'}
          />
        )}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      width={dimensions?.width}
      height={dimensions?.height}
    />
  );
};

Media.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  poster: PropTypes.string,
  loading: PropTypes.oneOf(['eager', 'lazy']),
  fetchPriority: PropTypes.oneOf(['high', 'low', 'auto']),
};

export default Media;
