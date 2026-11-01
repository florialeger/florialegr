import mediaDimensions from './mediaDimensions';

const avifImageModules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
  query: '?format=avif&width=480;768;1200;1600&quality=70',
});

const webpImageModules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
  query: '?format=webp&width=480;768;1200;1600&quality=82',
});

const otherMediaModules = import.meta.glob('../assets/images/**/*.{webp,svg,mp4,MP4,webm,ogg}', {
  eager: true,
  import: 'default',
});

const normalizeVariants = (value) => (Array.isArray(value) ? value : [value]);
const imageSources = {};
const mediaMap = {};
const sourceByUrl = new Map();

const registerImageModules = (modules, format) => {
  Object.entries(modules).forEach(([key, value]) => {
    const normalizedKey = key.replace(/.*assets[\\/]+images[\\/]+/i, '');
    const variants = normalizeVariants(value).filter(Boolean);
    const entry = imageSources[normalizedKey] || { avif: [], webp: [] };
    entry[format] = variants;
    imageSources[normalizedKey] = entry;
    imageSources[normalizedKey.toLowerCase()] = entry;
    variants.forEach((url) => sourceByUrl.set(url, normalizedKey));
  });
};

registerImageModules(avifImageModules, 'avif');
registerImageModules(webpImageModules, 'webp');

Object.entries(otherMediaModules).forEach(([key, value]) => {
  const normalizedKey = key.replace(/.*assets[\\/]+images[\\/]+/i, '');
  mediaMap[normalizedKey] = value;
  mediaMap[normalizedKey.toLowerCase()] = value;
  sourceByUrl.set(value, normalizedKey);
});

const stripPrefix = (value) => value.replace(/^\/+/, '').replace(/^assets[\\/]+images[\\/]+/i, '');

export const resolveMediaPath = (source) => {
  if (!source) return null;
  if (/^https?:/i.test(source)) return source;

  const cleaned = stripPrefix(source);
  const image = imageSources[cleaned] || imageSources[cleaned.toLowerCase()];
  if (image) return image.webp.at(-1) || image.avif.at(-1) || null;

  if (mediaMap[cleaned]) return mediaMap[cleaned];
  if (mediaMap[cleaned.toLowerCase()]) return mediaMap[cleaned.toLowerCase()];

  return `/assets/images/${cleaned}`;
};

export const getMediaSources = (source) => {
  if (!source) return null;
  if (/^https?:/i.test(source)) return { fallback: source, avif: [], webp: [] };

  const cleaned = stripPrefix(source);
  const sourceKey = imageSources[cleaned] ? cleaned : imageSources[cleaned.toLowerCase()];
  const image = sourceKey ? imageSources[sourceKey] : null;

  if (image) {
    const fallback = image.webp.at(-1) || image.avif.at(-1) || `/assets/images/${cleaned}`;
    return {
      fallback,
      avif: image.avif,
      webp: image.webp,
      sourceKey,
    };
  }

  const originalKey = sourceByUrl.get(source);
  if (originalKey) return getMediaSources(originalKey);

  const directMedia = mediaMap[cleaned] || mediaMap[cleaned.toLowerCase()];
  if (!directMedia && (/^\//.test(source) || /^data:/i.test(source))) {
    return { fallback: source, avif: [], webp: [] };
  }
  return { fallback: directMedia || `/assets/images/${cleaned}`, avif: [], webp: [] };
};

export const getMediaDimensions = (source) => {
  if (!source) return null;
  const cleaned = stripPrefix(source);
  const originalKey = sourceByUrl.get(source);
  const key = originalKey || cleaned;
  return mediaDimensions[key] || mediaDimensions[key.toLowerCase()] || null;
};

export default resolveMediaPath;
