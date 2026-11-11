let dataPromise;

const loadData = async () => {
  dataPromise ||= import('../../data.json').then((module) => module.default || module);
  return dataPromise;
};

export const fetchProjects = async () => {
  const data = await loadData();
  return data.projects || [];
};

export const fetchProjectById = async (id) => {
  const projects = await fetchProjects();
  return projects.find((project) => project.slug === id || project.id === id) || null;
};

export const fetchPlaygrounds = async () => {
  const data = await loadData();
  return data.playgrounds || [];
};

export const fetchWork = async () => {
  const data = await loadData();
  return data.main || data.work || [];
};

export const fetchPlaygroundById = async (id) => {
  const playgrounds = await fetchPlaygrounds();
  return playgrounds.find((playground) => playground.slug === id || playground.id === id) || null;
};
