import type { Dirent } from 'node:fs';

import { Collection, REST, Routes } from 'discord.js';
import { readdir } from 'node:fs/promises';

import { logger } from '@/common/logger/index.js';
import { getApplicationId, getToken } from '@/configuration/environment.js';

import {
  type AutocompleteCommand,
  type ButtonCommand,
  type ChatCommand,
  type ContextMenuCommand,
} from '../lib/Command.js';
import { getModules } from '../utils/modules.js';

const chatCommands = new Collection<string, ChatCommand>();
const buttonCommands = new Collection<string, ButtonCommand>();
const autocompleteCommands = new Collection<string, AutocompleteCommand>();
const contextCommands = new Collection<string, ContextMenuCommand>();

const getCommandImportPath = (dirent: Dirent) => {
  if (dirent.isDirectory()) {
    throw new Error(`Expected a file, but got a directory: ${dirent.name}`);
  }

  // Convert dist path to import path
  // dist/modules/<module>/commands/<type>/<file>.js -> ../../modules/<module>/commands/<type>/<file>
  const path = dirent.parentPath.replaceAll('\\', '/');
  return `${path.replace('dist', '../../')}/${dirent.name}`;
};

const getModuleCommands = async (module: string) => {
  try {
    const commandsContents = await readdir(
      `./dist/modules/${module}/commands`,
      {
        recursive: true,
        withFileTypes: true,
      },
    );

    return commandsContents.filter(
      (file) => file.isFile() && file.name.endsWith('.js'),
    );
  } catch (error) {
    logger.debug(
      `Failed reading commands directory for module ${module}\n${String(error)}`,
    );
    return [];
  }
};

const refreshCommands = async () => {
  chatCommands.clear();
  buttonCommands.clear();
  autocompleteCommands.clear();
  contextCommands.clear();

  const modules = await getModules();
  logger.debug(`Loading commands from ${modules.length} module(s)...`);

  let totalCommands = 0;

  for (const module of modules) {
    const commands = await getModuleCommands(module);

    if (commands.length > 0) {
      logger.debug(`Found ${commands.length} command(s) in module ${module}`);
    }

    for (const command of commands) {
      try {
        const importPath = getCommandImportPath(command);

        const commandData = (await import(importPath)) as
          | AutocompleteCommand
          | ButtonCommand
          | ChatCommand
          | ContextMenuCommand
          | { data?: { name: string }; name?: string };

        const commandName =
          'data' in commandData && commandData.data?.name
            ? commandData.data.name
            : commandData.name;

        if (!commandName) {
          logger.warn(
            `Command ${command.name} in module ${module} is missing 'name' property`,
          );
          continue;
        }

        const parentPath = command.parentPath.replaceAll('\\', '/');

        if (parentPath.endsWith('/chat') || parentPath.includes('/chat/')) {
          if (chatCommands.has(commandName)) {
            logger.warn(
              `Command with name ${commandName} already exists (from ${module})`,
            );
            continue;
          }
          chatCommands.set(commandName, commandData as ChatCommand);
          totalCommands++;
        } else if (
          parentPath.endsWith('/button') ||
          parentPath.includes('/button/')
        ) {
          if (buttonCommands.has(commandName)) {
            logger.warn(
              `Command with name ${commandName} already exists (from ${module})`,
            );
            continue;
          }
          buttonCommands.set(commandName, commandData as ButtonCommand);
          totalCommands++;
        } else if (
          parentPath.endsWith('/autocomplete') ||
          parentPath.includes('/autocomplete/')
        ) {
          if (autocompleteCommands.has(commandName)) {
            logger.warn(
              `Command with name ${commandName} already exists (from ${module})`,
            );
            continue;
          }
          autocompleteCommands.set(
            commandName,
            commandData as AutocompleteCommand,
          );
          totalCommands++;
        } else if (
          parentPath.endsWith('/context') ||
          parentPath.includes('/context/')
        ) {
          if (contextCommands.has(commandName)) {
            logger.warn(
              `Command with name ${commandName} already exists (from ${module})`,
            );
            continue;
          }
          contextCommands.set(commandName, commandData as ContextMenuCommand);
          totalCommands++;
        } else {
          throw new Error(`Unknown command type for ${command.name}`);
        }
      } catch (error) {
        logger.error(
          `Failed loading command ${command.name} from module ${module}\n${String(error)}`,
        );
      }
    }
  }

  logger.debug(
    `Commands loaded: ${chatCommands.size} chat, ${buttonCommands.size} button, ${autocompleteCommands.size} autocomplete, ${contextCommands.size} context (${totalCommands} total)`,
  );
};

export const getChatCommand = (name: string) => chatCommands.get(name);
export const getButtonCommand = (name: string) => buttonCommands.get(name);
export const getAutocompleteCommand = (name: string) =>
  autocompleteCommands.get(name);
export const getContextMenuCommand = (name: string) =>
  contextCommands.get(name);

export const registerCommands = async () => {
  await refreshCommands();

  const rest = new REST().setToken(getToken());
  const commandsToRegister = [];

  for (const [, command] of chatCommands) {
    commandsToRegister.push(command.data.toJSON());
  }

  for (const [, command] of contextCommands) {
    commandsToRegister.push(command.data.toJSON());
  }

  logger.info(
    `Registering ${commandsToRegister.length} command(s) with Discord...`,
  );

  try {
    await rest.put(Routes.applicationCommands(getApplicationId()), {
      body: commandsToRegister,
    });
    logger.info('Commands registered');
  } catch (error) {
    logger.error(`Failed registering application commands\n${String(error)}`);
  }
};
