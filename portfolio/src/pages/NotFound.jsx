import Container from '@/components/ui/Container';
import styles from './NotFound.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';

export default function NotFound() {
  return (
    <section className={`${pageLayout.page} ${styles.notFound}`}>
      <Container className={`${pageLayout.paragraph} ${styles.content}`}>
        <h1 className={styles.title}>404 — Page Not Found</h1>
        <p className={styles.description}>
          The page you’re looking for doesn’t exist or may have been moved. Try heading back to the previous page or use
          the navigation above to find your way.
        </p>
      </Container>
    </section>
  );
}
