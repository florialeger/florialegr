import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AppRoutes from '@/routes/AppRoutes';

const renderRoute = async (path, text) => {
  window.history.pushState({}, '', path);
  render(<AppRoutes />);
  expect(await screen.findByText(text)).toBeInTheDocument();
};

describe('static routes', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the work route', async () => {
    await renderRoute('/', /UX Designer/);
  });

  it('renders the about route', async () => {
    await renderRoute('/about', /Master.s graduate/);
  });

  it('renders the playground route', async () => {
    await renderRoute('/playground', /Drawing has always been a part of me/);
  });
});
