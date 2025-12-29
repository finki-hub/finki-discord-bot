import type { LogEntry } from 'winston';

import { WebhookClient } from 'discord.js';
import TransportStream from 'winston-transport';

import { getConfigProperty } from '@/configuration/bot/index.js';

export class WebhookTransport extends TransportStream {
  private readonly webhookClients = new Map<string, WebhookClient>();

  constructor() {
    super({
      level: 'warn',
    });
  }

  override log(info: LogEntry, callback: () => void): void {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (info.level === 'error' || info.level === 'warn') {
      const message = this.formatMessage(info);
      const guildId =
        'guildId' in info && typeof info['guildId'] === 'string'
          ? info['guildId']
          : null;
      void this.sendToWebhook(message, guildId).finally(() => {
        callback();
      });
      return;
    }

    callback();
  }

  // eslint-disable-next-line class-methods-use-this
  private formatMessage(info: LogEntry): string {
    const timestamp =
      typeof info['timestamp'] === 'string'
        ? info['timestamp']
        : new Date().toISOString().replace('T', ' ').slice(0, 19);
    const level = info.level;
    const message = info.message;
    const stack =
      'stack' in info && typeof info['stack'] === 'string'
        ? info['stack']
        : undefined;

    return `${timestamp} - ${level}: ${stack ?? message}`;
  }

  private async getWebhookClient(
    guildId: null | string,
  ): Promise<null | WebhookClient> {
    if (guildId === null) {
      return null;
    }

    const webhookUrl = await getConfigProperty('errorWebhook', guildId);

    if (webhookUrl === undefined) {
      return null;
    }

    if (this.webhookClients.has(webhookUrl)) {
      return this.webhookClients.get(webhookUrl) ?? null;
    }

    try {
      const webhookClient = new WebhookClient({ url: webhookUrl });
      this.webhookClients.set(webhookUrl, webhookClient);
      return webhookClient;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `Failed initializing error webhook for guild ${guildId}:`,
        error,
      );
      return null;
    }
  }

  private async sendToWebhook(
    message: string,
    guildId: null | string,
  ): Promise<void> {
    const webhookClient = await this.getWebhookClient(guildId);

    if (webhookClient === null) {
      return;
    }

    try {
      await webhookClient.send({
        content: message,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed sending to error webhook:', error);
      for (const [url, cachedClient] of this.webhookClients.entries()) {
        if (cachedClient === webhookClient) {
          this.webhookClients.delete(url);
          break;
        }
      }
    }
  }
}
