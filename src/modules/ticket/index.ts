import { Cron } from 'croner';

import { logger } from '@/common/logger/index.js';
import { getIntervalsProperty } from '@/configuration/bot/index.js';
import { labels } from '@/translations/labels.js';

import { DATE_FORMATTER } from './utils/constants.js';
import { closeInactiveTickets } from './utils/tickets.js';

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

export const init = () => {
  const cronJobs: Cron[] = [];

  const ticketsCheckInterval = getIntervalsProperty('ticketsCheck');

  cronJobs.push(
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
      `Cron job ${job.name ?? labels.unknown} initialized. Next run: ${nextRun}`,
    );
  }
};
