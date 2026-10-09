import { memo } from 'react';
import RevealAnimation from '@/components/utility/RevealAnimation';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import Link from '@/components/ui/Link';
import styles from './AboutSection.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';

const AboutSection = ({ title = [], paragraphs, downloads }) => (
  <Container className={pageLayout.pageHeader}>
    <RevealAnimation cascade damping={0.1} delay={100} triggerOnce>
      {title.map((t) => (
        <h2 key={t}>{t}</h2>
      ))}

      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {downloads.length > 0 ? (
        <div className={styles.buttonColumn}>
          {downloads.map(({ label: actionLabel, href, fileName, variant }) => (
            <Link
              key={actionLabel}
              label={actionLabel}
              href={href}
              download={fileName}
              icon="download"
              variant={variant}
            />
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
      variant: PropTypes.string,
    })
  ),
};

AboutSection.defaultProps = {
  title: [],
  downloads: [],
};

export default memo(AboutSection);
