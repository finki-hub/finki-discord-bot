import { z } from 'zod';

export enum Role {
  Administrators = 'administrators',
  Moderators = 'moderators',
}

export const RoleSchema = z.enum(Role);
