import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
} from 'discord.js';

import { getCommandMention } from '@/common/commands/utils.js';
import { getThemeColor } from '@/configuration/bot/index.js';
import { embedMessageFunctions } from '@/translations/embeds.js';
import { labels } from '@/translations/labels.js';

import type { Link } from '../schemas/Link.js';
import type { Question } from '../schemas/Question.js';

import { getNormalizedUrl } from '../utils/links.js';

export const getQuestionEmbed = (question: Question) =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle(question.name)
    .setDescription(question.content)
    .setTimestamp();

export const getQuestionComponents = (question: Question) => {
  const components: Array<ActionRowBuilder<ButtonBuilder>> = [];

  if (question.links === null) {
    return components;
  }

  const links = Object.entries(question.links);

  for (let index1 = 0; index1 < links.length; index1 += 5) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    const buttons = [];

    for (let index2 = index1; index2 < index1 + 5; index2++) {
      const [name, url] = links[index2] ?? [];
      if (
        name === undefined ||
        url === undefined ||
        name === '' ||
        url === ''
      ) {
        break;
      }

      const button = new ButtonBuilder()
        .setURL(getNormalizedUrl(url))
        .setLabel(name)
        .setStyle(ButtonStyle.Link);

      buttons.push(button);
    }

    row.addComponents(buttons);
    components.push(row);
  }

  return components;
};

export const getListQuestionsEmbed = (questions: Question[]) =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle(labels.questions)
    .setDescription(
      `${embedMessageFunctions.allQuestions(
        getCommandMention('faq'),
      )}\n\n${questions
        .map(
          (question, index) =>
            `${inlineCode((index + 1).toString().padStart(2, '0'))} ${
              question.name
            }`,
        )
        .join('\n')}`,
    )
    .setTimestamp();

export const getListLinksEmbed = (links: Link[]) =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle(labels.links)
    .setDescription(
      `${embedMessageFunctions.allLinks(getCommandMention('link'))}\n\n${links
        .map(
          (link, index) =>
            `${inlineCode((index + 1).toString().padStart(2, '0'))} [${
              link.name
            }](${link.url})`,
        )
        .join('\n')}`,
    )
    .setTimestamp();
