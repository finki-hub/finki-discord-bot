import { databaseErrorFunctions } from '../translations/database.js';
import { logger } from '../utils/logger.js';
import { database } from './database.js';
import { type Prisma } from '@prisma/client';

export const getRules = async () => {
  try {
    return await database.rule.findMany();
  } catch (error) {
    logger.error(databaseErrorFunctions.getRulesError(error));

    return null;
  }
};

export const createRule = async (rule?: Prisma.RuleCreateInput) => {
  if (rule === undefined) {
    return null;
  }

  try {
    return await database.rule.create({
      data: rule,
    });
  } catch (error) {
    logger.error(databaseErrorFunctions.createRuleError(error));

    return null;
  }
};

export const deleteRule = async (rule?: string) => {
  if (rule === undefined) {
    return null;
  }

  try {
    return await database.rule.delete({
      where: {
        rule,
      },
    });
  } catch (error) {
    logger.error(databaseErrorFunctions.deleteRuleError(error));

    return null;
  }
};
