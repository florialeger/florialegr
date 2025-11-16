import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import AboutSection from '@/components/sections/AboutSection';
import portraitImage from '@/assets/images/profil-picture.png';
import resumePdf from '@/assets/pdf/floria-cv.pdf';
import resumefrPdf from '@/assets/pdf/floria-cv-fr.pdf';
import portfolioPdf from '@/assets/pdf/floria-portfolio.pdf';
import artstationIcon from '@/assets/icons/Artstation.png';
import bentoIcon from '@/assets/icons/Bento.png';
import githubIcon from '@/assets/icons/GitHub.png';
import linkedinIcon from '@/assets/icons/Linkedin.png';
import layersIcon from '@/assets/icons/Layers.png';
import figmaIcon from '@/assets/icons/Figma.png';
import procreateIcon from '@/assets/icons/Procreate.png';
import vscodeIcon from '@/assets/icons/Visual Studio.png';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import InlineIcon from '@/components/ui/InlineIcon';
import styles from './About.module.css';
import inlineIconStyles from '@/components/ui/InlineIcon.module.css';

const aboutTitle = [
  "I'm currently a final-year student at ENSC, a cognitive engineering school in Bordeaux, with a strong passion for UI and UX design, particularly in accessibility.",
];

const aboutParagraphs = [
  <>
    My background has provided me with a solid foundation in user-friendly interface design. I've been{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="draw" size="text" />
      <span className={inlineIconStyles.emphasized}>drawing </span>
    </span>
    for nearly twenty years, drawing inspiration from talented artists to enhance my skills. While I mostly create for
    myself, I find joy in making art for others. Although my client projects have been informal, they taught me about
    managing deadlines and handling feedback.
  </>,
  <>
    Lately, I've become increasingly interested in web design, believing my drawing skills will be beneficial in this
    area. I enjoy exploring new design projects independently and particularly love working with CSS and styling web
    pages. Outside my academic and artistic pursuits, I've played{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="volley" size="text" />
      <span className={inlineIconStyles.emphasized}>volleyball</span>
    </span>
    for nine years, which has instilled the importance of teamwork and pushing personal limits. I also have a keen
    interest in photography, videography, and animation, which helps me expand my creative horizons.
  </>,
];

const downloadLinks = [
  {
    label: 'Resume',
    href: resumePdf,
    fileName: 'floria-leger-resume.pdf',
  },
  {
    label: 'French Resume',
    href: resumefrPdf,
    fileName: 'floria-leger-resume-fr.pdf',
  },
  {
    label: 'Portfolio',
    href: portfolioPdf,
    fileName: 'floria-leger-portfolio.pdf',
  },
];

const contactLinks = [
  {
    label: 'Bento',
    href: 'https://bento.me/floria',
    src: bentoIcon,
  },
  {
    label: 'ArtStation',
    href: 'https://florialeger.artstation.com/',
    src: artstationIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/floria-leger/',
    src: linkedinIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/florialeger',
    src: githubIcon,
  },
  {
    label: 'Layers',
    href: 'https://layers.to/florialeger',
    src: layersIcon,
  },
];

const About = () => {
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const handleIconEnter = (label) => {
    setHoveredLabel(label);
  };

  const handleIconLeave = () => {
    setHoveredLabel(null);
  };

  const [aboutVisible, setAboutVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const setFigmaMagnet = useMagneticEffect({ maxDistance: 20, scale: 1.06 });
  const setVSCodeMagnet = useMagneticEffect({ maxDistance: 18, scale: 1.04 });
  const setProcreateMagnet = useMagneticEffect({ maxDistance: 20, scale: 1.06 });

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setAboutVisible(true);
      setContactVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={styles.aboutPage}>
      <AboutSection
        className={`reveal-hero ${aboutVisible ? 'is-visible' : ''}`}
        title={aboutTitle}
        paragraphs={aboutParagraphs}
        downloads={downloadLinks}
        portraitSrc={portraitImage}
        portraitAlt="Floria Leger"
      />

      <section className={`reveal-hero ${contactVisible ? 'is-visible' : ''} ${styles.softwareSection}`}>
        <Container className={styles.softwareContainer}>
          <div className={styles.softwareInner}>
            <h2 className={styles.softwareTitle}>The software i’m using</h2>

            <ul className={styles.softwareList}>
              <li className={styles.softwareItem} ref={setFigmaMagnet}>
                <button type="button" className={styles.softwareButton} aria-label="Figma">
                  <span className={styles.softwareIcon}>
                    <img src={figmaIcon} alt="Figma" className={styles.softwareImg} />
                  </span>
                  <h4 className={styles.softwareLabel}>Figma</h4>
                </button>
              </li>

              <li className={styles.softwareItem} ref={setVSCodeMagnet}>
                <button type="button" className={styles.softwareButton} aria-label="VS Code">
                  <span className={styles.softwareIcon}>
                    <img src={vscodeIcon} alt="VS Code" className={styles.softwareImg} />
                  </span>
                  <h4 className={styles.softwareLabel}>VS Code</h4>
                </button>
              </li>

              <li className={styles.softwareItem} ref={setProcreateMagnet}>
                <button type="button" className={styles.softwareButton} aria-label="Procreate">
                  <span className={styles.softwareIcon}>
                    <img src={procreateIcon} alt="Procreate" className={styles.softwareImg} />
                  </span>
                  <h4 className={styles.softwareLabel}>Procreate</h4>
                </button>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className={`${styles.contactSection} reveal-hero ${contactVisible ? 'is-visible' : ''}`}>
        <Container className={styles.contactContainer}>
          <div className={styles.contactRow}>
            <h2 className={styles.contactIntro}>Get in touch</h2>

            <ul className={styles.iconList} data-hovered={hoveredLabel ? 'true' : 'false'}>
              {contactLinks.map((link) => {
                const isActive = hoveredLabel === link.label;
                return (
                  <li key={link.label} className={styles.iconItem} data-active={isActive}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.iconLink}
                      onMouseEnter={() => handleIconEnter(link.label)}
                      onFocus={() => handleIconEnter(link.label)}
                      onMouseLeave={handleIconLeave}
                      onBlur={handleIconLeave}
                      aria-label={link.label}
                    >
                      <img src={link.src} alt="" className={styles.socialIconImage} />
                      <span className={styles.srOnly}>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <span className={styles.contactMessage} aria-live="polite">
              <h2 className={styles.message} data-visible={!hoveredLabel}>
                at floria.leger@ensc.fr
              </h2>
              <h2 className={styles.message} data-visible={Boolean(hoveredLabel)}>
                {hoveredLabel ? `on ${hoveredLabel}` : ''}
              </h2>
            </span>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;
