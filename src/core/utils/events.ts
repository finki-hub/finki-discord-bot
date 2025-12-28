import { readdirSync } from 'node:fs';

import { logger } from '@/common/logger/index.js';
import { ClientEventSchema } from '@/common/schemas/ClientEvent.js';

import { client } from '../client.js';

export const attachEventListeners = async () => {
  const eventFiles = readdirSync('./dist/core/events').filter((file) =>
    file.endsWith('.js'),
  );

  logger.debug(`Found ${eventFiles.length} event file(s)`);

  for (const file of eventFiles) {
    try {
      const rawEvent: unknown = await import(`../events/${file}`);
      const event = ClientEventSchema.parse(rawEvent);

      if (event.once) {
        client.once(event.name, event.execute);
      } else {
        client.on(event.name, event.execute);
      }

      logger.debug(
        `Attached event listener: ${event.name} (${event.once ? 'once' : 'on'})`,
      );
    } catch (error) {
      logger.error(
        `Failed to attach event listener from ${file}: ${String(error)}`,
      );
    }
  }
};
