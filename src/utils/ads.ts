import { Cron, scheduledJobs } from 'croner';

import type { Ad } from '../lib/schemas/Ad.js';

import { client } from '../client.js';
import { getConfigProperty } from '../configuration/main.js';
import { Channel } from '../lib/schemas/Channel.js';
import { logger } from '../logger.js';
import { labels } from '../translations/labels.js';
import {
  logErrorFunctions,
  logMessageFunctions,
  logMessages,
} from '../translations/logs.js';
import { getChannel } from './channels.js';
import { DATE_FORMATTER } from './cron/constants.js';

export const getAdByName = (name: string) => {
  const ads = getConfigProperty('ads');

  if (ads === undefined) {
    return {
      ad: null,
      job: null,
    };
  }

  const ad = ads.find((i) => i.name === name) ?? null;
  const job = scheduledJobs.find((i) => i.name === `sendAd-${name}`) ?? null;

  return {
    ad,
    job,
  };
};

export const createSendAdsJob = (ad: Ad) => async () => {
  for (const channelId of ad.channels) {
    try {
      if (ad.expiry !== undefined) {
        const adsExpiration = Date.parse(ad.expiry);

        if (adsExpiration <= Date.now()) {
          return;
        }
      }

      const channel = await client.channels.fetch(channelId);

      if (!channel?.isSendable()) {
        logger.warn(logMessageFunctions.channelNotSendable(channelId));

        return;
      }

      const recentMessages = await channel.messages.fetch({ limit: 5 });
      const isAdAlreadySent = recentMessages.some(
        (message) =>
          message.content === ad.content &&
          message.author.id === client.user?.id,
      );

      if (isAdAlreadySent) {
        logger.info(logMessageFunctions.adAlreadySent(ad.name, channelId));

        return;
      }

      const olderMessages = await channel.messages.fetch({ limit: 100 });
      const oldAdMessage = olderMessages.find(
        (message) =>
          message.content === ad.content &&
          message.author.id === client.user?.id,
      );

      if (oldAdMessage) {
        await oldAdMessage.delete();
        logger.info(
          logMessageFunctions.adDeleted(ad.name, channelId, oldAdMessage.id),
        );
      }

      await channel.send({
        allowedMentions: {
          parse: [],
        },
        content: ad.content,
      });

      const logsChannel = getChannel(Channel.Logs);
      await logsChannel?.send(logMessageFunctions.adSent(ad.name, channelId));
    } catch (error) {
      logger.error(logErrorFunctions.sendAdsError(error));
    }
  }
};

export const refreshAds = () => {
  for (const job of scheduledJobs) {
    if (!job.name?.includes('sendAd')) {
      continue;
    }

    job.stop();
  }

  const ads = getConfigProperty('ads');

  const cronJobs: Cron[] = [];

  for (const ad of ads ?? []) {
    cronJobs.push(
      new Cron(ad.cron, { name: `sendAd-${ad.name}` }, createSendAdsJob(ad)),
    );
  }

  for (const job of cronJobs) {
    const nextRunDate = job.nextRun();
    const nextRun =
      nextRunDate === null
        ? labels.unknown
        : DATE_FORMATTER.format(nextRunDate);

    logger.info(
      logMessageFunctions.cronJobInitialized(
        job.name ?? labels.unknown,
        nextRun,
      ),
    );
  }

  logger.info(logMessages.adsInitialized);
};
