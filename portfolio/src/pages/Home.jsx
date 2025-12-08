import { useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import Container from '@/components/ui/Container';
import { MailIcon } from '@/components/ui/icons';
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
      setTimeout(() => setCopied(false), 1200);
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
        <MailIcon className={styles.emailIcon} size={20} title="Adresse e-mail" />
        <p className={styles.emailText}>floria.leger@ensc.fr</p>
        <p className={`${styles.tooltip} ${copied ? styles.tooltipVisible : ''}`}>
          {copied ? 'Copied!' : 'Click to copy'}
        </p>
      </span>
    </div>
  );
};

// Text content is rendered with inline icon wrappers for specific keywords.
const aboutTitle = [
  <>
    Hi, I'm Floria, a final-year Master's student in UIX Design, Cognitive and Computer Sciences with a passion for
    creating intuitive, user-friendly digital experiences.
  </>,
];

const aboutParagraphs = [
  <>
    I'm {calculateAge()} and live near Bordeaux, France. I'm in my second year at the Ecole Nationale Supérieure de
    Cognitique where I'm exploring mental processes and human interactions, a fascinating field that combines
    psychology, technology and design. As a future UX/UI designer and cognitive engineer, I strive to develop my skills,
    using design tools like{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="figma" size="text" />
      <span className={inlineIconStyles.emphasized}>Figma,</span>
    </span>
    to create interfaces that are both visually appealing and user-friendly.
  </>,
  <>
    My school's multi-disciplinary curriculum also gives me the opportunity to explore web development technologies, in
    particular{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="react js" size="text" />
      <span className={inlineIconStyles.emphasized}>React JS</span>
    </span>
    with its Vite framework, Node JS, and more broadly web languages and tools such as JavaScript,{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="html" size="text" />
      <span className={inlineIconStyles.emphasized}>HTML,</span>
    </span>{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="css" size="text" />
      <span className={inlineIconStyles.emphasized}>CSS3</span>
    </span>
    and JSX, which I've learned to master by working with React.
  </>,
  <>
    The experience I've gained in web development helps me think like a developer right from the UX phase, and to better
    visualize the link between design principles and technical constraints, between creativity and feasibility. I still
    have a long way to go before I can say that I master the entire creative process, from wireframing to development,
    combining creativity and technical skill. But that's my goal: to bring my ideas to life from A to Z.
  </>,
  <>
    As an incoming <strong>UX design intern at Ubisoft</strong>, I will be able to put into practice the methods and
    skills I acquired during my studies, applying the principles of cognitive engineering to concrete projects. This is
    the perfect opportunity to immerse myself further in the world of UX design and bring my creative touch to it. Feel
    free to connect with me on{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="Linkedin" size="text" />
      <span className={inlineIconStyles.emphasized}>
        {' '}
        <a className={styles.link} href="https://www.linkedin.com/in/floria-leger/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </span>
    </span>
    .
  </>,
];

const Home = () => {
  return (
    <div className={pageLayout.page}>
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
