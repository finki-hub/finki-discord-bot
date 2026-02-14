import { SlashCommandBuilder } from 'discord.js';

import { commandDescriptions } from '@/translations/commands.js';

export const name = 'help';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name]);

export { handleListCommands as execute } from '@/modules/list/commands/chat/list.js';
