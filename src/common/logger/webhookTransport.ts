import type { LogEntry } from 'winston';

import { WebhookClient } from 'discord.js';
// eslint-disable-next-line n/no-extraneous-import
import TransportStream from 'winston-transport';

import { getConfigProperty } from '@/configuration/bot/index.js';

export class WebhookTransport extends TransportStream {
  private webhookClient: null | WebhookClient = null;
  private webhookUrl: string | undefined = undefined;

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
      void this.sendToWebhook(message).finally(() => {
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

  private initializeWebhook(): void {
    const errorWebhookUrl = getConfigProperty('errorWebhook');

    if (errorWebhookUrl === undefined) {
      this.webhookClient = null;
      this.webhookUrl = undefined;
      return;
    }

    // Only recreate if URL changed
    if (this.webhookUrl === errorWebhookUrl && this.webhookClient !== null) {
      return;
    }

    try {
      this.webhookClient = new WebhookClient({ url: errorWebhookUrl });
      this.webhookUrl = errorWebhookUrl;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed initializing error webhook:', error);
      this.webhookClient = null;
      this.webhookUrl = undefined;
    }
  }

  private async sendToWebhook(message: string): Promise<void> {
    this.initializeWebhook();

    if (this.webhookClient === null) {
      return;
    }

    try {
      await this.webhookClient.send({
        content: message,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed sending to error webhook:', error);
    }
  }
}
