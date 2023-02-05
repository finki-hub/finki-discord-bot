import { client } from '../utils/client.js';
import {
  getFromBotConfig,
  getFromRoleConfig,
  getToken
} from '../utils/config.js';
import { logger } from '../utils/logger.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';

const [channelID, newlines] = process.argv.slice(2);

if (channelID === undefined) {
  throw new Error('Missing channel ID argument');
}

await client.login(getToken());

client.once('ready', async () => {
  logger.info('Bot is ready');

  const channel = client.channels.cache.get(channelID);
  const roles = getFromRoleConfig('notification');

  if (channel === undefined || !channel.isTextBased() || channel.isDMBased()) {
    throw new Error('The provided channel must be a guild text channel');
  }

  if (roles === undefined || roles.length === 0) {
    throw new Error('No notification roles have been provided');
  }

  const components: ActionRowBuilder<ButtonBuilder>[] = [];
  const embed = new EmbedBuilder()
    .setColor(getFromBotConfig('color'))
    .setTitle('Нотификации')
    .setThumbnail(getFromBotConfig('logo'))
    .setDescription('Изберете за кои типови на објави сакате да добиете нотификации.')
    .setFooter({ text: '(може да изберете повеќе опции)' });

  for (let i = 0; i < roles.length; i += 5) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    const buttons = [];

    for (let j = i; j < i + 5; j++) {
      if (roles[j] === undefined) {
        break;
      }

      const button = new ButtonBuilder()
        .setCustomId(`notification:${roles[j] ?? ''}`)
        .setLabel(roles[j] ?? '')
        .setStyle(ButtonStyle.Secondary);

      buttons.push(button);
    }

    row.addComponents(buttons);
    components.push(row);
  }

  try {
    if (newlines === undefined || Number.isNaN(newlines)) {
      await channel.send({
        components,
        embeds: [embed]
      });
    } else {
      await channel.send({
        components,
        content: '_ _\n'.repeat(Number(newlines)),
        embeds: [embed]
      });
    }
  } catch (error) {
    throw new Error(`Failed to send embed\n${error}`);
  }

  logger.info('Done');
  client.destroy();
});
