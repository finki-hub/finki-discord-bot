import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config();

export default defineConfig({
  datasource: {
    url: process.env['DATABASE_URL'] ?? 'postgresql://db:db@database:5432/db',
  },
});
