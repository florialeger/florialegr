import { describe, expect, it } from 'vitest';
import { fetchPlaygroundById, fetchPlaygrounds, fetchProjectById, fetchProjects, fetchWork } from '@/services/api';

describe('static portfolio data', () => {
  it('loads all static collections without network access', async () => {
    const [projects, playgrounds, work] = await Promise.all([fetchProjects(), fetchPlaygrounds(), fetchWork()]);

    expect(projects.length).toBeGreaterThan(0);
    expect(playgrounds.length).toBeGreaterThan(0);
    expect(work.length).toBeGreaterThan(0);
  });

  it('resolves projects and playgrounds by slug', async () => {
    const projects = await fetchProjects();
    const playgrounds = await fetchPlaygrounds();

    await expect(fetchProjectById(projects[0].slug)).resolves.toMatchObject({ slug: projects[0].slug });
    await expect(fetchPlaygroundById(playgrounds[0].slug)).resolves.toMatchObject({ slug: playgrounds[0].slug });
    await expect(fetchProjectById('missing-project')).resolves.toBeNull();
  });
});
