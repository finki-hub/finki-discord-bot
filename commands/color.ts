import {
  type ChatInputCommandInteraction,
  type Role,
  SlashCommandBuilder
} from 'discord.js';
import { getFromRoleConfig } from '../utils/config.js';
import { isTextGuildBased } from '../utils/functions.js';

export const data = new SlashCommandBuilder()
  .setName('color')
  .setDescription('Color')
  .addSubcommand((command) => command
    .setName('statistics')
    .setDescription('Get color statistics'));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const guild = interaction.guild;
  const colorRoles = getFromRoleConfig('color');

  if (!isTextGuildBased(interaction.channel) || guild === null) {
    await interaction.editReply('You cannot use this command here.');
    return;
  }

  await guild.members.fetch();

  const roles = colorRoles.map((role) => guild.roles.cache.find((r) => r.name === role)) as Role[];
  const output = roles.map((role) => `${role.name}: ${role.members.size}`);

  // @ts-expect-error The split will always work
  output.sort((a, b) => Number.parseInt(b.split(':')[1].trim()) - Number.parseInt(a.split(':')[1].trim()));

  await interaction.editReply(output.join('\n'));
}
