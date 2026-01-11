import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '~/utils/og-image';
import { cleanSlug } from '~/utils/permalinks';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('post', ({ data }) => !data.draft);

  return posts.map((post) => {
    const slug = cleanSlug(post.id);
    const categorySlug = post.data.category ? cleanSlug(post.data.category) : null;

    // Generate the same permalink structure used in [...blog]/index.astro
    // Pattern: /%category%/%slug%
    const permalink = categorySlug ? `${categorySlug}/${slug}` : slug;

    return {
      params: { slug: permalink },
      props: {
        title: post.data.title,
        description: post.data.excerpt,
        category: post.data.category,
      },
    };
  });
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, category } = props;

  const png = await generateOgImage({
    title,
    description,
    category,
    type: 'article',
  });

  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
