import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import Container from '@/components/ui/Container';
import { MailIcon } from '@/components/ui/icons';
import InlineIcon from '@/components/ui/InlineIcon';
import styles from './Home.module.css';
import inlineIconStyles from '@/components/ui/InlineIcon.module.css';

import useMagneticEffect from '@/hooks/useMagneticEffect';

const EmailMagnet = () => {
  // Use the shared hook for consistent magnetic behavior
  const setMagnet = useMagneticEffect({ maxDistance: 18, easing: 0.18, scale: 1.03 });

  return (
    <div className={styles.emailRow}>
      <p className={styles.emailText}>Get in touch at</p>

      <span ref={setMagnet} className={`${styles.magnet} ${styles.magnetIcon}`} aria-hidden>
        <MailIcon className={styles.emailIcon} size={24} title="Adresse e-mail" />
        <p className={styles.emailText}>
          floria.leger@ensc.fr
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
    I'm 22 and live near Bordeaux, France. I'm in my second year at the Ecole Nationale Supérieure de Cognitique where
    I'm exploring mental processes and human interactions, a fascinating field that combines psychology, technology and
    design. As a future UX/UI designer and cognitive engineer, I strive to develop my skills, using design tools like{' '}
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
    I'm currently looking for a 5–6 month<strong> international internship in UX/UI</strong> starting in February for my
    final year of studies. It's the perfect chance to dive deeper into the world of UX design and to add my own creative
    touch to it. Feel free to reach out below or connect with me on{' '}
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
  // reveal on mount for intro section
  const [introVisible, setIntroVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIntroVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={styles.home}>
      <HeroSection />

      <section className={`${styles.introSection} reveal-hero ${introVisible ? 'is-visible' : ''}`}>
        <Container className={`${styles.introContainer}`.trim()}>
          {aboutTitle.map((title) => (
            <h2 key={title}>{title}</h2>
          ))}

          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <EmailMagnet />
        </Container>
      </section>
    </div>
  );
};

export default Home;
