import { memo } from 'react';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import styles from './AboutSection.module.css';

const AboutSection = ({ paragraphs, downloads, portraitSrc, portraitAlt = 'Portrait', className = '' }) => (
  <section className={`${styles.section} ${className}`.trim()}>
    <Container className={styles.contactContainer}>
      <div className={styles.copyColumn}>
        <div className={styles.paragraphs}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {downloads.length > 0 ? (
          <div className={styles.buttonRow}>
            {downloads.map(({ label: actionLabel, href, fileName }) => (
              <Button key={actionLabel} label={actionLabel} href={href} download={fileName} icon="download" />
            ))}
          </div>
        ) : null}
      </div>

      <figure className={styles.portrait}>
        <img src={portraitSrc} alt={portraitAlt} loading="lazy" />
      </figure>
    </Container>
  </section>
);

AboutSection.propTypes = {
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
  downloads: [],
  portraitAlt: 'Portrait',
  className: '',
};

export default memo(AboutSection);
