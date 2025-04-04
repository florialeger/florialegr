import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card'; // Use the base Card component
import styles from './ProjectCard.module.css';

// Helper to construct image paths (adjust based on your API/setup)
const getImageUrl = (imageName) => {
    // Option 1: If API provides full URLs, just return imageName
    // return imageName;

    // Option 2: If API provides relative paths from a known base
    // return `${import.meta.env.VITE_ASSETS_BASE_URL || '/assets/img/'}${imageName}`;

    // Option 3: If using local import structure (Less ideal for dynamic data)
     return `/assets/img/${imageName}`; // Adjust this path as needed
};


/**
 * Displays a preview card for a single project.
 */
const ProjectCard = ({ project, className = '' }) => {
  const navigate = useNavigate();

  // Determine the correct navigation path based on project type
  const path = project.type === 'playground' // Assuming 'type' distinguishes them
        ? `/playground/${project.slug}`
        : `/work/${project.slug}`;

  const handleOpenDetail = useCallback(() => {
    // Consider if scroll position saving is still needed
    // const currentScrollPosition = window.scrollY;
    // setScrollPosition(currentScrollPosition); // Needs scroll context

    navigate(path, { state: { projectData: project } }); // Pass data if needed on detail page
  }, [navigate, path, project]);

  const primaryImageUrl = project.primaryImage?.[0] ? getImageUrl(project.primaryImage[0]) : '/assets/img/placeholder.png'; // Fallback image
  // const secondaryImageUrl = project.primaryImage?.[1] ? getImageUrl(project.primaryImage[1]) : null; // Optional secondary image

  return (
    <Card
      className={`${styles.projectCard} ${className}`.trim()}
      onClick={handleOpenDetail} // Make the whole card clickable
      aria-label={`View project: ${project.title}`}
    >
      <div className={styles.imageContainer}>
          {/* Basic Image */}
        <img
          src={primaryImageUrl}
          alt={`${project.title} preview`}
          className={styles.image}
          loading="lazy" // Native lazy loading
        />
        {/* Add overlay or secondary image logic here if needed */}
      </div>
      {/* Render title only for non-playground items, as per original logic */}
      {project.type !== 'playground' && (
          <div className={styles.titleWrapper}>
             <h3 className={styles.title}>{project.title}</h3>
              {/* Optional: Add tags or short description */}
              {/* <p className={styles.shortDesc}>{project.context?.substring(0, 50)}...</p> */}
          </div>
      )}
    </Card>
  );
};

ProjectCard.propTypes = {
  // Define shape based on your Mongoose Project schema
  project: PropTypes.shape({
    _id: PropTypes.string, // Or ObjectId if needed
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    primaryImage: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.oneOf(['ux', 'illustration']).isRequired,
    context: PropTypes.string,
    // Add other fields if used in the card
  }).isRequired,
  className: PropTypes.string,
};

export default memo(ProjectCard);

/* --- ProjectCard.module.css (Example) ---
.projectCard {
 
    padding: 0; 
}

 .projectCard .content {
    padding: 0; 
 }

.imageContainer {
    position: relative;
    overflow: hidden;
    aspect-ratio: 4 / 3; 
    background-color: #eee; 
}

.image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover; 
    transition: transform 0.3s ease-out;
}

 .projectCard:hover .image {
     /* transform: scale(1.05); 
 }

.titleWrapper {
    padding: 1rem 1.25rem;
}

.title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: var(--heading-color);
}
*/
