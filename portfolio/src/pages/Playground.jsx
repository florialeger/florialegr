import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useRevealOnView from '@/hooks/useRevealOnView';
import RevealAnimation from '@/components/utility/RevealAnimation';
import Container from '@/components/ui/Container';
import CardGrid from '@/components/projects/CardGrid';
import ProjectCard from '@/components/projects/ProjectCard';
import Timeline from '@/components/ui/Timeline';
import { usePortfolio } from '@/contexts/PortfolioContext';
import styles from './Playground.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import inlineIconStyles from '@/components/ui/InlineIcon.module.css';


const playgroundParagraphs = [
  <>
    Drawing has always been a part of me, more than a hobby, it just feels right. Eighteen years in, I keep growing at
    my own pace, always striving for more. I don't post much online, but I create whenever I can.
  </>,
  <>
    Over the years, I've channeled that discipline into{' '}
    <a
      className={inlineIconStyles.dottedLink}
      href="https://florialeger.github.io/deck/"
      target="_blank"
      rel="noreferrer"
    >
      UX/UI design.
    </a>{' '}
    With solid, hands - on experience under my belt, it has become another canvas for balance, structure, and emotion,
    one where I solve real - world problems for real people.The process, the curiosity, and the joy of making, that’s
    what drives me.
  </>,
];

// Animation variants for staggered list entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Playground = () => {
  const location = useLocation();
  const { playgrounds, loading, error } = usePortfolio();
  // const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [hoveredSlug, setHoveredSlug] = useState(null);
  // const [filterVisible, setFilterVisible] = useState(false);
  const gridRef = useRef(null);
  // const thresholdRef = useRef({ thresholdY: 0, scrollTarget: 0 });

  // const categories = useMemo(() => [ALL_CATEGORY, ...uniquePlaygroundCategories], [uniquePlaygroundCategories]);

  // const filteredPlaygrounds = useMemo(() => {
  //   if (selectedCategory === ALL_CATEGORY) return playgrounds;
  //   return playgrounds.filter((item) => item.type === selectedCategory);
  // }, [playgrounds, selectedCategory]);

  // Scroll restoration when returning from detail page
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo && gridRef.current) {
      // Wait for cards to render
      setTimeout(() => {
        const targetCard = gridRef.current.querySelector(`[data-slug="${scrollTo.slug}"]`);
        if (targetCard) {
          const rect = targetCard.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementHeight = rect.height;
          const viewportHeight = window.innerHeight;
          const scrollPosition = elementTop - viewportHeight / 2 + elementHeight / 2;

          window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [location.state?.scrollTo]);

  const handleHoverChange = useCallback((slug) => {
    setHoveredSlug(slug ?? null);
  }, []);

  useRevealOnView(gridRef, {
    itemSelector: '[data-slug]',
    targetSelector: '[data-reveal-target]',
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.06,
    stagger: 80,
    once: true,
  });

  return (
    <div className={pageLayout.page}>
      <Container className={pageLayout.pageHeader}>
        <RevealAnimation cascade damping={0.1} triggerOnce>
          {playgroundParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </RevealAnimation>
      </Container>

      <Container className={styles.gridContainer}>
        {loading && <p className={styles.stateMessage}>Loading playgrounds…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load playgrounds right now.</p>}
        {!loading && !error && (
          <CardGrid ref={gridRef} className={styles.grid} data-hovered={hoveredSlug || 'none'}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              // key={selectedCategory}
              style={{ display: 'contents' }}
            >
              {playgrounds.map((item) => (
                <motion.div key={item.id || item.slug} variants={itemVariants} style={{ display: 'contents' }}>
                  <ProjectCard
                    item={item}
                    variant="playground"
                    onHoverChange={handleHoverChange}
                    // currentFilter={selectedCategory}
                    className={`${hoveredSlug && hoveredSlug !== item.slug ? styles.dimmed : ''}`.trim()}
                    data-created={item.created}
                  />
                </motion.div>
              ))}
            </motion.div>
          </CardGrid>
        )}
      </Container>

      <Timeline playgrounds={playgrounds} />
    </div>
  );
};

export default Playground;

