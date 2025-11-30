import { PrismaPg } from '@prisma/adapter-pg';

import { getDatabaseUrl } from '../../configuration/environment.js';
import { PrismaClient } from '../../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });

export const database = new PrismaClient({ adapter });
