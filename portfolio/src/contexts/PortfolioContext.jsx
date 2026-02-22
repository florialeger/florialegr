/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProjects, fetchPlaygrounds, fetchWork } from '@/services/api';
import slugify from '@/utils/slugify';
import { findIconForProject, resolveIconPath } from '@/utils/icons';
import { calculateEndDate } from '@/utils/calculateEndDate';

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
  const slug = slugify(project.slug || project.title);
  const duration = project.duration ?? project.timeframe ?? '';
  const explicitOngoing = typeof project.isOngoing !== 'undefined' ? parseBoolean(project.isOngoing) : undefined;
  // Be generous when detecting ongoing projects from the `duration` field.
  // Accept common tokens (ongoing, in progress, present, current) and some localized variants.
  const ongoingRegex = /ongoing|in\s*progress|present|current|en\s*cours|encours|\bnow\b/i;
  const isOngoing = explicitOngoing ?? ongoingRegex.test(String(duration));

  // Calculate end date: use explicit endDate if provided, otherwise calculate from created + duration
  const explicitEndDate = project.endDate || null;
  const calculatedEndDate =
    !explicitEndDate && created && duration && !isOngoing ? calculateEndDate(created, duration) : null;
  const endDate = explicitEndDate || calculatedEndDate;

  // determine icon: prefer explicit field, otherwise try to find a matching icon asset
  let iconUrl = null;
  if (project.icon) {
    iconUrl = resolveIconPath(project.icon);
  } else {
    const found = findIconForProject({ title: project.title, slug });
    iconUrl = found || null;
  }

  return {
    ...project,
    id: project._id || project.id || slug,
    slug,
    created,
    createdAt: created ? new Date(created) : null,
    endDate,
    endDateObj: endDate ? new Date(endDate) : null,
    projectDuty: normalizeArray(project.projectDuty),
    support: normalizeArray(project.support),
    link: normalizeLinks(project.link),
    primaryImage: ensureArray(project.primaryImage),
    secondaryImages: ensureArray(project.secondaryImages),
    type: normalizeType(project.type),
    isLocked: parseBoolean(lockedValue),
    isOngoing,
    icon: iconUrl,
  };
};

const normalizePlayground = (playground) => {
  const created = playground.created || playground.date || null;
  const duration = playground.duration || null;

  // Calculate end date if duration is provided
  const explicitEndDate = playground.endDate || null;
  const calculatedEndDate = !explicitEndDate && created && duration ? calculateEndDate(created, duration) : null;
  const endDate = explicitEndDate || calculatedEndDate;

  return {
    ...playground,
    id: playground._id || playground.id || playground.slug,
    slug: slugify(playground.slug || playground.title),
    created,
    createdAt: created ? new Date(created) : null,
    endDate,
    endDateObj: endDate ? new Date(endDate) : null,
    support: normalizeArray(playground.support),
    link: normalizeLinks(playground.link),
    primaryImage: ensureArray(playground.primaryImage),
    secondaryImages: ensureArray(playground.secondaryImages),
    type: normalizeType(playground.type),
  };
};

const normalizeWork = (work) => {
  const slug = slugify(work.slug || work.company);
  const startDate = work.startDate || null;
  const endDate = work.endDate || null;
  const isOngoing = !endDate;

  let iconUrl = null;
  const originalIcon = work.icon; // Preserve original icon filename
  if (work.icon) {
    iconUrl = resolveIconPath(work.icon);
  } else {
    const found = findIconForProject({ title: work.company, slug });
    iconUrl = found || null;
  }

  return {
    ...work,
    id: work._id || work.id || slug,
    slug,
    startDate,
    endDate,
    startDateObj: startDate ? new Date(startDate) : null,
    endDateObj: endDate ? new Date(endDate) : null,
    isOngoing,
    link: normalizeLinks(work.link),
    primaryImage: ensureArray(work.primaryImage),
    icon: iconUrl,
    iconFilename: originalIcon, // Add original filename for locked check
  };
};

export const PortfolioProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [playgrounds, setPlaygrounds] = useState([]);
  const [work, setWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const preloadAllImages = useCallback((projectsData, playgroundsData, workData) => {
    const allImages = [];

    // Collect all images from projects
    projectsData.forEach((project) => {
      if (project.primaryImage) allImages.push(...project.primaryImage);
      if (project.secondaryImages) allImages.push(...project.secondaryImages);
    });

    // Collect all images from playgrounds
    playgroundsData.forEach((playground) => {
      if (playground.primaryImage) allImages.push(...playground.primaryImage);
      if (playground.secondaryImages) allImages.push(...playground.secondaryImages);
    });

    // Collect all images from work
    workData.forEach((w) => {
      if (w.primaryImage) allImages.push(...w.primaryImage);
    });

    // Filter out empty/null values
    const validImages = allImages.filter(Boolean);

    if (validImages.length === 0) {
      setImagesPreloaded(true);
      return Promise.resolve();
    }

    // Preload all images
    const imagePromises = validImages.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if image fails
        img.src = typeof src === 'string' ? src : src.url || src.path || '';
      });
    });

    return Promise.all(imagePromises).then(() => {
      setImagesPreloaded(true);
    });
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, playgroundsData, workData] = await Promise.all([
        fetchProjects(),
        fetchPlaygrounds(),
        fetchWork(),
      ]);
      const normalizedProjects = projectsData.map(normalizeProject);
      const normalizedPlaygrounds = playgroundsData.map(normalizePlayground);
      const normalizedWork = workData.map(normalizeWork);

      setProjects(normalizedProjects);
      setPlaygrounds(normalizedPlaygrounds);
      setWork(normalizedWork);

      // Preload all images in background
      preloadAllImages(normalizedProjects, normalizedPlaygrounds, normalizedWork);
    } catch (err) {
      console.error('Failed to load portfolio data', err);
      setError(err);
      setProjects([]);
      setPlaygrounds([]);
      setWork([]);
    } finally {
      setLoading(false);
    }
  }, [preloadAllImages]);

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

  const workBySlug = useMemo(() => {
    const map = new Map();
    work.forEach((w) => {
      map.set(w.slug, w);
    });
    return map;
  }, [work]);

  const sortedWork = useMemo(() => {
    return [...work].sort((a, b) => {
      // ongoing work first
      if (a.isOngoing && !b.isOngoing) return -1;
      if (!a.isOngoing && b.isOngoing) return 1;

      const dateA = a.startDateObj ? a.startDateObj.getTime() : 0;
      const dateB = b.startDateObj ? b.startDateObj.getTime() : 0;
      return dateB - dateA;
    });
  }, [work]);

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
      // ongoing projects first
      if (a.isOngoing && !b.isOngoing) return -1;
      if (!a.isOngoing && b.isOngoing) return 1;

      // Sort by end date (completion date) if available, otherwise by created date
      const dateA = a.endDateObj ? a.endDateObj.getTime() : a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.endDateObj ? b.endDateObj.getTime() : b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  }, [projects]);

  const sortedPlaygrounds = useMemo(() => {
    return [...playgrounds].sort((a, b) => {
      // Sort by end date (completion date) if available, otherwise by created date
      const dateA = a.endDateObj ? a.endDateObj.getTime() : a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.endDateObj ? b.endDateObj.getTime() : b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  }, [playgrounds]);

  const value = useMemo(
    () => ({
      projects: sortedProjects,
      playgrounds: sortedPlaygrounds,
      work: sortedWork,
      loading,
      error,
      imagesPreloaded,
      refresh: loadData,
      uniqueDuties,
      uniquePlaygroundCategories,
      getProjectBySlug: (slug) => projectsBySlug.get(slug),
      getPlaygroundBySlug: (slug) => playgroundsBySlug.get(slug),
      getWorkBySlug: (slug) => workBySlug.get(slug),
    }),
    [
      sortedProjects,
      sortedPlaygrounds,
      sortedWork,
      loading,
      error,
      imagesPreloaded,
      loadData,
      uniqueDuties,
      uniquePlaygroundCategories,
      projectsBySlug,
      playgroundsBySlug,
      workBySlug,
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
