import { Repository } from 'typeorm';

import { ArticleSourceType } from '../../src/domain/entities/article';
import { ArticleEntity } from '../../src/infrastructure/entities';

export const createArticlesFixture = async (
  repository: Repository<ArticleEntity>,
) => {
  const rssFeeds = [
    {
      title: 'Sample Article 1',
      state: {
        isRead: false,
        isFavorite: false,
        isArchived: false,
        isSaved: false,
      },
      link: 'https://example.com/article',
      description: 'A brief description of the article.',
      content: 'Detailed content of the article.',
      sourceType: ArticleSourceType.MANUAL,
      tags: [
        {
          id: 'tag1',
          label: 'Technology',
        },
      ],
      metadata: {
        guid: 'An guid value',
      },
    },
    {
      title: 'Sample Article 2',
      state: {
        isRead: false,
        isFavorite: true,
        isArchived: false,
        isSaved: false,
      },
      link: 'https://example.com/article2',
      description: 'A brief description of the article.',
      content: 'Detailed content of the article.',
      sourceType: ArticleSourceType.MANUAL,
      tags: [
        {
          id: 'tag1',
          label: 'Technology',
        },
      ],
      metadata: {
        auteur: 'value',
      },
    },
  ];
  return await repository.save(rssFeeds.map((data) => repository.create(data)));
};
