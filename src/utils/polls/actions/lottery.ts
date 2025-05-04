import type { GuildMember, Poll } from 'discord.js';

import { getRolesProperty } from '../../../configuration/main.js';
import { Channel } from '../../../lib/schemas/Channel.js';
import { LotteryPollType } from '../../../lib/schemas/PollType.js';
import { Role } from '../../../lib/schemas/Role.js';
import { logger } from '../../../logger.js';
import { commandErrorFunctions } from '../../../translations/commands.js';
import { labels } from '../../../translations/labels.js';
import { logErrorFunctions } from '../../../translations/logs.js';
import { specialStringFunctions } from '../../../translations/special.js';
import { getChannel } from '../../channels.js';
import { getMembersFromGuild } from '../../guild.js';
import { excludeBarredMembers, excludeMembersWithRole } from '../../members.js';
import {
  getLotteryPollInformation,
  selectRandomWinners,
  selectRandomWinnersWeighted,
} from '../core/lottery.js';
import { getVoters } from '../utils.js';

const executeRegularsLotteryPoll = async (
  members: GuildMember[],
  weighted: boolean,
  winnerCount: number,
) => {
  const regularsRoleId = getRolesProperty(Role.Regulars);
  const regularsChannel = getChannel(Channel.Regulars);

  if (regularsRoleId === undefined) {
    await regularsChannel?.send(
      commandErrorFunctions.roleNotFound(Role.Regulars),
    );
    logger.warn(logErrorFunctions.roleNotFound(Role.Regulars));

    return;
  }

  const filteredMembers = excludeMembersWithRole(members, Role.Regulars);

  if (filteredMembers.length === 0) {
    return;
  }

  const winnerMembers = weighted
    ? await selectRandomWinnersWeighted(filteredMembers, winnerCount)
    : selectRandomWinners(filteredMembers, winnerCount);

  for (const member of winnerMembers) {
    await member.roles.add(regularsRoleId);
  }

  await regularsChannel?.send(
    specialStringFunctions.regularsWelcome(
      winnerMembers.map((member) => member.user.id),
    ),
  );
};

export const LOTTERY_POLL_OPTIONS: Record<
  LotteryPollType,
  (
    members: GuildMember[],
    weighted: boolean,
    winnerCount: number,
  ) => Promise<void>
> = {
  [LotteryPollType.REGULARS_LOTTERY]: executeRegularsLotteryPoll,
};

export const executeLotteryPollAction = async (poll: Poll) => {
  const { content } = await poll.message.fetch();
  const { pollType, weighted, winnerCount } =
    getLotteryPollInformation(content);

  if (pollType === null || winnerCount === null) {
    logger.warn(
      logErrorFunctions.lotteryPollNotExecutedError(
        pollType ?? labels.unknown,
        winnerCount ?? labels.unknown,
      ),
    );

    return;
  }

  const participantMembers = await getVoters(poll)
    .then(excludeBarredMembers)
    .then((userIds) => getMembersFromGuild(userIds, poll.message.guild));

  await LOTTERY_POLL_OPTIONS[pollType](
    participantMembers,
    weighted,
    winnerCount,
  );
};
