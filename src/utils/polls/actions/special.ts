import type { GuildMember, Poll } from 'discord.js';

import {
  getIrregularsAcknowledgeComponents,
  getIrregularsConfirmComponents,
  getIrregularsConfirmEmbed,
  getVipAcknowledgeComponents,
  getVipConfirmComponents,
  getVipConfirmEmbed,
} from '../../../components/scripts.js';
import { getRolesProperty } from '../../../configuration/main.js';
import { createBar, deleteBar } from '../../../data/database/Bar.js';
import { Channel } from '../../../lib/schemas/Channel.js';
import { SpecialPollType } from '../../../lib/schemas/PollType.js';
import { Role } from '../../../lib/schemas/Role.js';
import { logger } from '../../../logger.js';
import { commandErrorFunctions } from '../../../translations/commands.js';
import { labels } from '../../../translations/labels.js';
import { logErrorFunctions } from '../../../translations/logs.js';
import { specialStringFunctions } from '../../../translations/special.js';
import { getChannel } from '../../channels.js';
import { getMemberFromGuild } from '../../guild.js';
import { getSpecialPollInformation } from '../core/special.js';

const executeVipRequestPollAction = async (
  member: GuildMember,
  decision: string,
) => {
  const vipChannel = getChannel(Channel.VIP);
  const oathChannel = getChannel(Channel.Oath);

  if (decision !== labels.yes) {
    const rejectComponents = getVipAcknowledgeComponents();
    await oathChannel?.send({
      components: rejectComponents,
      content: specialStringFunctions.vipRequestRejected(member.user.id),
    });

    return;
  }

  const confirmEmbed = getVipConfirmEmbed();
  const confirmComponents = getVipConfirmComponents();
  await oathChannel?.send({
    components: confirmComponents,
    content: specialStringFunctions.vipRequestAccepted(member.user.id),
    embeds: [confirmEmbed],
  });

  await vipChannel?.send(specialStringFunctions.vipAddAccepted(member.user.id));
};

const executeVipAddPollAction = async (
  member: GuildMember,
  decision: string,
) => {
  const vipChannel = getChannel(Channel.VIP);
  const oathChannel = getChannel(Channel.Oath);

  if (decision !== labels.yes) {
    return;
  }

  const confirmEmbed = getVipConfirmEmbed();
  const confirmComponents = getVipConfirmComponents();
  await oathChannel?.send({
    components: confirmComponents,
    content: specialStringFunctions.vipAddRequestAccepted(member.user.id),
    embeds: [confirmEmbed],
  });

  await vipChannel?.send(specialStringFunctions.vipAddAccepted(member.user.id));
};

const executeVipRemovePollAction = async (
  member: GuildMember,
  decision: string,
) => {
  const vipChannel = getChannel(Channel.VIP);

  if (decision !== labels.yes) {
    return;
  }

  const vipRoleId = getRolesProperty(Role.VIP);
  const managementRoleId = getRolesProperty(Role.Management);

  if (vipRoleId === undefined) {
    await vipChannel?.send(commandErrorFunctions.roleNotFound(Role.VIP));
    logger.warn(logErrorFunctions.roleNotFound(Role.VIP));
  } else {
    await member.roles.remove(vipRoleId);
  }

  if (managementRoleId === undefined) {
    await vipChannel?.send(commandErrorFunctions.roleNotFound(Role.Management));
    logger.warn(logErrorFunctions.roleNotFound(Role.Management));
  } else {
    await member.roles.remove(managementRoleId);
  }

  await vipChannel?.send(
    specialStringFunctions.vipRemoveAccepted(member.user.id),
  );
};

export const executeBarPollAction = async (
  member: GuildMember,
  decision: string,
  silent = false,
) => {
  const vipChannel = getChannel(Channel.VIP);

  if (decision !== labels.yes) {
    return;
  }

  await createBar({
    userId: member.user.id,
  });

  const regularsRoleId = getRolesProperty(Role.Regulars);
  const vipRoleId = getRolesProperty(Role.VIP);
  const managementRoleId = getRolesProperty(Role.Management);

  if (regularsRoleId === undefined) {
    await vipChannel?.send(commandErrorFunctions.roleNotFound(Role.Regulars));
    logger.warn(logErrorFunctions.roleNotFound(Role.Regulars));
  } else {
    await member.roles.remove(regularsRoleId);
  }

  if (vipRoleId === undefined) {
    await vipChannel?.send(commandErrorFunctions.roleNotFound(Role.VIP));
    logger.warn(logErrorFunctions.roleNotFound(Role.VIP));
  } else {
    await member.roles.remove(vipRoleId);
  }

  if (managementRoleId === undefined) {
    await vipChannel?.send(commandErrorFunctions.roleNotFound(Role.Management));
    logger.warn(logErrorFunctions.roleNotFound(Role.Management));
  } else {
    await member.roles.remove(managementRoleId);
  }

  if (silent) {
    return;
  }

  await vipChannel?.send(specialStringFunctions.barAccepted(member.user.id));
};

export const executeUnbarPollAction = async (
  member: GuildMember,
  decision: string,
  silent = false,
) => {
  const vipChannel = getChannel(Channel.VIP);

  if (decision !== labels.yes) {
    return;
  }

  await deleteBar(member.user.id);

  if (silent) {
    return;
  }

  await vipChannel?.send(specialStringFunctions.unbarAccepted(member.user.id));
};

const executeIrregularsRequestPollAction = async (
  member: GuildMember,
  decision: string,
) => {
  const irregularsChannel = getChannel(Channel.Irregulars);
  const oathChannel = getChannel(Channel.Oath);

  if (decision !== labels.yes) {
    const rejectComponents = getIrregularsAcknowledgeComponents();
    await oathChannel?.send({
      components: rejectComponents,
      content: specialStringFunctions.irregularsRequestRejected(member.user.id),
    });

    return;
  }

  const confirmEmbed = getIrregularsConfirmEmbed();
  const confirmComponents = getIrregularsConfirmComponents();
  await oathChannel?.send({
    components: confirmComponents,
    content: specialStringFunctions.irregularsRequestAccepted(member.user.id),
    embeds: [confirmEmbed],
  });

  await irregularsChannel?.send(
    specialStringFunctions.irregularsAddAccepted(member.user.id),
  );
};

const executeIrregularsAddPollAction = async (
  member: GuildMember,
  decision: string,
) => {
  const irregularsChannel = getChannel(Channel.Irregulars);
  const oathChannel = getChannel(Channel.Oath);

  if (decision !== labels.yes) {
    return;
  }

  const confirmEmbed = getIrregularsConfirmEmbed();
  const confirmComponents = getIrregularsConfirmComponents();
  await oathChannel?.send({
    components: confirmComponents,
    content: specialStringFunctions.irregularsAddRequestAccepted(
      member.user.id,
    ),
    embeds: [confirmEmbed],
  });

  await irregularsChannel?.send(
    specialStringFunctions.irregularsAddAccepted(member.user.id),
  );
};

const executeIrregularsRemovePollAction = async (
  member: GuildMember,
  decision: string,
) => {
  const irregularsChannel = getChannel(Channel.Irregulars);

  if (decision !== labels.yes) {
    return;
  }

  const irregularsRoleId = getRolesProperty(Role.Irregulars);

  if (irregularsRoleId === undefined) {
    await irregularsChannel?.send(
      commandErrorFunctions.roleNotFound(Role.Irregulars),
    );
    logger.warn(logErrorFunctions.roleNotFound(Role.Irregulars));
  } else {
    await member.roles.remove(irregularsRoleId);
  }

  await irregularsChannel?.send(
    specialStringFunctions.irregularsRemoveAccepted(member.user.id),
  );
};

export const SPECIAL_POLL_ACTIONS: Record<
  SpecialPollType,
  (member: GuildMember, decision: string) => Promise<void>
> = {
  [SpecialPollType.BAR]: executeBarPollAction,
  [SpecialPollType.IRREGULARS_ADD]: executeIrregularsAddPollAction,
  [SpecialPollType.IRREGULARS_REMOVE]: executeIrregularsRemovePollAction,
  [SpecialPollType.IRREGULARS_REQUEST]: executeIrregularsRequestPollAction,
  [SpecialPollType.UNBAR]: executeUnbarPollAction,
  [SpecialPollType.VIP_ADD]: executeVipAddPollAction,
  [SpecialPollType.VIP_REMOVE]: executeVipRemovePollAction,
  [SpecialPollType.VIP_REQUEST]: executeVipRequestPollAction,
} as const;

export const executeSpecialPollAction = async (
  poll: Poll,
  decision: string,
) => {
  const { pollType, userId } = getSpecialPollInformation(poll.message.content);

  if (pollType === null || userId === null) {
    logger.warn(
      logErrorFunctions.specialPollNotExecutedError(
        pollType ?? labels.unknown,
        userId ?? labels.unknown,
      ),
    );

    return;
  }

  const member = await getMemberFromGuild(userId, poll.message.guild);

  if (member === null) {
    logger.warn(logErrorFunctions.memberNotFound(userId));
    return;
  }

  await SPECIAL_POLL_ACTIONS[pollType](member, decision);
};
