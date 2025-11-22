const imageModules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,gif,webp,svg,mp4,MP4,webm,ogg}', {
  eager: true,
  import: 'default',
});

const imageMap = Object.entries(imageModules).reduce((acc, [key, value]) => {
  const normalizedKey = key.replace(/.*assets[\\/]+images[\\/]+/i, '');
  acc[normalizedKey] = value;
  acc[normalizedKey.toLowerCase()] = value;
  return acc;
}, {});

const stripPrefix = (value) => value.replace(/^\/+/, '').replace(/^assets[\\/]+images[\\/]+/i, '');

export const resolveMediaPath = (source) => {
  if (!source) return null;
  if (/^https?:/i.test(source)) return source;

  const cleaned = stripPrefix(source);
  if (imageMap[cleaned]) return imageMap[cleaned];

  const lower = cleaned.toLowerCase();
  if (imageMap[lower]) return imageMap[lower];

  return `/assets/images/${cleaned}`;
};

export default resolveMediaPath;
