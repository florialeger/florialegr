import { memo } from 'react';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import RevealAnimation from '@/components/utility/RevealAnimation';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import Link from '@/components/ui/Link';
import CD from '@/assets/icons/CD.png';
import styles from './AboutSection.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';

const AboutSection = ({ title = [], paragraphs, downloads, portraitSrc, portraitAlt = 'Portrait' }) => (
  <Container className={pageLayout.pageHeader}>
    <RevealAnimation cascade damping={0.1} delay={100} triggerOnce>
      <div className={styles.header} ref={useMagneticEffect({ maxDistance: 4, scale: 1.03 })}>
        <figure className={styles.portrait}>
          <img src={portraitSrc} alt={portraitAlt} loading="lazy" />
        </figure>
        <div className={styles.headerContent}>
          <div className={styles.pseudo}>
            <a href="https://www.instagram.com/floria.leger/" target="_blank" rel="noreferrer">
              <p>@florialeger</p>
            </a>
            <img src={CD} className={styles.cdIcon} alt="CD Icon" />
          </div>
          <p
            style={{
              color: 'var(--label---tertiary)',
            }}
          >
            UX Designer
          </p>
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
            <Link key={actionLabel} label={actionLabel} href={href} download={fileName} icon="download" />
          ))}
        </div>
      ) : null}
    </RevealAnimation>
  </Container>
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
};

AboutSection.defaultProps = {
  title: [],
  downloads: [],
  portraitAlt: 'Portrait',
};

export default memo(AboutSection);
