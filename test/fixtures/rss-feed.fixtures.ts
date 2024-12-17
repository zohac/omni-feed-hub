import { Repository } from 'typeorm';

import { RssFeedEntity } from '../../src/infrastructure/entities';

export const createRssFeedFixture = async (
  repository: Repository<RssFeedEntity>,
) => {
  const rssFeeds = [
    {
      id: undefined,
      title: 'Feed 1',
      url: 'http://example.com/feed1',
      description: 'Description 1',
      collectionId: 1,
    },
    {
      id: undefined,
      title: 'Feed 2',
      url: 'http://example.com/feed2',
      description: 'Description 2',
    },
  ];
  return await repository.save(rssFeeds.map((data) => repository.create(data)));
};
