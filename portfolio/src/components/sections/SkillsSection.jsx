import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Container from '@/components/ui/Container';
import Icon from '@/components/ui/Icon'; // Use your Icon component
import styles from './SkillsSection.module.css';

// Define skills data here or pass as props
const skillCategories = [
  {
    title: 'UX Design',
    skills: [
      { name: 'User Research', icon: 'SearchIcon' }, // Use icon names matching your Icon component
      { name: 'Wireframing', icon: 'LayoutIcon' },
      { name: 'Prototyping', icon: 'PrototypeIcon' },
      { name: 'Usability Testing', icon: 'TestIcon' },
      { name: 'Figma', icon: 'FigmaIcon' }, // Example tool
    ],
  },
  {
    title: 'Illustration',
    skills: [
      { name: 'Digital Painting', icon: 'PaintIcon' },
      { name: 'Vector Art', icon: 'VectorIcon' },
      { name: 'Character Design', icon: 'CharacterIcon' },
      { name: 'Storyboarding', icon: 'StoryboardIcon' },
      { name: 'Photoshop', icon: 'PhotoshopIcon' }, // Example tool
      { name: 'Illustrator', icon: 'IllustratorIcon' }, // Example tool
    ],
  },
  // Add more categories if needed (e.g., Development, Tools)
];

/**
 * Section displaying technical and creative skills.
 */
const SkillsSection = ({ className = '' }) => {
  const combinedClassName = `${styles.skillsSection} ${className}`.trim();

  return (
    <section id="skills" className={combinedClassName}>
      <Container>
        <h2 className={styles.heading}>Skills</h2>
        <div className={styles.categoriesGrid}>
          {skillCategories.map((category) => (
            <div key={category.title} className={styles.category}>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
              <ul className={styles.skillsList}>
                {category.skills.map((skill) => (
                  <li key={skill.name} className={styles.skillItem}>
                    {skill.icon && <Icon name={skill.icon} className={styles.skillIcon} />}
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

SkillsSection.propTypes = {
  className: PropTypes.string,
};

export default memo(SkillsSection);

/* --- SkillsSection.module.css (Example) ---
.skillsSection {
  padding: var(--section-padding-y, 4rem) 0;
  background-color: var(--section-bg, white);
}

.heading {
  font-size: var(--font-size-xl, 2rem);
  margin-bottom: 2.5rem;
  color: var(--heading-color);
  text-align: center;
}

.categoriesGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

  category {
  background-color: var(--card-bg, #fdfdfd);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--card-border-color, #eee);
}

.categoryTitle {
  font-size: var(--font-size-large, 1.25rem);
  margin-bottom: 1rem;
  color: var(--primary-color);
  text-align: center;
}

.skillsList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skillItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: var(--text-color);
}

.skillIcon {
  font-size: 1.3em; 
  color: var(--icon-color, var(--text-secondary-color));
}
*/
