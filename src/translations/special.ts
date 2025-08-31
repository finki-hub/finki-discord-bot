import { inlineCode, userMention } from 'discord.js';

import { type PartialUser } from '../lib/types/PartialUser.js';
import { tagAndMentionUser } from './users.js';

export const specialStrings = {
  accept: 'Прифаќам',
  irregularsButton: 'Да, во Вонредните',
  irregularsOath:
    '### Изјавувам дека функцијата „член на Вонредните во официјалниот Дискорд сервер на студентите на ФИНКИ“ ќе ја вршам совесно и одговорно и ќе го почитувам Уставот, законите на Република Северна Македонија и правилата на официјалниот Discord сервер на студентите на ФИНКИ.',
  oath: 'Заклетва',
  regularsLotteryDescription:
    'Дали сакате да учествувате во лотарија за влез во редовните членови?',
  regularsLotteryTitle: 'Лотарија за влез во Редовните',
  requestActive: 'Вашата молба е активна.',
  requestFailed: 'Настана грешка при испраќање на вашата молба.',
  requestRejected: 'Вашата молба беше одбиена.',
  requestSent:
    'Вашата молба е испратена. Ќе бидете известени за одлуката за најкасно 24 часа.',
  requestsPaused: 'Молбите се моментално ставени во мирување.',
  requestText:
    'Дали сакате да станете член на повисока заедница во серверот на студентите на ФИНКИ?',
  requestTitle: 'Членство во повисоки заедници',
  specialRequestUnderLevel: 'Не го исполнувате условот за ниво за аплицирање.',
  unknownLotteryPollDescription:
    'Лотарија од непознат тип. Ова е најверојатно грешка.',
  unknownLotteryPollTitle: 'Непознат тип на лотарија.',
  vipButton: 'Да, во ВИП',
  vipOath:
    '### Изјавувам дека функцијата „член на ВИП во официјалниот Дискорд сервер на студентите на ФИНКИ“ ќе ја вршам совесно и одговорно и ќе го почитувам Уставот, законите на Република Северна Македонија и правилата на официјалниот Discord сервер на студентите на ФИНКИ.',
};

export const specialStringFunctions = {
  barAccepted: (userId: string) =>
    `# Корисникот ${userMention(userId)} е забранет.`,

  barDescription: (userTag: string) =>
    `Дали се согласувате корисникот ${userTag} да добие забрана?`,

  barRejected: (userId: string) =>
    `# Корисникот ${userMention(userId)} не е забранет.`,

  barTitle: ({ id, tag }: PartialUser) =>
    `Забрана за ${tagAndMentionUser({ id, tag })}`,

  irregularsAddAccepted: (userId: string) =>
    `# Корисникот ${userMention(userId)} е одобрен како член на Вонредните.`,

  irregularsAddDescription: (userTag: string) =>
    `Дали се согласувате корисникот ${userTag} да стане член на Вонредните?`,

  irregularsAddRejected: (userId: string) =>
    `# Корисникот ${userMention(userId)} не е одобрен како член на Вонредните.`,

  irregularsAddRequestAccepted: (userId: string) =>
    `# ${userMention(userId)} Советот донесе одлука да Ве покани во Вонредните.`,

  irregularsAddTitle: ({ id, tag }: PartialUser) =>
    `Влез во Вонредните за ${tagAndMentionUser({ id, tag })}`,

  irregularsRemoveAccepted: (userId: string) =>
    `# Корисникот ${userMention(userId)} е избркан од Вонредните.`,

  irregularsRemoveDescription: (userTag: string) =>
    `Дали се согласувате корисникот ${userTag} да биде избркан од Вонредните?`,

  irregularsRemoveRejected: (userId: string) =>
    `# Корисникот ${userMention(userId)} не е избркан од Вонредните.`,

  irregularsRemoveTitle: ({ id, tag }: PartialUser) =>
    `Излез од Вонредните за ${tagAndMentionUser({ id, tag })}`,

  irregularsRequestAccepted: (userId: string) =>
    `# ${userMention(userId)} Вашата молба за влез во Вонредните беше одобрена.`,

  irregularsRequestRejected: (userId: string) =>
    `# ${userMention(userId)} Вашата молба за влез во Вонредните не беше одобрена.`,

  irregularsWelcome: (userId: string) =>
    `# Добредојде во Вонредните, ${userMention(userId)}!`,

  regularsWelcome: (userIds: string[]) =>
    `# ${userIds.length === 1 ? 'Добредојде' : 'Добредојдовте'} во Редовните, ${userIds.map(userMention).join(', ')}!`,

  tempRegularsTopic: (date: string) =>
    `Задните соби на редовните. Содржината се брише секој ден. Следно бришење е во ${date}.`,

  tempVipTopic: (date: string) =>
    `Задните соби на ВИП. Содржината се брише секој ден. Следно бришење е во ${date}.`,

  unbarAccepted: (userId: string) =>
    `# Забраната за корисникот ${userMention(userId)} е укината.`,

  unbarDescription: (userTag: string) =>
    `Дали се согласувате забраната за корисникот ${inlineCode(userTag)} да биде укината?`,

  unbarRejected: (userId: string) =>
    `# Забраната за корисникот ${userMention(userId)} не е укината.`,

  unbarTitle: ({ id, tag }: PartialUser) =>
    `Укинување забрана за ${tagAndMentionUser({ id, tag })}`,

  unknownSpecialPollDescription: (userTag: string) =>
    `Гласање за корисникот ${inlineCode(userTag)} за непознат тип. Ова е најверојатно грешка.`,

  unknownSpecialPollTitle: ({ id, tag }: PartialUser) =>
    `Непознат тип на гласање за корисникот ${tagAndMentionUser({ id, tag })}`,

  vipAddAccepted: (userId: string) =>
    `# Корисникот ${userMention(userId)} е одобрен како член на ВИП.`,

  vipAddDescription: (userTag: string) =>
    `Дали се согласувате корисникот ${userTag} да стане член на ВИП?`,

  vipAddRejected: (userId: string) =>
    `# Корисникот ${userMention(userId)} не е одобрен како член на ВИП.`,

  vipAddRequestAccepted: (userId: string) =>
    `# ${userMention(userId)} Советот донесе одлука да Ве покани во ВИП.`,

  vipAddTitle: ({ id, tag }: PartialUser) =>
    `Влез во ВИП за ${tagAndMentionUser({ id, tag })}`,

  vipRemoveAccepted: (userId: string) =>
    `# Корисникот ${userMention(userId)} е избркан од ВИП.`,

  vipRemoveDescription: (userTag: string) =>
    `Дали се согласувате корисникот ${userTag} да биде избркан од ВИП?`,

  vipRemoveRejected: (userId: string) =>
    `# Корисникот ${userMention(userId)} не е избркан од ВИП.`,

  vipRemoveTitle: ({ id, tag }: PartialUser) =>
    `Излез од ВИП за ${tagAndMentionUser({ id, tag })}`,

  vipRequestAccepted: (userId: string) =>
    `# ${userMention(userId)} Вашата молба за влез во ВИП беше одобрена.`,

  vipRequestRejected: (userId: string) =>
    `# ${userMention(userId)} Вашата молба за влез во ВИП не беше одобрена.`,

  vipWelcome: (userId: string) =>
    `# Добредојде во ВИП, ${userMention(userId)}!`,
};
