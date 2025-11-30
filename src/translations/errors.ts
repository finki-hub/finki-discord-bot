/* eslint-disable @typescript-eslint/restrict-template-expressions */

export const configErrors = {
  noApplicationId: 'APPLICATION_ID environment variable is not defined',
  noDatabaseUrl: 'DATABASE_URL environment variable is not defined',
  noToken: 'TOKEN environment variable is not defined',
};

export const configErrorFunctions = {
  invalidConfiguration: (error: unknown) => `Invalid configuration: ${error}`,
};
