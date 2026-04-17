import { getRssString } from '@astrojs/rss';

import { SITE, METADATA, APP_BLOG, I18N } from 'astrowind:config';
import { fetchPosts } from '~/utils/blog';
import { buildRssItems } from '~/utils/rss';

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await fetchPosts();

  const rss = await getRssString({
    title: `${SITE.name} Blog`,
    description: METADATA?.description || '',
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
