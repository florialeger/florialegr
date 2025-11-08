/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProjects, fetchPlaygrounds } from '@/services/api';
import slugify from '@/utils/slugify';

const PortfolioContext = createContext(null);

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeLinks = (links) => {
  if (!links) return [];
  if (Array.isArray(links)) {
    return links
      .map((link, index) => {
        if (!link) return null;
        if (typeof link === 'string') {
          return { label: `Link ${index + 1}`, url: link };
        }
        const label = link.label?.trim() || `Link ${index + 1}`;
        return {
          label,
          url: link.url?.trim() || '#',
        };
      })
      .filter((link) => Boolean(link?.url));
  }
  if (typeof links === 'string') {
    return [{ label: 'Link', url: links }];
  }
  return [];
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return Boolean(value);
};

const normalizeType = (type) => {
  const value = (type || '').toString().trim().toLowerCase();
  if (!value) return 'ux_ui';
  if (value.includes('illustr')) return 'illustration';
  if (value.includes('ux')) return 'ux_ui';
  if (value.includes('dev')) return 'dev';
  if (value.includes('motion')) return 'motion';
  return value.replace(/\s+/g, '_');
};

const ensureArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizeProject = (project) => {
  const created = project.created || project.date || null;
  const lockedValue = project.locked ?? project.isLocked;
  return {
    ...project,
    id: project._id || project.id || project.slug,
    slug: slugify(project.slug || project.title),
    created,
    createdAt: created ? new Date(created) : null,
    projectDuty: normalizeArray(project.projectDuty),
    support: normalizeArray(project.support),
    link: normalizeLinks(project.link),
    primaryImage: ensureArray(project.primaryImage),
    secondaryImages: ensureArray(project.secondaryImages),
    type: normalizeType(project.type),
    isLocked: parseBoolean(lockedValue),
  };
};

const normalizePlayground = (playground) => {
  const created = playground.created || playground.date || null;
  return {
    ...playground,
    id: playground._id || playground.id || playground.slug,
    slug: slugify(playground.slug || playground.title),
    created,
    createdAt: created ? new Date(created) : null,
    support: normalizeArray(playground.support),
    link: normalizeLinks(playground.link),
    primaryImage: ensureArray(playground.primaryImage),
    secondaryImages: ensureArray(playground.secondaryImages),
    type: normalizeType(playground.type),
  };
};

export const PortfolioProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [playgrounds, setPlaygrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, playgroundsData] = await Promise.all([fetchProjects(), fetchPlaygrounds()]);
      setProjects(projectsData.map(normalizeProject));
      setPlaygrounds(playgroundsData.map(normalizePlayground));
    } catch (err) {
      console.error('Failed to load portfolio data', err);
      setError(err);
      setProjects([]);
      setPlaygrounds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      await loadData();
    };

    if (isMounted) {
      void hydrate();
    }

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const projectsBySlug = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      map.set(project.slug, project);
    });
    return map;
  }, [projects]);

  const playgroundsBySlug = useMemo(() => {
    const map = new Map();
    playgrounds.forEach((playground) => {
      map.set(playground.slug, playground);
    });
    return map;
  }, [playgrounds]);

  const uniqueDuties = useMemo(() => {
    const duties = new Set();
    projects.forEach((project) => {
      project.projectDuty.forEach((duty) => duties.add(duty));
    });
    return Array.from(duties).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const uniquePlaygroundCategories = useMemo(() => {
    const categories = new Set();
    playgrounds.forEach((playground) => {
      categories.add(playground.type);
    });
    return Array.from(categories).sort((a, b) => a.localeCompare(b));
  }, [playgrounds]);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  }, [projects]);

  const sortedPlaygrounds = useMemo(() => {
    return [...playgrounds].sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  }, [playgrounds]);

  const value = useMemo(
    () => ({
      projects: sortedProjects,
      playgrounds: sortedPlaygrounds,
      loading,
      error,
      refresh: loadData,
      uniqueDuties,
      uniquePlaygroundCategories,
      getProjectBySlug: (slug) => projectsBySlug.get(slug),
      getPlaygroundBySlug: (slug) => playgroundsBySlug.get(slug),
    }),
    [
      sortedProjects,
      sortedPlaygrounds,
      loading,
      error,
      loadData,
      uniqueDuties,
      uniquePlaygroundCategories,
      projectsBySlug,
      playgroundsBySlug,
    ]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export default PortfolioContext;
