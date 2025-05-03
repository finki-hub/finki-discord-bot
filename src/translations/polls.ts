import { type PollType, SpecialPollType } from '../lib/schemas/PollType.js';

export const POLL_TYPE_LABELS: Record<PollType, string> = {
  [SpecialPollType.ADMIN_ADD]: 'ADMIN ADD',
  [SpecialPollType.ADMIN_REMOVE]: 'ADMIN REMOVE',
  [SpecialPollType.BAR]: 'BAR',
  [SpecialPollType.COUNCIL_ADD]: 'COUNCIL ADD',
  [SpecialPollType.COUNCIL_REMOVE]: 'COUNCIL REMOVE',
  [SpecialPollType.IRREGULARS_ADD]: 'IRREGULARS ADD',
  [SpecialPollType.IRREGULARS_REMOVE]: 'IRREGULARS REMOVE',
  [SpecialPollType.IRREGULARS_REQUEST]: 'IRREGULARS REQUEST',
  [SpecialPollType.UNBAR]: 'UNBAR',
  [SpecialPollType.VIP_ADD]: 'VIP ADD',
  [SpecialPollType.VIP_REMOVE]: 'VIP REMOVE',
  [SpecialPollType.VIP_REQUEST]: 'VIP REQUEST',
};
