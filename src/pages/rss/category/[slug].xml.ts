import type { APIContext, GetStaticPaths } from 'astro';
import { getRssString } from '@astrojs/rss';

import { SITE, APP_BLOG, I18N } from 'astrowind:config';
import { fetchPosts, findCategories } from '~/utils/blog';
import { buildRssItems } from '~/utils/rss';

export const prerender = true;

export const getStaticPaths = (async () => {
  if (!APP_BLOG.isEnabled || !APP_BLOG.category.isEnabled) return [];

  const categories = await findCategories();
  return categories.map((category) => ({
    params: { slug: category.slug },
    props: { category },
  }));
}) satisfies GetStaticPaths;

export const GET = async ({ props }: APIContext) => {
  const { category } = props as { category: { slug: string; title: string } };

  const posts = (await fetchPosts()).filter((post) => post.category?.slug === category.slug);

  const rss = await getRssString({
    title: `${SITE.name} ${category.title}`,
    description: `Posts in the ${category.title} category`,
    site: import.meta.env.SITE,
    items: await buildRssItems(posts),
    trailingSlash: SITE.trailingSlash,
    customData: `<language>${I18N?.language || 'en'}</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
