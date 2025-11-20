import { memo } from 'react';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import CD from '@/assets/icons/CD.png';
import styles from './AboutSection.module.css';

const AboutSection = ({ title = [], paragraphs, downloads, portraitSrc, portraitAlt = 'Portrait', className = '' }) => (
  <section className={`${styles.section} ${className}`.trim()}>
    <Container className={styles.contactContainer}>
      <div className={styles.header} ref={useMagneticEffect({ maxDistance:24, scale: 1.05 })}>
        <figure className={styles.portrait}>
          <img src={portraitSrc} alt={portraitAlt} loading="lazy" />
        </figure>
        <div className={styles.headerContent}>
          <div className={styles.pseudo}>
            <p>@florialeger</p>
            <img src={CD} className={styles.cdIcon} alt="CD Icon" />
          </div>
          <p style={{ color: 'var(--label---tertiary)' }}>9h41</p>
        </div>
      </div>

      {title.map((t) => (
        <h2 key={t}>{t}</h2>
      ))}

      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {downloads.length > 0 ? (
        <div className={styles.buttonColumn}>
          {downloads.map(({ label: actionLabel, href, fileName }) => (
            <Button key={actionLabel} label={actionLabel} href={href} download={fileName} icon="download" />
          ))}
        </div>
      ) : null}
    </Container>
  </section>
);

AboutSection.propTypes = {
  title: PropTypes.arrayOf(PropTypes.string),
  paragraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
  downloads: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      fileName: PropTypes.string,
    })
  ),
  portraitSrc: PropTypes.string.isRequired,
  portraitAlt: PropTypes.string,
  className: PropTypes.string,
};

AboutSection.defaultProps = {
  title: [],
  downloads: [],
  portraitAlt: 'Portrait',
  className: '',
};

export default memo(AboutSection);
