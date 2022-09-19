import {
  ChannelType,
  inlineCode
} from 'discord.js';
import { client } from '../utils/client.js';
import {
  getAllSubjects,
  getFromBotConfig
} from '../utils/config.js';
import { logger } from '../utils/logger.js';

const [channelID] = process.argv.slice(2);

if (channelID === undefined) {
  throw new Error('Missing channel ID argument');
}

await client.login(getFromBotConfig('token'));

client.once('ready', async () => {
  logger.info('Bot is ready');

  const channel = client.channels.cache.get(channelID);

  if (channel === undefined || channel.type !== ChannelType.GuildForum) {
    throw new Error('The provided channel must be a guild forum channel');
  }

  for (const subject of getAllSubjects()) {
    await channel.threads.create({
      message: {
        content: `Овој канал е за предметот ${inlineCode(subject)}.`
      },
      name: subject
    });
  }

  logger.info('Done');
  client.destroy();
});
