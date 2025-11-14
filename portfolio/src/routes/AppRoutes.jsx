import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import App from '@/App';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Work from '@/pages/Work';
import Playground from '@/pages/Playground';
import Detail from '@/pages/Detail';
import NotFound from '@/pages/NotFound';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  // useLayoutEffect so scroll position is set synchronously before the browser paints
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    if (hash) return;

    // synchronous jump to top to avoid visible scroll-before-reset on navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:slug" element={<Detail variant="work" />} />
          <Route path="playground" element={<Playground />} />
          <Route path="playground/:slug" element={<Detail variant="playground" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
