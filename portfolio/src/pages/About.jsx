import { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Container from '@/components/ui/Container';
import AboutSection from '@/components/sections/AboutSection';
import RevealAnimation from '@/components/utility/RevealAnimation';
import resumePdf from '@/assets/pdf/floria-cv.pdf';
import resumefrPdf from '@/assets/pdf/floria-cv-fr.pdf';
import portfolioPdf from '@/assets/pdf/floria-portfolio.pdf';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import { LetterIcon } from '@/components/ui/icons';
import InlineIcon from '@/components/ui/InlineIcon';
import SwipeableStack from '@/components/utility/SwipeableStack';
import styles from './About.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import inlineIconStyles from '@/components/ui/InlineIcon.module.css';

// Calculate age based on birth date (February 9, 2003)
const calculateAge = () => {
  const birthDate = new Date(2003, 1, 9);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Calculate years since 2015 (volleyball start date)
const calculateVolleyballYears = () => {
  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  const years = currentYear - startYear;

  const numberWords = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
  ];
  return years <= 15 ? numberWords[years] : years.toString();
};

const aboutParagraphs = [
  <>
    I'm a {calculateAge()}-year-old Master's graduate in UX Design, Cognitive and Computer Sciences at{' '}
    <a className={inlineIconStyles.dottedLink} href="https://ensc.bordeaux-inp.fr/fr" target="_blank" rel="noreferrer">
      ENSC
    </a>{' '}
    in Bordeaux. I combine psychology, technology, and design to create digital experiences, with{' '}
    <a
      className={inlineIconStyles.dottedLink}
      href="https://www.figma.com/@florialeger"
      target="_blank"
      rel="noreferrer"
    >
      Figma
    </a>
    , that are intuitive, beautiful, and user-friendly.
  </>,

  <>
    Beyond design, I work with React JS, Node JS, HTML, CSS3 and so on. This technical knowledge allows me to think like
    a developer, bridging the gap between creativity and technical feasibility.
  </>,

  <>
    Outside my academic and artistic pursuits, I've played volleyball for {calculateVolleyballYears()} years, which has
    instilled the importance of teamwork and pushing personal limits.
  </>,
];

const downloadLinks = [
  {
    label: 'English Resume',
    href: resumePdf,
    fileName: 'floria-leger-resume.pdf',
  },
  {
    label: 'French Resume',
    href: resumefrPdf,
    fileName: 'floria-leger-resume-fr.pdf',
    variant: 'secondary',
  },
  {
    label: 'Portfolio',
    href: portfolioPdf,
    fileName: 'floria-leger-portfolio.pdf',
  },
];

const contactLinks = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/floria-leger/',
    description: 'professional network',
  },
  {
    key: 'karde',
    label: 'Socials',
    href: 'https://www.karde.me/floria',
    description: 'social profiles',
  },
  {
    key: 'figma',
    label: 'Figma',
    href: 'https://www.figma.com/@florialeger',
    description: 'design resources',
  },
];

const About = () => {
  const [copied, setCopied] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [lastY, setLastY] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2,
  };

  const scale = useSpring(1, springValues);
  const opacity = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const handleEmailCopy = async () => {
    const email = 'floria.leger@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const EmailMagnet = () => {
    const setMagnet = useMagneticEffect({ maxDistance: 4, easing: 0.18, scale: 1.02 });
    return (
      <div className={styles.emailRow}>
        <p className={styles.emailText}>Get in touch at</p>

        <span
          ref={setMagnet}
          className={`${styles.magnet} ${styles.magnetIcon} ${styles.clickable} ${styles.tooltipContainer}`}
          onClick={handleEmailCopy}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEmailCopy();
            }
          }}
          aria-label="Click to copy email address"
        >
          <LetterIcon className={styles.emailIcon} size={32} title="Adresse e-mail" />
          <p className={styles.emailText}>floria.leger@gmail.com</p>
          <p className={`${styles.tooltip} ${copied ? styles.tooltipVisible : ''}`}>
            {copied ? 'Copied!' : 'Click to copy'}
          </p>
        </span>
      </div>
    );
  };

  return (
    <div className={pageLayout.page}>
      <AboutSection
        paragraphs={aboutParagraphs}
        downloads={downloadLinks}
      />

      <section className={pageLayout.container} style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className={styles.contactContainer}>
          <RevealAnimation cascade damping={0.08} triggerOnce>
            <p className={styles.contactParagraph}>
              <EmailMagnet />
            </p>

            <ul className={styles.socialList}>
              {contactLinks.map((link) => (
                <li
                  key={link.label}
                  className={styles.socialItem}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left;
                    const offsetY = e.clientY - rect.top;

                    x.set(offsetX);
                    y.set(offsetY);

                    const velocityY = offsetY - lastY;
                    rotateFigcaption.set(-velocityY * 0.6);
                    setLastY(offsetY);
                  }}
                  onMouseEnter={() => {
                    setHoveredLink(link.key);
                    scale.set(1.1);
                    opacity.set(1);
                  }}
                  onMouseLeave={() => {
                    setHoveredLink(null);
                    opacity.set(0);
                    scale.set(1);
                    rotateFigcaption.set(0);
                  }}
                >
                  <a href={link.href} target="_blank" rel="noreferrer" className={styles.linkLabel}>
                    {link.label}
                  </a>
                  {hoveredLink === link.key && (
                    <motion.span className={styles.followCaption} style={{ x, y, opacity, rotate: rotateFigcaption }}>
                      {link.description}
                    </motion.span>
                  )}
                </li>
              ))}
            </ul>
          </RevealAnimation>
        </div>
      </section>


    </div>
  );
};

export default About;
