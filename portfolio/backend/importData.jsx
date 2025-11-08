const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/project.jsx');
const Playground = require('./models/playground.jsx');
const data = require('../data.json');

dotenv.config({ path: path.join(__dirname, '.env') });

const normalizeStringArray = (value) => {
  if (value == null) {
    return [];
  }

  const toArray = Array.isArray(value) ? value : [value];

  return toArray
    .flatMap((entry) => {
      if (entry == null) {
        return [];
      }

      if (Array.isArray(entry)) {
        return normalizeStringArray(entry);
      }

      const text = entry.toString().trim();
      return text ? [text] : [];
    })
    .filter(Boolean);
};

const normalizeLinks = (value) => {
  if (!value) {
    return [];
  }

  const items = Array.isArray(value) ? value : [value];

  return items
    .map((item) => {
      if (!item) {
        return null;
      }

      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (!trimmed) {
          return null;
        }
        return { label: trimmed, url: trimmed };
      }

      const label = typeof item.label === 'string' ? item.label.trim() : '';
      const url = typeof item.url === 'string' ? item.url.trim() : '';

      if (!label && !url) {
        return null;
      }

      return {
        label: label || url,
        url: url || label,
      };
    })
    .filter((item) => item && item.url);
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

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

const removeUndefined = (object) =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined && value !== null));

const prepareProject = (rawProject) => {
  const project = { ...rawProject };

  project.title = typeof project.title === 'string' ? project.title.trim() : project.title;
  project.slug = typeof project.slug === 'string' ? project.slug.trim() : project.slug;
  project.type = typeof project.type === 'string' ? project.type.trim() : project.type;
  project.duration = project.duration != null ? project.duration.toString() : undefined;
  project.created = project.created != null ? project.created.toString() : undefined;
  project.context = normalizeStringArray(project.context);
  project.projectDuty = normalizeStringArray(project.projectDuty);
  project.support = normalizeStringArray(project.support);
  project.primaryImage = normalizeStringArray(project.primaryImage);
  project.secondaryImages = normalizeStringArray(project.secondaryImages);
  project.link = normalizeLinks(project.link);
  project.locked = parseBoolean(project.locked ?? project.isLocked);
  delete project.isLocked;

  return removeUndefined(project);
};

const preparePlayground = (rawPlayground) => {
  const playground = { ...rawPlayground };

  playground.title = typeof playground.title === 'string' ? playground.title.trim() : playground.title;
  playground.slug = typeof playground.slug === 'string' ? playground.slug.trim() : playground.slug;
  playground.type = typeof playground.type === 'string' ? playground.type.trim() : playground.type;
  playground.created = playground.created != null ? playground.created.toString() : undefined;
  playground.context = normalizeStringArray(playground.context);
  playground.support = normalizeStringArray(playground.support);
  playground.primaryImage = normalizeStringArray(playground.primaryImage);
  playground.secondaryImages = normalizeStringArray(playground.secondaryImages);
  playground.link = normalizeLinks(playground.link);

  return removeUndefined(playground);
};

const isProjectImportable = (project) => {
  if (!project || !project.slug || !project.title || !project.type) {
    return false;
  }

  if (project.locked) {
    return true;
  }

  return Array.isArray(project.primaryImage) && project.primaryImage.length > 0;
};

const isPlaygroundImportable = (playground) => {
  return Boolean(
    playground && playground.slug && playground.title && playground.type && playground.primaryImage.length
  );
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Project.deleteMany();
    await Playground.deleteMany();

    for (const rawProject of data.projects) {
      const project = prepareProject(rawProject);

      if (!isProjectImportable(project)) {
        console.warn(
          `Skipping project import because of missing data: ${project?.slug || project?.title || 'unknown'}`
        );
        continue;
      }

      await Project.updateOne({ slug: project.slug }, { $set: project }, { upsert: true, runValidators: true });
    }

    for (const rawPlayground of data.playgrounds) {
      const playground = preparePlayground(rawPlayground);

      if (!isPlaygroundImportable(playground)) {
        console.warn(
          `Skipping playground import because of missing data: ${playground?.slug || playground?.title || 'unknown'}`
        );
        continue;
      }

      await Playground.updateOne(
        { slug: playground.slug },
        { $set: playground },
        { upsert: true, runValidators: true }
      );
    }

    console.log('Data imported successfully without duplicates');
    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

importData();
