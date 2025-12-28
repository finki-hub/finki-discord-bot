import { readdir } from 'node:fs/promises';

import { logger } from '@/common/logger/index.js';

import { ModuleSchema } from '../lib/Module.js';

export const getModules = async () => {
  try {
    const modulesContents = await readdir('./dist/modules', {
      withFileTypes: true,
    });

    const modules = modulesContents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    logger.debug(
      `Discovered ${modules.length} module(s): ${modules.join(', ')}`,
    );

    return modules;
  } catch (error) {
    logger.error(`Failed discovering modules\n${String(error)}`);
    return [];
  }
};

export const initializeModules = async () => {
  const modules = await getModules();

  if (modules.length === 0) {
    logger.warn('No modules found to initialize');
    return;
  }

  const modulesWithInit: string[] = [];
  const modulesWithoutInit: string[] = [];

  for (const module of modules) {
    try {
      const initFile = `../../modules/${module}/index.js`;

      const moduleExport: unknown = await import(initFile);
      const parseResult = ModuleSchema.safeParse(moduleExport);

      if (parseResult.success) {
        modulesWithInit.push(module);
      } else {
        modulesWithoutInit.push(module);
        logger.debug(`Module ${module} has no init function`);
      }
    } catch (error) {
      if (
        Error.isError(error) &&
        error.message.includes('Cannot find module')
      ) {
        modulesWithoutInit.push(module);
        logger.debug(`Module ${module} has no index file`);
        continue;
      }
    }
  }

  if (modulesWithoutInit.length > 0) {
    logger.debug(
      `Modules without init functions: ${modulesWithoutInit.join(', ')}`,
    );
  }

  const totalModules = modules.length;
  let initializedCount = totalModules;

  if (modulesWithInit.length > 0) {
    logger.info(
      `Initializing ${modulesWithInit.length} module(s) with init functions...`,
    );

    for (const module of modulesWithInit) {
      try {
        logger.debug(`Calling init function for module ${module}...`);

        const initFile = `../../modules/${module}/index.js`;

        const moduleExport: unknown = await import(initFile);
        const parseResult = ModuleSchema.safeParse(moduleExport);

        if (parseResult.success) {
          const moduleData = parseResult.data;
          const initResult = moduleData.init();
          await Promise.resolve(initResult);
          logger.info(`Module ${module} initialized successfully.`);
        }
      } catch (error) {
        logger.warn(`Failed initializing module ${module}\n${String(error)}`);
        initializedCount--;
      }
    }
  }

  logger.info(
    `Module initialization complete: ${initializedCount}/${totalModules} module(s) initialized`,
  );
};
