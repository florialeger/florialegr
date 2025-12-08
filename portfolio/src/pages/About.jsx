import { useState } from 'react';
import Container from '@/components/ui/Container';
import AboutSection from '@/components/sections/AboutSection';
import RevealAnimation from '@/components/utility/RevealAnimation';
import portraitImage from '@/assets/images/profil-picture.png';
import resumePdf from '@/assets/pdf/floria-cv.pdf';
import resumefrPdf from '@/assets/pdf/floria-cv-fr.pdf';
import portfolioPdf from '@/assets/pdf/floria-portfolio.pdf';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import { MailIcon } from '@/components/ui/icons';
import InlineIcon from '@/components/ui/InlineIcon';
import SwipeableStack from '@/components/utility/SwipeableStack';
import styles from './About.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import inlineIconStyles from '@/components/ui/InlineIcon.module.css';

// Calculate years since September 2023, rounded to nearest half year
const calculateYearsSince = () => {
  const startDate = new Date(2023, 8, 1); // September 2023 (month is 0-indexed)
  const today = new Date();
  const diffInMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
  const years = Math.floor(diffInMonths / 12);
  const remainingMonths = diffInMonths % 12;

  // Round to nearest half year
  if (remainingMonths < 3) {
    return years === 0 ? 'a few months' : years === 1 ? 'one year' : `${years} years`;
  } else if (remainingMonths < 9) {
    return years === 0 ? 'half a year' : `${years} and a half years`;
  } else {
    return years === 0 ? 'one year' : `${years + 1} years`;
  }
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
    creates such intuitive and seamless user experiences, even though at the time I couldn't put it into words. I've
    been practicing it ever since I got my own computer, it's been {calculateYearsSince()} now. When I started using{' '}
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
    for {calculateVolleyballYears()} years, which has instilled the importance of teamwork and pushing personal limits.
    I also have a keen interest in photography, videography, and animation, which helps me expand my creative horizons.
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
  const [copied, setCopied] = useState(false);

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

  const EmailMagnet = () => {
    const setMagnet = useMagneticEffect({ maxDistance: 4, easing: 0.18, scale: 1.02 });
    return (
      <div className={styles.emailRow}>
        <h2 className={styles.emailText}>Get in touch at</h2>

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
          <MailIcon size={32} title="Adresse e-mail" />
          <h2 className={styles.emailText}>floria.leger@ensc.fr</h2>
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
        portraitSrc={portraitImage}
        portraitAlt="Floria Leger"
      />

      <section className={styles.stackSection}>
        <div className={styles.stackContainer}>
          <RevealAnimation cascade damping={0.08} triggerOnce>
            <SwipeableStack />
          </RevealAnimation>
        </div>
      </section>

      <section className={pageLayout.container} style={{ paddingTop: 0 }}>
        <div className={styles.contactContainer}>
          <RevealAnimation cascade damping={0.08} triggerOnce>
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
          </RevealAnimation>
        </div>
      </section>
    </div>
  );
};

export default About;
