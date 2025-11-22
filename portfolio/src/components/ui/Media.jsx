import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

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
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (!isVideoSrc(src)) return undefined;

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
  }, [src]);

  if (!src) return null;

  if (isVideoSrc(src)) {
    // Render a lightweight poster or placeholder until the video should load.
    return (
      <div ref={containerRef} className={className} aria-hidden={false}>
        {!shouldLoadVideo ? (
          // Poster fallback: use provided `poster` or show an empty image tag
          // (keeps layout stable). Keep it `loading="lazy"` so it's cheap.
          <img src={poster || ''} alt={alt} loading="lazy" decoding="async" />
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
            preload="metadata"
          />
        )}
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" fetchPriority="low" />;
};

Media.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  poster: PropTypes.string,
};

export default Media;
