import type { ChatInputCommandInteraction } from 'discord.js';

export const executeSubcommand = async (
  interaction: ChatInputCommandInteraction,
  handlers: Record<
    string,
    (interaction: ChatInputCommandInteraction) => Promise<void>
  >,
) => {
  const subcommand = interaction.options.getSubcommand(false);

  if (subcommand === null) {
    return;
  }

  const handler = handlers[subcommand];

  if (handler === undefined) {
    return;
  }

  await handler(interaction);
};
