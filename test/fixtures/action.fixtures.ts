import { Repository } from 'typeorm';

import { ActionType } from '../../src/domain/enums/action.type';
import { ActionEntity } from '../../src/infrastructure/entities';

export const createActionFixtures = async (
  repository: Repository<ActionEntity>,
) => {
  const agents = [
    {
      id: undefined,
      name: 'Action 1',
      type: ActionType.ASSIGN_TO_COLLECTION,
      collection: {
        id: undefined,
        name: 'Collection 1 for action 1',
        description: 'Description of Collection 1',
      },
    },
    {
      id: undefined,
      name: 'Action 2',
      type: ActionType.ASSIGN_TO_COLLECTION,
      collection: {
        id: undefined,
        name: 'Collection 2 for action 2',
        description: 'Description of Collection 2',
      },
    },
  ];

  return await repository.save(agents.map((data) => repository.create(data)));
};
