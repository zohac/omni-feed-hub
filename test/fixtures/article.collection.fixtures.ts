import { Repository } from 'typeorm';

import { ArticleCollectionEntity } from '../../src/infrastructure/entities';

export const createArticleCollectionFixture = async (
  repository: Repository<ArticleCollectionEntity>,
) => {
  const rssFeedCollection = [
    { name: 'Article Collection 1' },
    { name: 'Article Collection 2', description: 'An articles collection' },
  ];

  return await repository.save(
    rssFeedCollection.map((data) => repository.create(data)),
  );
};
