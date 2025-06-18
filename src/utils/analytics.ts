import type { ChatInputCommandInteraction } from 'discord.js';

import { getAnalyticsUrl, getApiKey } from '../configuration/environment.js';
import {
  IngestResponseSchema,
  type UsageEvent,
  UsageEventSchema,
} from '../lib/schemas/Analytics.js';
import { logger } from '../logger.js';
import { logErrorFunctions } from '../translations/logs.js';

const logEvent = async (event: UsageEvent) => {
  const url = getAnalyticsUrl();
  const apiKey = getApiKey();

  if (url === null || apiKey === null) {
    return null;
  }

  try {
    const res = await fetch(`${url}/events/ingest`, {
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'POST',
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return IngestResponseSchema.parse(json);
  } catch (error) {
    logger.error(logErrorFunctions.logAnalyticsError(error));

    return null;
  }
};

export const logCommandEvent = async (
  interaction: ChatInputCommandInteraction,
  eventType: string,
  basePayload: Record<string, unknown>,
  logContext = true,
) => {
  if (!interaction.channel?.isTextBased()) {
    return;
  }

  const targetUser = interaction.options.getUser('user') ?? null;
  const metadata: Record<string, unknown> = {
    callerId: interaction.user.id,
    channelId: interaction.channel.id,
    commandName: interaction.commandName,
    guildId: interaction.guild?.id ?? null,
  };

  const payload: Record<string, unknown> = { ...basePayload };

  if (targetUser) {
    metadata['targetUserId'] = targetUser.id;

    const fetched = await interaction.channel.messages.fetch({
      limit: 20,
    });

    const userMessages = Array.from(fetched.values()).filter(
      (m) => m.author.id === targetUser.id,
    );

    if (userMessages.length > 0) {
      userMessages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
      const last = userMessages[0];

      payload['targetUserMessage'] =
        last === undefined
          ? null
          : {
              content: last.content,
              messageId: last.id,
              timestamp: new Date(last.createdTimestamp).toISOString(),
            };
    }
  } else if (logContext) {
    const fetched = await interaction.channel.messages.fetch({ limit: 10 });
    const now = Date.now();
    const context = Array.from(fetched.values())
      .filter((m) => !m.author.bot && now - m.createdTimestamp < 15 * 60_000)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
      .slice(-5)
      .map((m) => ({
        authorId: m.author.id,
        content: m.content,
        messageId: m.id,
        timestamp: new Date(m.createdTimestamp).toISOString(),
      }));

    if (context.length > 0) {
      payload['context'] = context;
    }
  }

  const event = UsageEventSchema.parse({
    eventType,
    metadata,
    payload,
  });

  await logEvent(event);
};
