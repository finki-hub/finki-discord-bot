import { PollCategory } from '../../lib/schemas/PollCategory.js';
import {
  LotteryPollType,
  type PollType,
  SpecialPollType,
} from '../../lib/schemas/PollType.js';
import { labels } from '../../translations/labels.js';

export const POLL_CATEGORIES: Record<PollType, PollCategory> = {
  ...(Object.fromEntries(
    Object.values(LotteryPollType).map((type: LotteryPollType) => [
      type,
      PollCategory.LOTTERY,
    ]),
  ) as Record<LotteryPollType, PollCategory>),

  ...(Object.fromEntries(
    Object.values(SpecialPollType).map((type: SpecialPollType) => [
      type,
      PollCategory.SPECIAL,
    ]),
  ) as Record<SpecialPollType, PollCategory.SPECIAL>),
} as const;

export const SPECIAL_POLL_OPTIONS = [
  labels.yes,
  labels.no,
  labels.abstain,
] as const;
