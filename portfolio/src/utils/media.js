import mediaDimensions from './mediaDimensions';

const avifImageModules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,JPG,JPEG,PNG}', {
  import: 'default',
  query: '?format=avif&width=480;768;1200;1600&quality=70',
});

const webpImageModules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,JPG,JPEG,PNG}', {
  import: 'default',
  query: '?format=webp&width=480;768;1200;1600&quality=82',
});

const otherMediaModules = import.meta.glob('../assets/images/**/*.{webp,svg,mp4,MP4,webm,ogg}', {
  eager: true,
  import: 'default',
});

const normalizeVariants = (value) => (Array.isArray(value) ? value : [value]);
const mediaMap = {};
const imageSourcesCache = new Map();

Object.entries(otherMediaModules).forEach(([key, value]) => {
  const normalizedKey = key.replace(/.*assets[\\/]+images[\\/]+/i, '');
  mediaMap[normalizedKey] = value;
  mediaMap[normalizedKey.toLowerCase()] = value;
});

const stripPrefix = (value) => value.replace(/^\/+/, '').replace(/^assets[\\/]+images[\\/]+/i, '');

export const resolveMediaPath = (source) => {
  if (!source) return null;
  if (/^https?:/i.test(source)) return source;

  const cleaned = stripPrefix(source);
  if (mediaMap[cleaned]) return mediaMap[cleaned];
  if (mediaMap[cleaned.toLowerCase()]) return mediaMap[cleaned.toLowerCase()];

  return cleaned;
};

export const getMediaSources = async (source) => {
  if (!source) return null;
  if (/^https?:/i.test(source)) return { fallback: source, avif: [], webp: [] };

  const cleaned = stripPrefix(source);
  const sourceKey = Object.keys(webpImageModules).find(
    (key) => key.replace(/.*assets[\\/]+images[\\/]+/i, '').toLowerCase() === cleaned.toLowerCase()
  );
  if (sourceKey) {
    const cached = imageSourcesCache.get(sourceKey);
    if (cached) return cached;

    const [avif, webp] = await Promise.all([
      avifImageModules[sourceKey](),
      webpImageModules[sourceKey](),
    ]);
    const sources = {
      fallback: normalizeVariants(webp).at(-1) || normalizeVariants(avif).at(-1),
      avif: normalizeVariants(avif).filter(Boolean),
      webp: normalizeVariants(webp).filter(Boolean),
      sourceKey: cleaned,
    };
    imageSourcesCache.set(sourceKey, sources);
    return sources;
  }

  const directMedia = mediaMap[cleaned] || mediaMap[cleaned.toLowerCase()];
  if (!directMedia && (/^\//.test(source) || /^data:/i.test(source))) {
    return { fallback: source, avif: [], webp: [] };
  }
  return { fallback: directMedia || `/assets/images/${cleaned}`, avif: [], webp: [] };
};

export const getMediaDimensions = (source) => {
  if (!source) return null;
  const cleaned = stripPrefix(source);
  return mediaDimensions[cleaned] || mediaDimensions[cleaned.toLowerCase()] || null;
};

export default resolveMediaPath;
