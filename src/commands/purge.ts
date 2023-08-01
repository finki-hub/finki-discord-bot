import { commandDescriptions, errors } from "../utils/strings.js";
import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { setTimeout } from "node:timers/promises";

const name = "purge";
const permission = PermissionFlagsBits.ManageMessages;

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name])
  .addNumberOption((option) =>
    option
      .setName("count")
      .setDescription("Број на пораки (меѓу 1 и 100)")
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
  )
  .setDMPermission(false)
  .setDefaultMemberPermissions(permission);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (
    interaction.channel === null ||
    !interaction.channel.isTextBased() ||
    interaction.channel.isDMBased()
  ) {
    await interaction.editReply(errors.serverOnlyCommand);
    return;
  }

  const count = Math.round(interaction.options.getNumber("count", true));

  await interaction.editReply(`Бришам ${count} пораки...`);
  await setTimeout(500);
  await interaction.deleteReply();
  await interaction.channel?.bulkDelete(count);
};
