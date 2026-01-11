import type { APIRoute, GetStaticPaths } from 'astro';
import { generateOgImage, staticPagesMeta } from '~/utils/og-image';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  return Object.entries(staticPagesMeta).map(([page, meta]) => ({
    params: { page },
    props: meta,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props;

  const png = await generateOgImage({
    title,
    description,
    type: 'page',
  });

  return new Response(png, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
