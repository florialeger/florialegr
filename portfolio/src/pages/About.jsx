import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import AboutSection from '@/components/sections/AboutSection';
import portraitImage from '@/assets/images/profil-picture.png';
import resumePdf from '@/assets/pdf/floria-cv.pdf';
import portfolioPdf from '@/assets/pdf/floria-portfolio.pdf';
import artstationIcon from '@/assets/icons/Artstation.png';
import bentoIcon from '@/assets/icons/Bento.png';
import githubIcon from '@/assets/icons/GitHub.png';
import linkedinIcon from '@/assets/icons/Linkedin.png';
import layersIcon from '@/assets/icons/Layers.png';
import styles from './About.module.css';

const aboutParagraphs = [
  "I'm currently a final-year student at ENSC, a cognitive engineering school in Bordeaux, with a strong passion for UI and UX design, particularly in accessibility. My background has provided me with a solid foundation in user-friendly interface design.",
  "I've been drawing for nearly twenty years, drawing inspiration from talented artists to enhance my skills. While I mostly create for myself, I find joy in making art for others. Although my client projects have been informal, they taught me about managing deadlines and handling feedback.",
  "Lately, I've become increasingly interested in web design, believing my drawing skills will be beneficial in this area. I enjoy exploring new design projects independently and particularly love working with CSS and styling web pages. Outside my academic and artistic pursuits, I've played volleyball for nine years, which has instilled the importance of teamwork and pushing personal limits. I also have a keen interest in photography, videography, and animation, which helps me expand my creative horizons.",
];

const downloadLinks = [
  {
    label: 'Download Resume',
    href: resumePdf,
    fileName: 'floria-leger-resume.pdf',
  },
  {
    label: 'Download Portfolio',
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
        paragraphs={aboutParagraphs}
        downloads={downloadLinks}
        portraitSrc={portraitImage}
        portraitAlt="Floria Leger"
      />

      <section className={`${styles.contactSection} reveal-hero ${contactVisible ? 'is-visible' : ''}`}>
        <Container className={styles.contactContainer}>
          <div className={styles.contactRow}>
            <h4 className={styles.contactIntro}>Get in touch</h4>

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
              <h4 className={styles.message} data-visible={!hoveredLabel}>
                at floria.leger@ensc.fr
              </h4>
              <h4 className={styles.message} data-visible={Boolean(hoveredLabel)}>
                {hoveredLabel ? `on ${hoveredLabel}` : ''}
              </h4>
            </span>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;
