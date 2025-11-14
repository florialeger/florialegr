import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import ContactForm from '@/components/forms/ContactForm'; // Separate form component
import Icon from '@/components/ui/Icon'; // For social links
import styles from './ContactSection.module.css';
// useBlurReveal removed

/**
 * Section containing contact information and a contact form.
 */
const ContactSection = ({ className = '' }) => {
  const combinedClassName = `${styles.contactSection} ${className}`.trim();

  const setRevealNode = () => {};

  return (
    <section id="contact" ref={setRevealNode} className={combinedClassName}>
      <Container className={styles.container}>
        <div className={styles.infoColumn}>
          <h2 className={styles.heading}>Get In Touch</h2>
          <p className={styles.description}>
            Have a project in mind or just want to say hello? Feel free to reach out!
          </p>
          <div className={styles.contactDetails}>
            {/* Add your actual contact details */}
            <a href="mailto:your.email@example.com" className={styles.contactLink}>
              <Icon name="EmailIcon" size="1.2em" /> your.email@example.com
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              <Icon name="LinkedinIcon" size="1.2em" /> LinkedIn Profile
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              <Icon name="GithubIcon" size="1.2em" /> GitHub Profile
            </a>
            {/* Add other relevant links (Behance, Dribbble, etc.) */}
          </div>
        </div>
        <div className={styles.formColumn}>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
};

ContactSection.propTypes = {
  className: PropTypes.string,
};

export default memo(ContactSection);
