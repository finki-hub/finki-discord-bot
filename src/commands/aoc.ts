import {
  AttachmentBuilder,
  type ChatInputCommandInteraction,
  heading,
  HeadingLevel,
  LabelBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

import { GetAocProblemOptionsSchema } from '../lib/schemas/Aoc.js';
import {
  commandDescriptions,
  commandErrors,
} from '../translations/commands.js';
import {
  getAocBonusProblem,
  getAocLeaderboard,
  getAocProblem,
} from '../utils/aoc/requests.js';
import { formatAocProblem } from '../utils/aoc/utils.js';

const name = 'aoc';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('AOC')
  .addSubcommand((command) =>
    command
      .setName('problem')
      .setDescription(commandDescriptions['aoc problem']),
  )
  .addSubcommand((command) =>
    command.setName('submit').setDescription(commandDescriptions['aoc submit']),
  )
  .addSubcommand((command) =>
    command.setName('bonus').setDescription(commandDescriptions['aoc bonus']),
  )
  .addSubcommand((command) =>
    command
      .setName('submit-bonus')
      .setDescription(commandDescriptions['aoc submit-bonus']),
  )
  .addSubcommand((command) =>
    command
      .setName('leaderboard')
      .setDescription(commandDescriptions['aoc leaderboard']),
  );

const handleAocProblem = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;
  const userTag = interaction.user.tag;

  const options = GetAocProblemOptionsSchema.parse({
    userId,
    userTag,
  });

  const problem = await getAocProblem(options);

  if (problem === null) {
    await interaction.editReply(commandErrors.aocProblemNotFound);

    return;
  }

  const userInputFile = new AttachmentBuilder(
    Buffer.from(problem.userInput, 'utf8'),
    {
      name: 'user_input.txt',
    },
  );

  await interaction.editReply({
    content: formatAocProblem(problem),
    files: [userInputFile],
  });
};

const handleAocBonus = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;
  const userTag = interaction.user.tag;

  const options = GetAocProblemOptionsSchema.parse({
    userId,
    userTag,
  });

  const problem = await getAocBonusProblem(options);

  if (problem === null) {
    await interaction.editReply(commandErrors.aocProblemNotFound);

    return;
  }

  const userInputFile = new AttachmentBuilder(
    Buffer.from(problem.userInput, 'utf8'),
    {
      name: 'user_input.txt',
    },
  );

  await interaction.editReply({
    content: formatAocProblem(problem),
    files: [userInputFile],
  });
};

const handleAocSubmitBonus = async (
  interaction: ChatInputCommandInteraction,
) => {
  const answerInput = new TextInputBuilder()
    .setCustomId('aoc-bonus-answer')
    .setPlaceholder('Enter your bonus answer here...')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const labeledInput = new LabelBuilder()
    .setLabel('Your Bonus Answer')
    .setTextInputComponent(answerInput);

  const modal = new ModalBuilder()
    .setCustomId('aoc-submit-bonus-modal')
    .setTitle('Submit AOC Bonus Answer')
    .addLabelComponents(labeledInput);

  await interaction.showModal(modal);
};

const handleAocSubmit = async (interaction: ChatInputCommandInteraction) => {
  const answerInput = new TextInputBuilder()
    .setCustomId('aoc-answer')
    .setPlaceholder('Enter your answer here...')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const labeledInput = new LabelBuilder()
    .setLabel('Your Answer')
    .setTextInputComponent(answerInput);

  const modal = new ModalBuilder()
    .setCustomId('aoc-submit-modal')
    .setTitle('Submit AOC Answer')
    .addLabelComponents(labeledInput);

  await interaction.showModal(modal);
};

const handleAocLeaderboard = async (
  interaction: ChatInputCommandInteraction,
) => {
  const leaderboard = await getAocLeaderboard();

  if (leaderboard === null) {
    await interaction.editReply(commandErrors.aocLeaderboardNotFound);

    return;
  }

  if (leaderboard.data.length === 0) {
    await interaction.editReply('The leaderboard is empty.');

    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const leaderboardText = leaderboard.data
    .map((entry, index) => {
      const medal = index < 3 ? `${medals[index]} ` : '';
      return `${medal}**${entry.rank}.** <@${entry.discordId}> - ${entry.totalScore} points`;
    })
    .join('\n');

  const content = [
    heading('AOC Leaderboard', HeadingLevel.One),
    '',
    leaderboardText,
  ].join('\n');

  await interaction.editReply(content);
};

const aocHandlers = {
  bonus: handleAocBonus,
  leaderboard: handleAocLeaderboard,
  problem: handleAocProblem,
  submit: handleAocSubmit,
  'submit-bonus': handleAocSubmitBonus,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand in aocHandlers) {
    await aocHandlers[subcommand as keyof typeof aocHandlers](interaction);
  }
};
