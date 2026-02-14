import type {
  APIMessageTopLevelComponent,
  ButtonInteraction,
  JSONEncodable,
} from 'discord.js';

export type PaginationHandlerData<T> = {
  entries: T[];
  getComponent: (
    entries: T[],
    page: number,
  ) => JSONEncodable<APIMessageTopLevelComponent>;
  interaction: ButtonInteraction;
  paginationArguments: string[];
};
