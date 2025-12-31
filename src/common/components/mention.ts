import { TextDisplayBuilder, type User } from 'discord.js';

import { commandResponseFunctions } from '@/translations/commands.js';

export const getMentionComponent = (user: User) =>
  new TextDisplayBuilder().setContent(
    commandResponseFunctions.commandFor(user.id),
  );
