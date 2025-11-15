const iconModules = import.meta.glob('../assets/icons/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default',
});

const iconMap = Object.entries(iconModules).reduce((acc, [key, value]) => {
  const normalizedKey = key.replace(/.*assets[\\/]+icons[\\/]+/i, '').toLowerCase();
  acc[normalizedKey] = value;
  return acc;
}, {});

const stripPrefix = (value) => value.replace(/^\/+/, '').replace(/^assets[\\/]+icons[\\/]+/i, '');

export const resolveIconPath = (source) => {
  if (!source) return null;
  if (/^https?:/i.test(source)) return source;

  const cleaned = stripPrefix(source).toLowerCase();
  if (iconMap[cleaned]) return iconMap[cleaned];

  return `/assets/icons/${cleaned}`;
};

export const findIconForProject = ({ title = '', slug = '' } = {}) => {
  const slugKey = (slug || '').toString().toLowerCase();
  const titleKey = (title || '').toString().toLowerCase();

  // Try exact or partial slug match first
  const keys = Object.keys(iconMap);
  let match = keys.find((k) => slugKey && k.includes(slugKey));
  if (match) return iconMap[match];

  // Try words from title
  const titleWords = titleKey.split(/[^a-z0-9]+/).filter(Boolean);
  for (const word of titleWords) {
    match = keys.find((k) => k.includes(word));
    if (match) return iconMap[match];
  }

  return null;
};

export default {
  iconMap,
  resolveIconPath,
  findIconForProject,
};
