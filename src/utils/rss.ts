import { experimental_AstroContainer as AstroContainer } from 'astro/container';

import { getPermalink } from '~/utils/permalinks';
import type { Post } from '~/types';

const renderPostContent = async (post: Post, container: AstroContainer): Promise<string | undefined> => {
  if (!post.Content) return undefined;
  try {
    return await container.renderToString(post.Content);
  } catch {
    return undefined;
  }
};

export const buildRssItems = async (posts: Array<Post>) => {
  const container = await AstroContainer.create();

  return Promise.all(
    posts.map(async (post) => {
      const content = await renderPostContent(post, container);
      const categories = [
        ...(post.category ? [post.category.title] : []),
        ...(post.tags ?? []).map((tag) => tag.title),
      ];

      return {
        link: getPermalink(post.permalink, 'post'),
        title: post.title,
        description: post.excerpt,
        pubDate: post.publishDate,
        author: post.author,
        categories: categories.length ? categories : undefined,
        content,
      };
    })
  );
};
