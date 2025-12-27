import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { type BotConfig, BotConfigSchema } from '../lib/schemas/BotConfig.js';
import { logger } from '../logger.js';
import { configErrorFunctions } from '../translations/errors.js';

const CONFIG_FILE_PATH = join(process.cwd(), 'config', 'bot.json');

export const getConfig = async (): Promise<BotConfig | null> => {
  try {
    const fileContent = await readFile(CONFIG_FILE_PATH, 'utf8');
    const parsed: unknown = JSON.parse(fileContent);

    return BotConfigSchema.parse(parsed);
  } catch (error) {
    if (error instanceof Error && error.name === 'SyntaxError') {
      return null;
    }

    logger.error(`Failed reading config file\n${String(error)}`);

    return null;
  }
};

export const setConfig = async (
  config: BotConfig,
): Promise<BotConfig | null> => {
  try {
    const validated = BotConfigSchema.parse(config);
    const jsonContent = JSON.stringify(validated, null, 2);

    // Ensure config directory exists
    await mkdir(dirname(CONFIG_FILE_PATH), { recursive: true });

    await writeFile(CONFIG_FILE_PATH, jsonContent, 'utf8');

    return validated;
  } catch (error) {
    logger.error(`Failed writing config file\n${String(error)}`);
    logger.warn(configErrorFunctions.invalidConfiguration(error));

    return null;
  }
};
