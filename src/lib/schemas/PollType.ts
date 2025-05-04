import { z } from 'zod';

export enum LotteryPollType {
  REGULARS_LOTTERY = 'regularsLottery',
}

export enum SpecialPollType {
  ADMIN_ADD = 'adminAdd',
  ADMIN_REMOVE = 'adminRemove',
  BAR = 'bar',
  COUNCIL_ADD = 'councilAdd',
  COUNCIL_REMOVE = 'councilRemove',
  IRREGULARS_ADD = 'irregularsAdd',
  IRREGULARS_REMOVE = 'irregularsRemove',
  IRREGULARS_REQUEST = 'irregularsRequest',
  UNBAR = 'unbar',
  VIP_ADD = 'vipAdd',
  VIP_REMOVE = 'vipRemove',
  VIP_REQUEST = 'vipRequest',
}

export type PollType = LotteryPollType | SpecialPollType;

export const LotteryPollTypeSchema = z.nativeEnum(LotteryPollType);
export const SpecialPollTypeSchema = z.nativeEnum(SpecialPollType);
export const PollTypeSchema = z.union([
  LotteryPollTypeSchema,
  SpecialPollTypeSchema,
]);
