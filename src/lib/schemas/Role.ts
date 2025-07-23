import { z } from 'zod';

export enum Role {
  Administration = 'administration',
  Administrators = 'administrators',
  Boosters = 'boosters',
  Contributors = 'contributors',
  FSS = 'fss',
  Irregulars = 'irregulars',
  Management = 'management',
  Moderators = 'moderators',
  Ombudsman = 'ombudsman',
  Regulars = 'regulars',
  VIP = 'vip',
}

export const RoleSchema = z.enum(Role);
