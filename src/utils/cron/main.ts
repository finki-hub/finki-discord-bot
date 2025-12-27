import { Cron } from 'croner';

import { getIntervalsProperty } from '../../configuration/main.js';
import { logger } from '../../logger.js';
import { labels } from '../../translations/labels.js';
import { logMessageFunctions } from '../../translations/logs.js';
import { sendReminders } from '../reminders.js';
import { closeInactiveTickets } from '../tickets.js';
import { DATE_FORMATTER } from './constants.js';

const convertMillisecondsToCronJob = (ms: number) => {
  // check if the interval is less than a minute
  if (ms < 60_000) {
    return `*/${ms / 1_000} * * * * *`;
  }

  // check if the interval is less than an hour
  if (ms < 3_600_000) {
    return `*/${ms / 60_000} * * * *`;
  }

  // check if the interval is less than a day
  if (ms < 86_400_000) {
    return `0 */${ms / 3_600_000} * * *`;
  }

  // check if the interval is less than a month
  if (ms < 2_592_000_000) {
    return `0 0 */${ms / 86_400_000} * *`;
  }

  // check if the interval is less than a year
  if (ms < 31_536_000_000) {
    return `0 0 0 */${ms / 2_592_000_000} *`;
  }

  return '0 0 0 0 0';
};

export const initializeCronJobs = () => {
  const cronJobs: Cron[] = [];

  const sendRemindersInterval = getIntervalsProperty('sendReminders');
  const ticketsCheckInterval = getIntervalsProperty('ticketsCheck');

  cronJobs.push(
    new Cron(
      convertMillisecondsToCronJob(sendRemindersInterval),
      { name: 'sendReminders' },
      sendReminders,
    ),
    new Cron(
      convertMillisecondsToCronJob(ticketsCheckInterval),
      { name: 'closeInactiveTickets' },
      closeInactiveTickets,
    ),
  );

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
};
