import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import Container from '@/components/ui/Container';
import { MailIcon } from '@/components/ui/icons';
import styles from './Home.module.css';

import useMagneticEffect from '@/hooks/useMagneticEffect';

const EmailMagnet = () => {
  // Use the shared hook for consistent magnetic behavior
  const setMagnet = useMagneticEffect({ maxDistance: 20, easing: 0.18, scale: 1.03 });

  return (
    <div className={styles.emailRow}>
      <p className={styles.emailText}>get in touch at</p>

      <span ref={setMagnet} className={`${styles.magnet} ${styles.magnetIcon}`} aria-hidden>
        <MailIcon className={styles.emailIcon} size={24} title="Adresse e-mail" />
        <a href="mailto:floria.leger@ensc.fr" className={styles.emailText}>
          floria.leger@ensc.fr
        </a>
      </span>
    </div>
  );
};

const aboutTitle = [
  "Hi, I'm Floria, a final-year Master's student in UX/UI Design, Cognitive and Computer Sciences with a passion for creating intuitive, user-friendly digital experiences.",
];

const aboutParagraphs = [
  "I'm 22 and live near Bordeaux. I'm in my second year at the Ecole Nationale Supérieure de Cognitique where I'm exploring mental processes and human interactions, a fascinating field that combines psychology, technology and design. As a future UX/UI designer and cognitive engineer, I strive to develop my skills, using design tools like Figma, to create interfaces that are both visually appealing and user-friendly.",
  "My school's multi-disciplinary curriculum also gives me the opportunity to explore web development technologies, in particular React JS with its Vite framework, Node JS, and more broadly web languages and tools such as JavaScript, HTML, CSS3 and JSX, which I've learned to master by working with React.",
  "The experience I've gained in web development helps me think like a developer right from the UX phase, and to better visualize the link between design principles and technical constraints, between creativity and feasibility. I still have a long way to go before I can say that I master the entire creative process, from wireframing to development, combining creativity and technical skill. But that's my goal: to bring my ideas to life from A to Z.",
  "I'm currently looking for a 5–6 month international internship in UX/UI starting in February for my final year of studies. It's the perfect chance to dive deeper into the world of UX design and to add my own creative touch to it. Feel free to reach out below or connect with me on LinkedIn.",
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
