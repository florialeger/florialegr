import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import styles from './AboutSection.module.css';
 // import aboutImage from '@assets/img/your-photo.jpg'; // Example image import

/**
 * Section detailing information about you.
 */
const AboutSection = ({ className = '' }) => {
  const combinedClassName = `${styles.aboutSection} ${className}`.trim();

  return (
    <section id="about" className={combinedClassName}> {/* Add ID for potential linking */}
      <Container className={styles.container}>
          {/* Optional Image Column */}
         {/* <div className={styles.imageColumn}>
              <img src={aboutImage} alt="Floria Leger" className={styles.profileImage} />
         </div> */}

         <div className={styles.textColumn}>
             <h2 className={styles.heading}>About Me</h2>
             <p>
                 Hi, I'm Floria Leger. I blend creativity with user-centered design principles
                 to craft illustrations that tell stories and UX solutions that feel intuitive.
                 I'm passionate about [mention a specific passion related to your work, e.g., visual storytelling, solving complex problems, accessibility].
             </p>
             <p>
                 With experience in [mention key areas like user research, wireframing, prototyping, digital painting, vector art],
                 I strive to deliver work that is both aesthetically pleasing and functionally effective.
                 I enjoy collaborating on projects that [mention type of projects or impact you seek].
             </p>
             <p>
                 When I'm not designing or illustrating, you can find me [mention a hobby or interest].
             </p>
             {/* Optional: Add a button linking to resume or detailed about page */}
             {/* <Button href="/path/to/resume.pdf" variant="outline" target="_blank">Download Resume</Button> */}
         </div>
      </Container>
    </section>
  );
};

AboutSection.propTypes = {
    className: PropTypes.string,
};

export default memo(AboutSection);

/* --- AboutSection.module.css (Example) ---
.aboutSection {
  padding: var(--section-padding-y, 4rem) 0;
  background-color: var(--section-bg-alt, #f9f9f9);
}

 .container {
  
 }

.heading {
  font-size: var(--font-size-xl, 2rem);
  margin-bottom: 1.5rem;
  color: var(--heading-color);
  text-align: center;
}



.textColumn p {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: var(--text-color);
}
*/