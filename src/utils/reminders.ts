import { type Reminder } from '@prisma/client';
import { userMention } from 'discord.js';

import { client } from '../client.js';
import { deleteReminder, getReminders } from '../data/database/Reminder.js';
import { logger } from '../logger.js';
import { labels } from '../translations/labels.js';
import { logErrorFunctions } from '../translations/logs.js';

export const sendReminders = async () => {
  let reminders: null | Reminder[] = null;

  try {
    reminders = await getReminders();
  } catch (error) {
    logger.error(logErrorFunctions.reminderLoadError(error));
    return;
  }

  if (reminders === null) {
    return;
  }

  for (const reminder of reminders) {
    if (reminder.timestamp.getTime() > Date.now()) {
      continue;
    }

    try {
      if (reminder.privateMessage) {
        const user = await client.users.fetch(reminder.userId);
        await user.send(`${labels.reminder}: ${reminder.description}`);
      } else if (reminder.channelId !== null) {
        const channel = await client.channels.fetch(reminder.channelId);
        if (channel?.isSendable()) {
          await channel.send({
            allowedMentions: {
              parse: ['users'],
            },
            content: `${userMention(reminder.userId)} ${labels.reminder}: ${reminder.description}`,
          });
        }
      }
    } catch (error) {
      logger.error(logErrorFunctions.reminderSendError(reminder.id, error));
    }

    try {
      await deleteReminder(reminder.id);
    } catch (error) {
      logger.error(logErrorFunctions.reminderDeleteError(reminder.id, error));
    }
  }
};
