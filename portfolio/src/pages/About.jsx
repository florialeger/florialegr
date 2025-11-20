import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import AboutSection from '@/components/sections/AboutSection';
import portraitImage from '@/assets/images/profil-picture.png';
import resumePdf from '@/assets/pdf/floria-cv.pdf';
import resumefrPdf from '@/assets/pdf/floria-cv-fr.pdf';
import portfolioPdf from '@/assets/pdf/floria-portfolio.pdf';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import { MailIcon } from '@/components/ui/icons';
import InlineIcon from '@/components/ui/InlineIcon';
import styles from './About.module.css';
import inlineIconStyles from '@/components/ui/InlineIcon.module.css';

const aboutParagraphs = [
  <>
    I'm currently a final-year student at ENSC, a cognitive engineering school in Bordeaux, with a strong passion for UI
    and UX design, particularly in accessibility.
  </>,

  <>
    I don’t really remember when I started to like drawing, but as far as I can remember I always had a{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="pencil" size="text" />
      <span className={inlineIconStyles.emphasized}>pencil</span>
    </span>
    in my hand. While I mostly create for myself, I find joy in making art for others. Although my arts projects have
    been informal, they taught me about managing deadlines and handling feedback.
  </>,

  <>
    I discovered UX design back in high school, thanks to my brother. That said, for as long as I can remember, I've
    always been fascinated by how{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="apple" size="text" />
      <span className={inlineIconStyles.emphasized}>Apple</span>
    </span>
    creates such intuitive and seamless user experiences, even though at the time I couldn't put it into words. I’ve
    been practicing it ever since I got my own computer, it’s been two and a half years now. When I started using{' '}
    <span className={inlineIconStyles.inlineWrap}>
      <InlineIcon name="figma" size="text" />
      <span className={inlineIconStyles.emphasized}>Figma,</span>
    </span>
    I knew I wanted to make it my life's work. It’s not so much the software itself that I’m drawn to, it’s the act of
    creating that fascinates me.
  </>,

  <>
    Lately, I've become increasingly interested in web design, believing my drawing skills will be beneficial in this
    area. I enjoy exploring new design projects independently and particularly love working with CSS and styling web
    pages.
  </>,
  <>
    Outside my academic and artistic pursuits, I've played{' '}
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
    label: 'English Resume',
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
  { key: 'bento', label: 'Bento', href: 'https://bento.me/floria' },
  { key: 'artstation', label: 'ArtStation', href: 'https://florialeger.artstation.com/' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/floria-leger/' },
  { key: 'github', label: 'GitHub', href: 'https://github.com/florialeger' },
  { key: 'layers', label: 'Layers', href: 'https://layers.to/florialeger' },
  { key: 'twitter', label: 'Twitter', href: 'https://twitter.com/LegerFloria' },
];

const About = () => {
  const [aboutVisible, setAboutVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setAboutVisible(true);
      setContactVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Email magnet component (reuses Home's classes for identical behavior)
  const EmailMagnet = () => {
    const setMagnet = useMagneticEffect({ maxDistance: 18, easing: 0.18, scale: 1.03 });
    return (
      <div className={styles.emailRow}>
        <h2 className={styles.emailText}>Get in touch at</h2>

        <span ref={setMagnet} className={`${styles.magnet} ${styles.magnetIcon}`} aria-hidden>
          <MailIcon size={44} title="Adresse e-mail" />
          <h2 className={styles.emailText}>floria.leger@ensc.fr</h2>
        </span>
      </div>
    );
  };

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
         
            <p className={styles.contactParagraph}>
              <EmailMagnet />
            </p>

            <ul className={styles.socialGrid}>
              {contactLinks.map((link) => (
                <li key={link.label} className={styles.socialItem}>
                  <a href={link.href} target="_blank" rel="noreferrer" className={styles.socialLink}>
                    <span className={inlineIconStyles.inlineWrap}>
                      <InlineIcon name={link.key || link.label} size="title" />
                      <span className={`${inlineIconStyles.emphasized} ${styles.linkLabel}`}>{link.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
       
        </Container>
      </section>
    </div>
  );
};

export default About;
