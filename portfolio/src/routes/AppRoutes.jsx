import { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import App from '@/App';

const About = lazy(() => import('@/pages/About'));
const Work = lazy(() => import('@/pages/Work'));
const Playground = lazy(() => import('@/pages/Playground'));
const Detail = lazy(() => import('@/pages/Detail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  // useLayoutEffect so scroll position is set synchronously before the browser paints
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    if (hash) return;

    // Instant scroll to top with no animation
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Work />} />
            <Route path="work/:slug" element={<Detail variant="work" />} />
            <Route path="work" element={<Navigate to="/" replace />} />
            <Route path="projects" element={<Navigate to="/" replace />} />
            <Route path="projects/:slug" element={<Detail variant="work" />} />
            <Route path="playground" element={<Playground />} />
            <Route path="playground/:slug" element={<Detail variant="playground" />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
