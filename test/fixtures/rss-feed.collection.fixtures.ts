import { Repository } from 'typeorm';

import { RssFeedCollectionEntity } from '../../src/infrastructure/entities';

export const createRssFeedCollectionFixture = async (
  repository: Repository<RssFeedCollectionEntity>,
) => {
  const rssFeedCollection = [
    { name: 'Collection 1' },
    { name: 'Collection 2', description: 'Une collection de flux rss' },
  ];

  return await repository.save(
    rssFeedCollection.map((data) => repository.create(data)),
  );
};
