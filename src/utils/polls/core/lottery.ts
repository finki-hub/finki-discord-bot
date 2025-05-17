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
import { logger } from '../../../logger.js';
import { labels } from '../../../translations/labels.js';
import { logErrorFunctions } from '../../../translations/logs.js';
import { specialStrings } from '../../../translations/special.js';
import { executeLotteryPollAction } from '../actions/lottery.js';
import { getPollArguments, getPollContent } from '../utils.js';

const getLotteryPollIdentifier = (
  pollType: LotteryPollType,
  weighted: boolean,
  winnerCount: number,
  forcefullyEnded = false,
): `[${LotteryPollType}-${string}-${number}-${string}]` =>
  `[${pollType}-${weighted ? 'true' : 'false'}-${winnerCount}-${forcefullyEnded ? 'true' : 'false'}]`;

export const getLotteryPollInformation = (pollText: string) => {
  const [pollType, weighted, winnerCount, forcefullyEnded] =
    getPollArguments(pollText);

  const parsedPollType = LotteryPollTypeSchema.safeParse(pollType);
  const isWeighted = weighted === 'true';
  const parsedWinnerCount = Number.parseInt(winnerCount ?? '');
  const isForcefullyEnded = forcefullyEnded === 'true';

  return {
    forcefullyEnded: isForcefullyEnded,
    pollType: parsedPollType.success ? parsedPollType.data : null,
    weighted: isWeighted,
    winnerCount: Number.isNaN(parsedWinnerCount) ? null : parsedWinnerCount,
  };
};

const getLotteryPollText = (
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
    content: getPollContent(title, identifier),
    poll: {
      allowMultiselect: false,
      answers: [
        {
          emoji: '💎',
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

const generateRandomBigInt = (max: bigint) => {
  if (max <= 0n) {
    return 0n;
  }

  const range = max + 1n;

  const rangeBits = range.toString(2).length;
  const rangeBytes = Math.ceil(rangeBits / 8);

  const maxPossibleValue = 2n ** BigInt(rangeBytes * 8);
  const maxUsableValue = maxPossibleValue - (maxPossibleValue % range);

  let randomValue: bigint;
  do {
    randomValue = randomBytes(rangeBytes).reduce(
      (acc, byte) => acc * 256n + BigInt(byte),
      0n,
    );
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

    for (const [index, participant] of pool.entries()) {
      cumulativeWeight += participant.weight;
      if (randomTarget <= cumulativeWeight) {
        selectedIndex = index;
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

const markLotteryPollAsEnded = async (poll: Poll) => {
  const { content } = poll.message;
  const { forcefullyEnded, pollType, weighted, winnerCount } =
    getLotteryPollInformation(content);

  if (forcefullyEnded) {
    return;
  }

  if (pollType === null || winnerCount === null) {
    logger.warn(
      logErrorFunctions.lotteryPollNotExecutedError(
        pollType ?? labels.unknown,
        winnerCount ?? labels.unknown,
      ),
    );

    return;
  }

  await poll.message.edit(
    getPollContent(
      getLotteryPollText(pollType).title,
      getLotteryPollIdentifier(pollType, weighted, winnerCount, true),
    ),
  );
};

export const endLotteryPoll = async (poll: Poll, drawWinners: boolean) => {
  if (poll.resultsFinalized) {
    return;
  }

  if (drawWinners) {
    await executeLotteryPollAction(poll);
  }

  await markLotteryPollAsEnded(poll);
  await poll.end();
};

export const decideLotteryPoll = async (poll: Poll) => {
  const { forcefullyEnded } = getLotteryPollInformation(poll.message.content);

  if (forcefullyEnded) {
    return;
  }

  await executeLotteryPollAction(poll);
};
