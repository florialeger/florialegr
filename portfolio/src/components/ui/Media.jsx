import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getMediaDimensions, getMediaSources } from '@/utils/media';

const responsiveWidths = [480, 768, 1200, 1600];

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
  sizes = '100vw',
  onLoad,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(loading === 'eager');
  const [sources, setSources] = useState(null);

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

  useEffect(() => {
    if (!src || isVideoSrc(src)) return undefined;

    let cancelled = false;
    setSources(null);
    getMediaSources(src)
      .then((nextSources) => {
        if (!cancelled) setSources(nextSources);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(`Unable to load media source: ${src}`, error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

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
            sizes={sizes}
            width={dimensions?.width}
            height={dimensions?.height}
            onLoad={onLoad}
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

  if (!sources) {
    return (
      <div
        className={className}
        aria-hidden="true"
        style={{
          aspectRatio:
            dimensions?.width && dimensions?.height ? `${dimensions.width} / ${dimensions.height}` : undefined,
        }}
      />
    );
  }

  const createSrcSet = (variants) =>
    variants.length > 1
      ? variants.map((variant, index) => `${variant} ${responsiveWidths[index] || responsiveWidths.at(-1)}w`).join(', ')
      : variants[0];
  const image = (
    <img
      className={className}
      src={sources.fallback}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      sizes={sizes}
      srcSet={sources.webp.length > 0 ? createSrcSet(sources.webp) : undefined}
      width={dimensions?.width}
      height={dimensions?.height}
      onLoad={onLoad}
    />
  );

  if (sources.avif.length === 0) return image;

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={createSrcSet(sources.avif)}
        sizes={sizes}
      />
      {sources.webp.length > 0 && (
        <source
          type="image/webp"
          srcSet={createSrcSet(sources.webp)}
          sizes={sizes}
        />
      )}
      {image}
    </picture>
  );
};

Media.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  poster: PropTypes.string,
  loading: PropTypes.oneOf(['eager', 'lazy']),
  fetchPriority: PropTypes.oneOf(['high', 'low', 'auto']),
  sizes: PropTypes.string,
  onLoad: PropTypes.func,
};

export default Media;
