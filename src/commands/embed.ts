import { logger } from "../utils/logger.js";
import { commandDescriptions, errors } from "../utils/strings.js";
import {
  type Channel,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

const name = "embed";
const permission = PermissionFlagsBits.ManageMessages;

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name])
  .addChannelOption((option) =>
    option.setName("channel").setDescription("Канал").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("json").setDescription("JSON").setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("timestamp")
      .setDescription("Дали да се додаде време?")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(permission);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const channel = interaction.options.getChannel("channel", true) as Channel;
  const json = interaction.options.getString("json", true);
  const timestamp = interaction.options.getBoolean("timestamp") ?? false;

  if (!channel.isTextBased() || channel.isDMBased()) {
    await interaction.editReply(errors.invalidChannel);
    return;
  }

  const parsed = JSON.parse(json);
  const embed = EmbedBuilder.from(parsed);

  if (timestamp) {
    embed.setTimestamp();
  }

  try {
    if (parsed.color !== undefined) {
      embed.setColor(parsed.color);
    }
  } catch {
    await interaction.editReply("Невалидна боја.");
    return;
  }

  try {
    await channel.send({ embeds: [embed] });

    await interaction.editReply("Креиран е embed.");
  } catch (error) {
    logger.error(`Error sending embed\n${error}`);

    await interaction.editReply("Креирањето embed беше неуспешно.");
  }
};
