import {
  type InteractionEditReplyOptions,
  type Poll,
  PollLayoutType,
  type User,
} from 'discord.js';

import type { PartialUser } from '../../../lib/types/PartialUser.js';

import { getRolesProperty } from '../../../configuration/main.js';
import { Channel } from '../../../lib/schemas/Channel.js';
import {
  SpecialPollType,
  SpecialPollTypeSchema,
} from '../../../lib/schemas/PollType.js';
import { Role } from '../../../lib/schemas/Role.js';
import { logger } from '../../../logger.js';
import { labels } from '../../../translations/labels.js';
import { logMessages } from '../../../translations/logs.js';
import { specialStringFunctions } from '../../../translations/special.js';
import { getChannel } from '../../channels.js';
import { getGuild, getMemberFromGuild } from '../../guild.js';
import { ADMIN_OVERRIDE_LEVEL } from '../../levels.js';
import { isMemberLevel } from '../../members.js';
import { getMembersByRoleIds } from '../../roles.js';
import { executeSpecialPollAction } from '../actions/special.js';
import { getPollArguments } from '../utils.js';

export const initializeSpecialPolls = async () => {
  const councilChannel = getChannel(Channel.Council);

  if (councilChannel === undefined) {
    return;
  }

  await councilChannel.messages.fetch();

  logger.info(logMessages.pollsInitialized);
};

const getSpecialPollIdentifier = (
  pollType: SpecialPollType,
  userId: string,
): `[${SpecialPollType}-${string}]` => `[${pollType}-${userId}]`;

const getSpecialPollTypeThreshold = (pollType: SpecialPollType) => {
  switch (pollType) {
    case SpecialPollType.VIP_ADD:
    case SpecialPollType.VIP_REMOVE:
    case SpecialPollType.VIP_REQUEST:
      return 0.67;

    default:
      return 0.5;
  }
};

export const getSpecialPollInformation = (pollText: string) => {
  const [pollType, userId] = getPollArguments(pollText);

  const parsedPollType = SpecialPollTypeSchema.safeParse(pollType);

  return {
    pollType: parsedPollType.data ?? null,
    userId: userId ?? null,
  };
};

export const getSpecialPollText = (
  pollType: SpecialPollType,
  partialUser: PartialUser,
): {
  description: string;
  title: string;
} => {
  const { tag: userTag } = partialUser;

  switch (pollType) {
    case SpecialPollType.ADMIN_ADD:
      return {
        description: specialStringFunctions.adminAddDescription(userTag),
        title: specialStringFunctions.adminAddTitle(partialUser),
      };
    case SpecialPollType.ADMIN_REMOVE:
      return {
        description: specialStringFunctions.adminRemoveDescription(userTag),
        title: specialStringFunctions.adminRemoveTitle(partialUser),
      };

    case SpecialPollType.BAR:
      return {
        description: specialStringFunctions.barDescription(userTag),
        title: specialStringFunctions.barTitle(partialUser),
      };

    case SpecialPollType.COUNCIL_ADD:
      return {
        description: specialStringFunctions.councilAddDescription(userTag),
        title: specialStringFunctions.councilAddTitle(partialUser),
      };

    case SpecialPollType.COUNCIL_REMOVE:
      return {
        description: specialStringFunctions.councilRemoveDescription(userTag),
        title: specialStringFunctions.councilRemoveTitle(partialUser),
      };

    case SpecialPollType.IRREGULARS_ADD:
    case SpecialPollType.IRREGULARS_REQUEST:
      return {
        description: specialStringFunctions.irregularsAddDescription(userTag),
        title: specialStringFunctions.irregularsAddTitle(partialUser),
      };

    case SpecialPollType.IRREGULARS_REMOVE:
      return {
        description:
          specialStringFunctions.irregularsRemoveDescription(userTag),
        title: specialStringFunctions.irregularsRemoveTitle(partialUser),
      };

    case SpecialPollType.UNBAR:
      return {
        description: specialStringFunctions.unbarDescription(userTag),
        title: specialStringFunctions.unbarTitle(partialUser),
      };

    case SpecialPollType.VIP_ADD:
    case SpecialPollType.VIP_REQUEST:
      return {
        description: specialStringFunctions.vipAddDescription(userTag),
        title: specialStringFunctions.vipAddTitle(partialUser),
      };

    case SpecialPollType.VIP_REMOVE:
      return {
        description: specialStringFunctions.vipRemoveDescription(userTag),
        title: specialStringFunctions.vipRemoveTitle(partialUser),
      };

    default:
      return {
        description: specialStringFunctions.unknownPollDescription(userTag),
        title: specialStringFunctions.unknownPollTitle(partialUser),
      };
  }
};

export const getActiveSpecialPolls = async () => {
  const channel = getChannel(Channel.Council);

  if (channel === undefined) {
    return [];
  }

  const messages = await channel.messages.fetch();
  const polls = messages
    .map((message) => message.poll)
    .filter((poll) => poll !== null)
    .filter((poll) => !poll.resultsFinalized);

  return polls;
};

export const isSpecialPollDuplicate = async (
  pollType: SpecialPollType,
  userId: string,
) => {
  const polls = await getActiveSpecialPolls();
  const identifier = getSpecialPollIdentifier(pollType, userId);

  return polls.some((poll) => poll.message.content.includes(identifier));
};

export const createSpecialPoll = (
  pollType: SpecialPollType,
  targetUser: User,
) => {
  const partialUser = {
    id: targetUser.id,
    tag: targetUser.tag,
  };

  const { description, title } = getSpecialPollText(pollType, partialUser);
  const identifier = getSpecialPollIdentifier(pollType, targetUser.id);

  return {
    content: `${title}\n-# ${identifier}`,
    poll: {
      allowMultiselect: false,
      answers: [
        {
          emoji: '✅',
          text: labels.yes,
        },
        {
          emoji: '❌',
          text: labels.no,
        },
        {
          emoji: '🤐',
          text: labels.abstain,
        },
      ],
      duration: 24,
      layoutType: PollLayoutType.Default,
      question: {
        text: description,
      },
    },
  } satisfies InteractionEditReplyOptions;
};

export const getVoters = async (poll: Poll) => {
  const votes = await Promise.all(
    poll.answers.map(async (answer) => await answer.fetchVoters()),
  );
  const voters = votes
    .flatMap((vote) => vote.values().toArray())
    .map((voter) => voter.id);

  return voters;
};

const getMissingVoters = async (poll: Poll) => {
  const guild = poll.message.guild ?? (await getGuild());

  if (guild === null) {
    return [];
  }

  const councilRoleId = getRolesProperty(Role.Council);

  if (councilRoleId === undefined) {
    return [];
  }

  const councilMembers = await getMembersByRoleIds(guild, [councilRoleId]);
  const voters = await getVoters(poll);

  return councilMembers.filter((member) => !voters.includes(member));
};

const getSpecialPollThreshold = async (
  poll: Poll,
  roleId: string,
  abstainMissingVotes: boolean,
) => {
  const guild = poll.message.guild ?? (await getGuild());
  const { pollType } = getSpecialPollInformation(poll.message.content);

  if (guild === null || pollType === null) {
    return null;
  }

  const pollTypeThreshold = getSpecialPollTypeThreshold(pollType);
  const totalVoters = await getMembersByRoleIds(guild, [roleId]);

  const abstainOption = poll.answers.find(
    (option) => option.text === labels.abstain,
  );
  let abstentions = abstainOption?.voteCount ?? 0;

  if (abstainMissingVotes) {
    const missingVoters = await getMissingVoters(poll);
    abstentions += missingVoters.length;
  }

  if (abstentions >= totalVoters.length / 2) {
    return null;
  }

  const threshold = (totalVoters.length - abstentions) * pollTypeThreshold;

  const normalizedThreshold = Number.isInteger(threshold)
    ? threshold + 1
    : Math.ceil(threshold);

  return normalizedThreshold;
};

export const getAdminVotes = async (poll: Poll) => {
  const guild = poll.message.guild ?? (await getGuild());

  if (guild === null) {
    return null;
  }

  const adminRoleId = getRolesProperty(Role.Administrators);

  if (adminRoleId === undefined) {
    return null;
  }

  const admins = await getMembersByRoleIds(guild, [adminRoleId]);

  const options = await Promise.all(
    poll.answers.map(async (answer) => answer.fetchVoters()),
  );

  const adminVotes: Array<null | string> = [];

  for (const option of options) {
    const votes = option.filter((voter) => admins.includes(voter.id));

    adminVotes.push(...votes.map((vote) => vote.id));
  }

  // for each missing admin vote, add undefined
  for (const admin of admins) {
    if (!adminVotes.includes(admin)) {
      adminVotes.push(null);
    }
  }

  return new Set(adminVotes);
};

const getSpecialPollAdminDecision = async (poll: Poll) => {
  const adminVotes = await getAdminVotes(poll);

  const { pollType, userId } = getSpecialPollInformation(poll.message.content);

  if (pollType === null || userId === null) {
    return null;
  }

  const member = await getMemberFromGuild(userId, poll.message.guild);

  if (member === null) {
    return null;
  }

  switch (pollType) {
    case SpecialPollType.ADMIN_ADD:
    case SpecialPollType.COUNCIL_ADD:
    case SpecialPollType.IRREGULARS_ADD:
    case SpecialPollType.IRREGULARS_REQUEST:
    case SpecialPollType.VIP_ADD:
    case SpecialPollType.VIP_REQUEST:
      if (!(await isMemberLevel(member, ADMIN_OVERRIDE_LEVEL))) {
        return null;
      }

      if (
        adminVotes === null ||
        adminVotes.size !== 1 ||
        adminVotes.has(null)
      ) {
        return null;
      }

      return adminVotes.values().next().value ?? null;

    default:
      return null;
  }
};

export const getSpecialPollDecision = async (
  poll: Poll,
  pollExpired: boolean,
) => {
  const councilRoleId = getRolesProperty(Role.Council);

  if (councilRoleId === undefined) {
    return null;
  }

  const threshold = await getSpecialPollThreshold(
    poll,
    councilRoleId,
    pollExpired,
  );

  if (threshold === null) {
    return null;
  }

  const decision = poll.answers.find((answer) => answer.voteCount >= threshold);

  if (
    decision?.text === undefined ||
    decision.text === null ||
    decision.text === labels.abstain
  ) {
    return null;
  }

  return decision.text;
};

export const decideSpecialPoll = async (poll: Poll, expired = false) => {
  const adminDecision = await getSpecialPollAdminDecision(poll);

  if (adminDecision !== null) {
    await executeSpecialPollAction(poll, adminDecision);

    if (!poll.resultsFinalized) {
      await poll.end();
    }

    return;
  }

  const decision = await getSpecialPollDecision(poll, expired);

  if (decision === null) {
    return;
  }

  await executeSpecialPollAction(poll, decision);

  if (!poll.resultsFinalized && !expired) {
    await poll.end();
  }
};

export const decideSpecialPollForcefully = async (
  poll: Poll,
  decision: null | string,
) => {
  if (poll.resultsFinalized) {
    return;
  }

  const chosenDecision = decision ?? (await getSpecialPollDecision(poll, true));

  if (chosenDecision === null) {
    return;
  }

  await poll.end();
  await executeSpecialPollAction(poll, chosenDecision);
};
