import { getAnalyticsUrl } from '../configuration/environment.js';
import {
  IngestResponseSchema,
  type UsageEvent,
} from '../lib/schemas/Analytics.js';
import { logger } from '../logger.js';
import { logErrorFunctions } from '../translations/logs.js';

export const logEvent = async (event: UsageEvent) => {
  const url = getAnalyticsUrl();

  if (url === null) {
    return null;
  }

  try {
    const res = await fetch(`${url}/events/ingest`, {
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json',
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
