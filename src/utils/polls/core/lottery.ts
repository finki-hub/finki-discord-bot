import {
  type GuildMember,
  type InteractionEditReplyOptions,
  type Poll,
  PollLayoutType,
} from 'discord.js';
import { randomBytes, randomInt } from 'node:crypto';

import { getExperienceByUserId } from '../../../data/database/Experience.js';
import {
  LotteryPollType,
  LotteryPollTypeSchema,
} from '../../../lib/schemas/PollType.js';
import { labels } from '../../../translations/labels.js';
import { specialStrings } from '../../../translations/special.js';
import { executeLotteryPollAction } from '../actions/lottery.js';
import { getPollArguments } from '../utils.js';

export const getLotteryPollIdentifier = (
  pollType: LotteryPollType,
  weighted: boolean,
  winnerCount: number,
): `[${LotteryPollType}-${string}-${number}]` =>
  `[${pollType}-${weighted ? 'true' : 'false'}-${winnerCount}]`;

export const getLotteryPollInformation = (pollText: string) => {
  const [pollType, weighted, winnerCount] = getPollArguments(pollText);

  const parsedPollType = LotteryPollTypeSchema.safeParse(pollType);
  const isWeighted = weighted === 'true';
  const parsedWinnerCount = Number.parseInt(winnerCount ?? '');

  return {
    pollType: parsedPollType.success ? parsedPollType.data : null,
    weighted: isWeighted,
    winnerCount: Number.isNaN(parsedWinnerCount) ? null : parsedWinnerCount,
  };
};

export const getLotteryPollText = (
  pollType: LotteryPollType,
): {
  description: string;
  title: string;
} => {
  switch (pollType) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case LotteryPollType.REGULARS_LOTTERY:
      return {
        description: specialStrings.regularsLotteryDescription,
        title: specialStrings.regularsLotteryTitle,
      };
    default:
      return {
        description: specialStrings.unknownLotteryPollDescription,
        title: specialStrings.unknownLotteryPollTitle,
      };
  }
};

export const createLotteryPoll = (
  pollType: LotteryPollType,
  weighted: boolean,
  winnerCount: number,
  duration: number,
) => {
  const { description, title } = getLotteryPollText(pollType);
  const identifier = getLotteryPollIdentifier(pollType, weighted, winnerCount);

  return {
    content: `${title}\n-# ${identifier}`,
    poll: {
      allowMultiselect: false,
      answers: [
        {
          emoji: '✅',
          text: labels.yes,
        },
      ],
      duration,
      layoutType: PollLayoutType.Default,
      question: {
        text: description,
      },
    },
  } satisfies InteractionEditReplyOptions;
};

export const selectRandomWinners = (
  participants: GuildMember[],
  winnerCount: number,
): GuildMember[] => {
  if (participants.length === 0 || winnerCount <= 0) {
    return [];
  }

  const minWinnerCount = Math.min(winnerCount, participants.length);

  const pool = [...participants];
  const winners: GuildMember[] = [];

  for (let i = 0; i < minWinnerCount; i++) {
    const randomIndex = Math.floor(randomInt(pool.length));

    const winner = pool[randomIndex];

    if (winner !== undefined) {
      winners.push(winner);

      pool.splice(randomIndex, 1);
    }
  }

  return winners;
};

export const generateRandomBigInt = (max: bigint) => {
  if (max <= 0n) {
    return 0n;
  }

  const range = max + 1n;

  const rangeBits = range.toString(2).length;
  const rangeBytes = Math.max(1, Math.ceil(rangeBits / 8));

  const maxPossibleValue = 2n ** BigInt(rangeBytes * 8);
  const maxUsableValue = maxPossibleValue - (maxPossibleValue % range);

  let randomValue: bigint;
  do {
    randomValue = randomBytes(rangeBytes).readBigUInt64BE();
  } while (randomValue >= maxUsableValue);

  return randomValue % range;
};

export const selectRandomWinnersWeighted = async (
  participants: GuildMember[],
  winnerCount: number,
): Promise<GuildMember[]> => {
  if (participants.length === 0 || winnerCount <= 0) {
    return [];
  }

  const minWinnerCount = Math.min(winnerCount, participants.length);

  const weightedParticipants = await Promise.all(
    participants.map(async (member) => {
      const experienceData = await getExperienceByUserId(member.id);
      const experience = experienceData?.experience ?? 1n;
      return { member, weight: experience > 0n ? experience : 1n };
    }),
  );

  const winners: GuildMember[] = [];
  const pool = [...weightedParticipants];
  let currentTotalWeight = pool.reduce(
    (acc, participant) => acc + participant.weight,
    0n,
  );

  for (
    let i = 0;
    i < minWinnerCount && pool.length > 0 && currentTotalWeight > 0n;
    i++
  ) {
    const randomTarget = generateRandomBigInt(currentTotalWeight - 1n) + 1n;

    let cumulativeWeight = 0n;
    let selectedIndex = 0;

    for (const [j, element] of pool.entries()) {
      cumulativeWeight += element.weight;
      if (randomTarget <= cumulativeWeight) {
        selectedIndex = j;
        break;
      }
    }

    const winner = pool[selectedIndex];
    if (winner !== undefined) {
      winners.push(winner.member);

      currentTotalWeight -= winner.weight;
      pool.splice(selectedIndex, 1);
    }
  }

  return winners;
};

export const endLotteryPoll = async (poll: Poll, drawWinners: boolean) => {
  if (poll.resultsFinalized) {
    return;
  }

  await poll.end();

  if (drawWinners) {
    await executeLotteryPollAction(poll);
  }
};

export const decideLotteryPoll = async (poll: Poll) => {
  await executeLotteryPollAction(poll);
};
