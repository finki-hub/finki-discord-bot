import {
  type ChatInputCommandInteraction,
  codeBlock,
  SlashCommandBuilder,
} from 'discord.js';
import { z } from 'zod';

import {
  getQuestionComponents,
  getQuestionEmbed,
} from '../components/commands.js';
import {
  createLink,
  deleteLink,
  getLink,
  getLinks,
  updateLink,
} from '../data/api/Link.js';
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
} from '../data/api/Question.js';
import {
  createAnto,
  createAntos,
  deleteAnto,
  getAntos,
} from '../data/database/Anto.js';
import { AntosSchema } from '../lib/schemas/Anto.js';
import { CreateLinkSchema, UpdateLinkSchema } from '../lib/schemas/Link.js';
import {
  CreateQuestionSchema,
  UpdateQuestionSchema,
} from '../lib/schemas/Question.js';
import { logger } from '../logger.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponses,
} from '../translations/commands.js';
import { labels } from '../translations/labels.js';
import { logErrorFunctions } from '../translations/logs.js';
import { getNormalizedUrl } from '../utils/links.js';
import { safeReplyToInteraction } from '../utils/messages.js';
import { LINK_REGEX } from '../utils/regex.js';

const name = 'manage';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Менаџирај')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('question-set')
      .setDescription(commandDescriptions['manage question-set'])
      .addStringOption((option) =>
        option
          .setName('question')
          .setDescription('Прашање')
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addStringOption((option) =>
        option.setName('answer').setDescription('Одговор').setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('links')
          .setDescription('Линкови во JSON формат')
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('question-delete')
      .setDescription(commandDescriptions['manage question-delete'])
      .addStringOption((option) =>
        option
          .setName('question')
          .setDescription('Прашање')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('question-content')
      .setDescription(commandDescriptions['manage question-content'])
      .addStringOption((option) =>
        option
          .setName('question')
          .setDescription('Прашање')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('question-dump')
      .setDescription(commandDescriptions['manage question-dump']),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('link-set')
      .setDescription(commandDescriptions['manage link-set'])
      .addStringOption((option) =>
        option
          .setName('link')
          .setDescription('Име на линк')
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addStringOption((option) =>
        option
          .setName('url')
          .setDescription('Линк до ресурс')
          .setRequired(true),
      )
      .addStringOption((option) =>
        option.setName('description').setDescription('Опис').setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('link-delete')
      .setDescription(commandDescriptions['manage link-delete'])
      .addStringOption((option) =>
        option
          .setName('link')
          .setDescription('Линк')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('link-content')
      .setDescription(commandDescriptions['manage link-content'])
      .addStringOption((option) =>
        option
          .setName('link')
          .setDescription('Линк')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('link-dump')
      .setDescription(commandDescriptions['manage link-dump']),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('anto-add')
      .setDescription(commandDescriptions['manage anto-add'])
      .addStringOption((option) =>
        option.setName('anto').setDescription('Анто').setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('anto-delete')
      .setDescription(commandDescriptions['manage anto-delete'])
      .addStringOption((option) =>
        option.setName('anto').setDescription('Анто').setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('anto-mass-add')
      .setDescription(commandDescriptions['manage anto-mass-add'])
      .addStringOption((option) =>
        option
          .setName('antos')
          .setDescription('Анто-и во JSON формат')
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('anto-dump')
      .setDescription(commandDescriptions['manage anto-dump']),
  );

const handleManageQuestionSet = async (
  interaction: ChatInputCommandInteraction,
) => {
  const keyword = interaction.options.getString('question', true);
  const answer = interaction.options
    .getString('answer', true)
    .replaceAll(String.raw`\n`, '\n');
  const links = interaction.options.getString('links') ?? '{}';
  const question = await getQuestion(keyword);

  const { data: parsedLinks, error: parseError } = z
    .record(z.string(), z.string())
    .safeParse(JSON.parse(links));

  if (parseError !== undefined) {
    await interaction.editReply(commandErrors.invalidLinks);

    return;
  }

  if (question === null) {
    const newQuestion = CreateQuestionSchema.parse({
      content: answer,
      links: parsedLinks,
      name: keyword,
      userId: interaction.user.id,
    });

    const createdQuestion = await createQuestion(newQuestion);

    if (createdQuestion === null) {
      await interaction.editReply(commandErrors.faqCreationFailed);

      return;
    }

    try {
      const questionEmbed = getQuestionEmbed(createdQuestion);
      const questionComponents = getQuestionComponents(createdQuestion);
      await interaction.editReply({
        components: questionComponents,
        embeds: [questionEmbed],
      });
    } catch (error) {
      logger.error(logErrorFunctions.faqSendError(error));
      await interaction.editReply(commandErrors.faqSendFailed);
    }

    return;
  }

  const updatedQuestionSchema = UpdateQuestionSchema.parse({
    content: answer,
    links: parsedLinks,
    name: keyword,
    userId: interaction.user.id,
  });
  await updateQuestion(question.name, updatedQuestionSchema);

  const updatedQuestion = await getQuestion(keyword);

  if (updatedQuestion === null) {
    await interaction.editReply(commandErrors.faqCreationFailed);

    return;
  }

  try {
    const embed = getQuestionEmbed(updatedQuestion);
    const components = getQuestionComponents(updatedQuestion);
    await interaction.editReply({
      components,
      embeds: [embed],
    });
  } catch (error) {
    logger.error(logErrorFunctions.faqSendError(error));
    await interaction.editReply(commandErrors.faqSendFailed);
  }
};

const handleManageQuestionDelete = async (
  interaction: ChatInputCommandInteraction,
) => {
  const keyword = interaction.options.getString('question', true);
  const question = await getQuestion(keyword);

  if (question === null) {
    await interaction.editReply(commandErrors.faqNotFound);

    return;
  }

  await deleteQuestion(keyword);
  await interaction.editReply(commandResponses.faqDeleted);
};

const handleManageQuestionContent = async (
  interaction: ChatInputCommandInteraction,
) => {
  const keyword = interaction.options.getString('question', true);
  const question = await getQuestion(keyword);

  if (question === null) {
    await interaction.editReply(commandErrors.faqNotFound);

    return;
  }

  const content = `Име:${codeBlock(question.name)}\nОдговор:${codeBlock(
    question.content.replaceAll('\n', String.raw`\n`),
  )}\nЛинкови:${codeBlock(JSON.stringify(question.links, null, 2))}`;

  await safeReplyToInteraction(interaction, content);
};

const handleManageQuestionDump = async (
  interaction: ChatInputCommandInteraction,
) => {
  const questions = await getQuestions();

  if (questions === null) {
    await interaction.editReply(commandErrors.faqNotFound);

    return;
  }

  await interaction.editReply({
    files: [
      {
        attachment: Buffer.from(JSON.stringify(questions, null, 2)),
        name: 'faqs.json',
      },
    ],
  });
};

const handleManageLinkSet = async (
  interaction: ChatInputCommandInteraction,
) => {
  const keyword = interaction.options.getString('link', true);
  const description = interaction.options
    .getString('description')
    ?.replaceAll(String.raw`\n`, '\n');
  const url = interaction.options.getString('url', true);
  const link = await getLink(keyword);

  if (!LINK_REGEX.test(url)) {
    await interaction.editReply(commandErrors.invalidLink);

    return;
  }

  if (link === null) {
    const newLink = CreateLinkSchema.parse({
      description: description ?? null,
      name: keyword,
      url,
      userId: interaction.user.id,
    });

    const createdLink = await createLink(newLink);

    if (createdLink === null) {
      await interaction.editReply(commandErrors.linkCreationFailed);

      return;
    }

    try {
      await interaction.editReply(getNormalizedUrl(createdLink.url));
    } catch (error) {
      logger.error(logErrorFunctions.linkSendError(error));
      await interaction.editReply(commandErrors.linkSendFailed);
    }

    return;
  }

  const updatedLinkSchema = UpdateLinkSchema.parse({
    description: description ?? link.description,
    name: keyword,
    url,
    userId: interaction.user.id,
  });
  await updateLink(link.name, updatedLinkSchema);

  const updatedLink = await getLink(keyword);

  if (updatedLink === null) {
    await interaction.editReply(commandErrors.linkCreationFailed);

    return;
  }

  try {
    await interaction.editReply(getNormalizedUrl(updatedLink.url));
  } catch (error) {
    logger.error(logErrorFunctions.linkSendError(error));
    await interaction.editReply(commandErrors.linkSendFailed);
  }
};

const handleManageLinkDelete = async (
  interaction: ChatInputCommandInteraction,
) => {
  const keyword = interaction.options.getString('link', true);
  const link = await getLink(keyword);

  if (link === null) {
    await interaction.editReply(commandErrors.linkNotFound);

    return;
  }

  await deleteLink(keyword);
  await interaction.editReply(commandResponses.linkDeleted);
};

const handleManageLinkContent = async (
  interaction: ChatInputCommandInteraction,
) => {
  const keyword = interaction.options.getString('link', true);
  const link = await getLink(keyword);

  if (link === null) {
    await interaction.editReply(commandErrors.linkNotFound);

    return;
  }

  await interaction.editReply(
    `Име:${codeBlock(link.name)}\nОпис:${codeBlock(
      link.description?.replaceAll('\n', String.raw`\n`) ?? labels.none,
    )}\nЛинк:${codeBlock(link.url)}`,
  );
};

const handleManageLinkDump = async (
  interaction: ChatInputCommandInteraction,
) => {
  const links = await getLinks();

  if (links === null) {
    await interaction.editReply(commandErrors.linkNotFound);

    return;
  }

  await interaction.editReply({
    files: [
      {
        attachment: Buffer.from(JSON.stringify(links, null, 2)),
        name: 'links.json',
      },
    ],
  });
};

const handleManageAntoAdd = async (
  interaction: ChatInputCommandInteraction,
) => {
  const anto = interaction.options.getString('anto', true);
  const createdAnto = await createAnto({
    quote: anto,
    userId: interaction.user.id,
  });

  if (createdAnto === null) {
    await interaction.editReply(commandErrors.antoCreationFailed);

    return;
  }

  await interaction.editReply(createdAnto.quote);
};

const handleManageAntoDelete = async (
  interaction: ChatInputCommandInteraction,
) => {
  const anto = interaction.options.getString('anto', true);
  const deletedAnto = await deleteAnto(anto);

  if (deletedAnto === null) {
    await interaction.editReply(commandErrors.antoNotFound);

    return;
  }

  await interaction.editReply(commandResponses.antoDeleted);
};

const handleManageAntoMassAdd = async (
  interaction: ChatInputCommandInteraction,
) => {
  const antos = interaction.options.getString('antos', true);
  let parsedAntos;

  try {
    parsedAntos = AntosSchema.parse(JSON.parse(antos));
  } catch (error) {
    logger.error(logErrorFunctions.antosParseError(error));
    await interaction.editReply(commandErrors.invalidAntos);

    return;
  }

  const createdAntos = await createAntos(
    parsedAntos.map((anto) => ({
      quote: anto,
      userId: interaction.user.id,
    })),
  );

  if (createdAntos === null) {
    await interaction.editReply(commandErrors.antosCreationFailed);

    return;
  }

  await interaction.editReply(commandResponses.antosCreated);
};

const handleManageAntoDump = async (
  interaction: ChatInputCommandInteraction,
) => {
  const antos = await getAntos();

  if (antos === null) {
    await interaction.editReply(commandErrors.antoNotFound);

    return;
  }

  await interaction.editReply({
    files: [
      {
        attachment: Buffer.from(JSON.stringify(antos, null, 2)),
        name: 'antos.json',
      },
    ],
  });
};

const manageHandlers = {
  'anto-add': handleManageAntoAdd,
  'anto-delete': handleManageAntoDelete,
  'anto-dump': handleManageAntoDump,
  'anto-mass-add': handleManageAntoMassAdd,
  'link-content': handleManageLinkContent,
  'link-delete': handleManageLinkDelete,
  'link-dump': handleManageLinkDump,
  'link-set': handleManageLinkSet,
  'question-content': handleManageQuestionContent,
  'question-delete': handleManageQuestionDelete,
  'question-dump': handleManageQuestionDump,
  'question-set': handleManageQuestionSet,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand in manageHandlers) {
    await manageHandlers[subcommand as keyof typeof manageHandlers](
      interaction,
    );
  }
};
