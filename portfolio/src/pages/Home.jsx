import { useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import Container from '@/components/ui/Container';
import { LetterIcon } from '@/components/ui/icons';
import InlineIcon from '@/components/ui/InlineIcon';
import RevealAnimation from '@/components/utility/RevealAnimation';
import styles from './Home.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import inlineIconStyles from '@/components/ui/InlineIcon.module.css';

import useMagneticEffect from '@/hooks/useMagneticEffect';

// Calculate age based on birth date (February 9, 2003)
const calculateAge = () => {
  const birthDate = new Date(2003, 1, 9); // Month is 0-indexed (1 = February)
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const EmailMagnet = () => {
  const [copied, setCopied] = useState(false);
  const setMagnet = useMagneticEffect({ maxDistance: 4, easing: 0.18, scale: 1.02 });

  const handleEmailCopy = async () => {
    const email = 'floria.leger@ensc.fr';
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

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
        <LetterIcon className={styles.emailIcon} size={20} title="Adresse e-mail" />
        <p className={styles.emailText}>floria.leger@ensc.fr</p>
        <p className={`${styles.tooltip} ${copied ? styles.tooltipVisible : ''}`}>
          {copied ? 'Copied!' : 'Click to copy'}
        </p>
      </span>
    </div>
  );
};

// Text content is rendered with inline icon wrappers for specific keywords.
const aboutTitle = [<>Hi, I'm Floria.</>];

const aboutParagraphs = [
  <>
    I'm a {calculateAge()}-year-old Master's student in UX Design, Cognitive and Computer Sciences at{' '}
    <a className={inlineIconStyles.dottedLink} href="https://ensc.bordeaux-inp.fr/fr" target="_blank" rel="noreferrer">
      ENSC
    </a>{' '}
    in Bordeaux. I combine psychology, technology, and design to create digital experiences, with{' '}
    <a className={inlineIconStyles.dottedLink} href="https://www.figma.com/" target="_blank" rel="noreferrer">
      Figma
    </a>
    , that are intuitive, beautiful, and user-friendly.
  </>,
  <>
    My curriculum is multi-disciplinary. Beyond design, I work with{' '}
    <a className={inlineIconStyles.dottedLink} href="https://react.dev/" target="_blank" rel="noreferrer">
      React JS
    </a>
    , Node, HTML and CSS3. This technical knowledge allows me to think like a developer during the UX phase, bridging
    the gap between creativity and technical feasibility. I aim to master the entire creative process, combining
    artistic vision with technical skill to bring ideas to life from A to Z.
  </>,
  <>
    Building on professional experience at{' '}
    <a className={styles.dottedLink} href="https://www.airbus.com/en" target="_blank" rel="noreferrer">
      Airbus
    </a>{' '}
    and{' '}
    <a className={styles.dottedLink} href="https://www.ims-bordeaux.fr/" target="_blank" rel="noreferrer">
      IMS
    </a>
    , I am now joining{' '}
    <a className={styles.dottedLink} href="https://www.ubisoft.com/fr-fr" target="_blank" rel="noreferrer">
      Ubisoft
    </a>{' '}
    as a<strong> UX Design Intern</strong>, where I am eager to apply cognitive engineering principles to immersive
    projects. Feel free to connect with me on{' '}
    <a className={styles.dottedLink} href="https://www.linkedin.com/in/floria-leger/" target="_blank" rel="noreferrer">
      LinkedIn.
    </a>
  </>,
];

const Home = () => {
  return (
    <div className={pageLayout.page} style={{ paddingTop: 'calc(var(--layout-page-padding-top) * 2)' }}>
      <HeroSection />

      <section>
        <Container className={`${pageLayout.paragraph} ${styles.paragraph}`.trim()}>
          <RevealAnimation cascade damping={0.05} delay={200} fraction={0.5} triggerOnce>
            {aboutTitle.map((title, index) => (
              <h2 key={index}>{title}</h2>
            ))}

            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <EmailMagnet />
          </RevealAnimation>
        </Container>
      </section>
    </div>
  );
};

export default Home;
