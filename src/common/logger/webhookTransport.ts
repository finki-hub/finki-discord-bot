import type { LogEntry } from 'winston';

// eslint-disable-next-line n/no-extraneous-import
import TransportStream from 'winston-transport';

import { getConfigProperty } from '@/configuration/bot/index.js';

export class WebhookTransport extends TransportStream {
  private readonly errorWebhookUrl: string | undefined;

  constructor() {
    super({
      level: 'warn',
    });

    this.errorWebhookUrl = getConfigProperty('errorWebhook');
  }

  override log(info: LogEntry, callback: () => void): void {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (this.errorWebhookUrl === undefined) {
      callback();
      return;
    }

    if (info.level === 'error' || info.level === 'warn') {
      void this.sendToWebhook(info.message).finally(() => {
        callback();
      });
      return;
    }

    callback();
  }

  private async sendToWebhook(message: string): Promise<void> {
    if (this.errorWebhookUrl === undefined) {
      return;
    }

    try {
      await fetch(this.errorWebhookUrl, {
        body: JSON.stringify({
          content: message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    } catch {
      // Silently fail to avoid infinite loops if webhook fails
    }
  }
}
