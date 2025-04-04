import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import ContactForm from '@/components/forms/ContactForm'; // Separate form component
import Icon from '@/components/ui/Icon'; // For social links
import styles from './ContactSection.module.css';

/**
 * Section containing contact information and a contact form.
 */
const ContactSection = ({ className = '' }) => {
  const combinedClassName = `${styles.contactSection} ${className}`.trim();

  return (
    <section id="contact" className={combinedClassName}>
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
             <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <Icon name="LinkedinIcon" size="1.2em" /> LinkedIn Profile
            </a>
             <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
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

/* --- ContactSection.module.css (Example) ---
.contactSection {
  padding: var(--section-padding-y, 4rem) 0;
  background-color: var(--section-bg, white);
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 3rem;
  align-items: flex-start; 

@media (max-width: 900px) {
    .container {
         grid-template-columns: 1fr; 
         gap: 2.5rem;
    }
    .infoColumn {
        text-align: center;
    }
}

.infoColumn {
}
.formColumn {
}

.heading {
  font-size: var(--font-size-xl, 2rem);
  margin-bottom: 1rem;
  color: var(--heading-color);
}

.description {
    margin-bottom: 2rem;
    line-height: 1.6;
    color: var(--text-secondary-color);
}

.contactDetails {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
}

.contactLink {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.2s ease;
}
.contactLink:hover {
    color: var(--primary-color);
}

@media (max-width: 900px) {
    .contactDetails {
        align-items: center;
    }
}
*/
