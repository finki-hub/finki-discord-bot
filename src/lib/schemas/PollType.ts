import { z } from 'zod';

export enum LotteryPollType {
  REGULARS_LOTTERY = 'regularsLottery',
}

export enum SpecialPollType {
  BAR = 'bar',
  IRREGULARS_ADD = 'irregularsAdd',
  IRREGULARS_REMOVE = 'irregularsRemove',
  IRREGULARS_REQUEST = 'irregularsRequest',
  UNBAR = 'unbar',
  VIP_ADD = 'vipAdd',
  VIP_REMOVE = 'vipRemove',
  VIP_REQUEST = 'vipRequest',
}

export type PollType = LotteryPollType | SpecialPollType;

export const LotteryPollTypeSchema = z.enum(LotteryPollType);
export const SpecialPollTypeSchema = z.enum(SpecialPollType);
export const PollTypeSchema = z.union([
  LotteryPollTypeSchema,
  SpecialPollTypeSchema,
]);
