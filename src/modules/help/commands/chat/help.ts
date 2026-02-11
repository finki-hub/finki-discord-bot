import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';

import { getMemberFromGuild } from '@/common/utils/guild.js';
import { client } from '@/core/client.js';
import {
  commandRequiresPermissions,
  getCommandsWithPermission,
} from '@/core/utils/permissions.js';
import { getHelpComponent } from '@/modules/help/components/components.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

export const name = 'help';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name]);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await client.application?.commands.fetch();

  let commands: string[];
  if (interaction.guild === null) {
    commands = Object.keys(commandDescriptions).filter(
      (command) => !commandRequiresPermissions(command),
    );
  } else {
    const member = await getMemberFromGuild(
      interaction.user.id,
      interaction.guild,
    );

    if (member === null) {
      await interaction.reply({
        content: commandErrors.commandNoPermission,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    commands = await getCommandsWithPermission(member);
  }

  await interaction.reply({
    components: [getHelpComponent(commands, 0)],
    flags: MessageFlags.IsComponentsV2,
  });
};
