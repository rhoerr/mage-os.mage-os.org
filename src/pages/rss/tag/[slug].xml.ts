import type { APIContext, GetStaticPaths } from 'astro';
import { getRssString } from '@astrojs/rss';

import { SITE, APP_BLOG, I18N } from 'astrowind:config';
import { fetchPosts } from '~/utils/blog';
import { buildRssItems } from '~/utils/rss';
import type { Taxonomy } from '~/types';

export const prerender = true;

export const getStaticPaths = (async () => {
  if (!APP_BLOG.isEnabled || !APP_BLOG.tag.isEnabled) return [];

  const posts = await fetchPosts();
  const tags: Record<string, Taxonomy> = {};
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tags[tag.slug] = tag;
    });
  });

  return Object.values(tags).map((tag) => ({
    params: { slug: tag.slug },
    props: { tag },
  }));
}) satisfies GetStaticPaths;

export const GET = async ({ props }: APIContext) => {
  const { tag } = props as { tag: Taxonomy };

  const posts = (await fetchPosts()).filter((post) => post.tags?.some((t) => t.slug === tag.slug));

  const rss = await getRssString({
    title: `${SITE.name}’s Blog — ${tag.title}`,
    description: `Posts tagged ${tag.title}`,
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
