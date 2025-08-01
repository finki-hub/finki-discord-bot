import { inlineCode, userMention } from 'discord.js';

import { type PartialUser } from '../lib/types/PartialUser.js';
import { tagAndMentionUser } from './users.js';

export const specialStrings = {
  accept: 'ᔑᓵᓵᒷ!¡ℸ ̣',
  irregularsButton: '⎓╎∷ᓭℸ ̣   ꖎᔑ||ᒷ∷',
  irregularsOath:
    '### ╎  ↸𝙹  ⍑ᒷ∷ᒷʖ||  ᓭ𝙹ꖎᒷᒲリꖎ||  ᓭ∴ᒷᔑ∷  ℸ ̣ 𝙹  ⎓ᔑ╎ℸ ̣ ⍑⎓⚍ꖎꖎ||  ᓭᒷ∷⍊ᒷ  ℸ ̣ ⍑ᒷ  𝙹⎓⎓╎ᓵ╎ᔑꖎ  ↸╎ᓭᓵ𝙹∷↸  ᓭᒷ∷⍊ᒷ∷  ⎓𝙹∷  ℸ ̣ ⍑ᒷ  ᓭℸ ̣ ⚍↸ᒷリℸ ̣ ᓭ  𝙹⎓  ⎓ᓵᓭᒷ.',
  oath: '𝙹ᔑℸ ̣ ⍑',
  regularsLotteryDescription:
    'Дали сакате да учествувате во лотарија за влез во редовните членови?',
  regularsLotteryTitle: 'Лотарија за влез во Редовните',
  requestActive: '||𝙹⚍∷  ∷ᒷᑑ⚍ᒷᓭℸ ̣   ╎ᓭ  ᔑᓵℸ ̣ ╎⍊ᒷ.',
  requestFailed: 'ᔑリ  ᒷ∷∷𝙹∷  𝙹ᓵᓵ⚍∷∷ᒷ↸  ∴⍑╎ꖎᒷ  ᓭᒷリ↸╎リ⊣  ||𝙹⚍∷  ∷ᒷᑑ⚍ᒷᓭℸ ̣.',
  requestRejected: '||𝙹⚍∷  ∷ᒷᑑ⚍ᒷᓭℸ ̣   ∴ᔑᓭ  ↸ᒷリ╎ᒷ↸.',
  requestSent:
    '||𝙹⚍∷  ∷ᒷᑑ⚍ᒷᓭℸ ̣   ⍑ᔑᓭ  ʖᒷᒷリ  ᓭᒷリℸ ̣. ||𝙹⚍  ∴╎ꖎꖎ  ∷ᒷᓵᒷ╎⍊ᒷ  ᔑ  ∷ᒷ!¡ꖎ||  ᓭ𝙹𝙹リ.',
  requestsPaused: 'ℸ ̣ ⍑ᒷ  ∷ᒷᑑ⚍ᒷᓭℸ ̣ ᓭ  ᔑ∷ᒷ  ᓵ⚍∷∷ᒷリℸ ̣ ꖎ||  !¡ᔑ⚍ᓭᒷ↸.',
  requestText:
    '↸𝙹  ||𝙹⚍  ∴╎ᓭ⍑  ℸ ̣ 𝙹  ʖᒷᓵ𝙹ᒲᒷ  ᔑ  !¡ᔑ∷ℸ ̣   𝙹⎓  ᓭ𝙹ᒲᒷℸ ̣ ⍑╎リ⊣  ⊣∷ᒷᔑℸ ̣ ᒷ∷?',
  requestTitle: 'ᔑᓭᓵᒷリᓭ╎𝙹リ  ℸ ̣ 𝙹  ℸ ̣ ⍑ᒷ  ╎リリᒷ∷  ᓵ╎∷ᓵꖎᒷᓭ',
  specialRequestUnderLevel: '||𝙹⚍∷  ꖎᒷ⍊ᒷꖎ  ╎ᓭ  ℸ ̣ 𝙹𝙹  ꖎ𝙹∴.',
  unknownLotteryPollDescription:
    'Лотарија од непознат тип. Ова е најверојатно грешка.',
  unknownLotteryPollTitle: 'Непознат тип на лотарија.',
  vipButton: 'ᓭᒷᓵ𝙹リ↸  ꖎᔑ||ᒷ∷',
  vipOath:
    '### ╎  ↸𝙹  ⍑ᒷ∷ᒷʖ||  ᓭ𝙹ꖎᒷᒲリꖎ||  ᓭ∴ᒷᔑ∷  ℸ ̣ 𝙹  ⎓ᔑ╎ℸ ̣ ⍑⎓⚍ꖎꖎ||  ᓭᒷ∷⍊ᒷ  ℸ ̣ ⍑ᒷ  𝙹⎓⎓╎ᓵ╎ᔑꖎ  ↸╎ᓭᓵ𝙹∷↸  ᓭᒷ∷⍊ᒷ∷  ⎓𝙹∷  ℸ ̣ ⍑ᒷ  ᓭℸ ̣ ⚍↸ᒷリℸ ̣ ᓭ  𝙹⎓  ⎓ᓵᓭᒷ.',
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
