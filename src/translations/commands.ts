import {
  bold,
  codeBlock,
  type GuildPremiumTier,
  inlineCode,
  italic,
  roleMention,
  userMention,
} from 'discord.js';

export const commandDescriptions = {
  about: 'За Discord ботот',
  ask: 'Преземи најчесто поставувано прашање',
  'chat closest': 'Преземи најблиски прашања',
  'chat embed': 'Ембедирај ги документите',
  'chat models': 'Преземи листа на јазични модели',
  'chat query': 'Испрати промпт до LLM агентот',
  'chat unembedded': 'Преземи неембедирани документи',
  'config get': 'Преземи конфигурација',
  'config reload': 'Освежи ги конфигурациите',
  'config set': 'Измени конфигурација',
  'course info': 'Преземи информации за предмет',
  'course participants': 'Преземи број на слушатели на предмет',
  'course prerequisite': 'Преземи предуслов за предмет',
  'course professors': 'Преземи наставен кадар на предмет',
  'course role': 'Преземи број на корисници во канал на предмет',
  'courses add': 'Земи улоги за многу предмети',
  'courses prerequisite': 'Преземи предмети според предуслов',
  'courses remove': 'Отстрани улоги за многу предмети',
  'course summary': 'Преземи информации за предмет',
  'course toggle': 'Земи или отстрани улога за предмет',
  faq: 'Преземи најчесто поставувано прашање',
  help: 'Преземи листа од сите достапни команди',
  home: 'Преземи линк до изворниот код',
  link: 'Преземи најчесто баран линк',
  'list links': 'Преземи листа од сите линкови',
  'list questions': 'Преземи листа од сите прашања',
  office: 'Преземи информации за просторија',
  prompt: 'Испрати промпт до LLM агентот',
  query: 'Испрати промпт до LLM агентот',
  question: 'Преземи најчесто поставувано прашање',
  room: 'Преземи информации за просторија',
  session: 'Преземи распоред за испитна сесија или колоквиумска недела',
  staff: 'Преземи информации за професор',
  'statistics color': 'Прикажи статистика за улогите за бои',
  'statistics course': 'Прикажи статистика за улогите за предмети',
  'statistics notification': 'Прикажи статистика за улогите за нотификации',
  'statistics program': 'Прикажи статистика за улогите за програми',
  'statistics server': 'Прикажи статистика за серверот',
  'statistics year': 'Прикажи статистика за улогите за години',
  'ticket close': 'Затвори тикет',
  'ticket list': 'Преземи листа од сите тикети',
};

export const commandResponses = {
  allSemestersCoursesAdded: 'Ги земавте предметите од сите семестри.',
  allSemestersCoursesRemoved: 'Ги отстранивте предметите од сите семестри.',
  configurationReloaded: 'Конфигурацијата е освежена.',
  configurationReloading: 'Се освежува конфигурацијата...',
  scriptExecuted: 'Ја извршивте скриптата.',
  ticketClosed: 'Тикетот е затворен.',
};

export const commandResponseFunctions = {
  commandFor: (userId: string) => italic(`за ${userMention(userId)}`),

  courseAdded: (roleId: string) =>
    `Го земавте предметот ${roleMention(roleId)}. ${bold(
      'НАПОМЕНА',
    )}: препорачано е да ги земате предметите од делот ${inlineCode(
      'Channels & Roles',
    )} најгоре во листата на каналите.`,

  courseRemoved: (roleId: string) =>
    `Го отстранивте предметот ${roleMention(roleId)}. ${bold(
      'НАПОМЕНА',
    )}: препорачано е да ги земате предметите од делот ${inlineCode(
      'Channels & Roles',
    )} најгоре во листата на каналите.`,

  semesterCoursesAdded: (semester: number | string) =>
    `Ги земавте предметите од семестар ${semester}.`,

  semesterCoursesRemoved: (semester: number | string) =>
    `Ги отстранивте предметите од семестар ${semester}.`,

  serverAnimatedEmojiStat: (emojiCount: number, maxCount: number) =>
    `Анимирани емоџиња: ${emojiCount} / ${maxCount}`,

  serverBoostLevelStat: (boostLevel: GuildPremiumTier) => `Ниво: ${boostLevel}`,

  serverBoostStat: (boostCount: number) => `Бустови: ${boostCount}`,

  serverChannelsStat: (channelCount: number) => `Канали: ${channelCount} / 500`,

  serverEmojiStat: (emojiCount: number, maxCount: number) =>
    `Емоџиња: ${emojiCount} / ${maxCount}`,

  serverInvitesStat: (inviteCount: number | string) => `Покани: ${inviteCount}`,

  serverMembersStat: (memberCount: number, maxMembers: null | number) =>
    maxMembers === null
      ? `Членови: ${memberCount}`
      : `Членови: ${memberCount} / ${maxMembers}`,

  serverRolesStat: (roleCount: number) => `Улоги: ${roleCount} / 250`,

  serverSoundboardSoundsStat: (
    soundCount: number | string,
    maxCount: number | string,
  ) => `Звуци: ${soundCount} / ${maxCount}`,

  serverStickersStat: (stickerCount: number, maxCount: number) =>
    `Стикери: ${stickerCount} / ${maxCount}`,
};

export const commandErrors = {
  botMissingPermissions:
    'Ботот нема потребни дозволи за да ја изврши оваа команда. Контактирајте ги администраторите.',
  buttonNoPermission: 'Командата не е ваша.',
  commandError:
    'Настана грешка при извршување на командата. Обидете се повторно, или пријавете ја грешката.',
  commandGuildOnly: 'Оваа команда може да се користи само на сервер.',
  commandNoPermission: 'Немате дозвола да ја извршите командата.',
  commandNotFound: 'Командата не постои.',
  configurationSavingFailed: 'Зачувувањето на конфигурацијата беше неуспешно.',
  courseNotFound: 'Предметот не постои.',
  coursesNotFound: 'Предметите не постојат.',
  dataFetchFailed: 'Преземањето на податоците беше неуспешно.',
  faqNotFound: 'Прашањето не постои.',
  invalidChannel: 'Каналот е невалиден.',
  invalidTicket: 'Тикетот не е валиден.',
  invalidTicketType: 'Дадениот тип на тикетот не е валиден.',
  linkNotFound: 'Линкот не постои.',
  linksFetchFailed: 'Преземањето на линковите беше неуспешно.',
  llmDisabled: 'Јазичниот модел е исклучен.',
  llmNotReady: 'Јазичниот модел не е спремен. Обидете се подоцна.',
  llmUnavailable: 'Јазичниот модел не е достапен. Обидете се подоцна.',
  noTicketMembers:
    'Не се избрани членови до кои може да се испрати тикетот. Обидете се на друга категорија.',
  noTickets: 'Нема тикети.',
  questionsFetchFailed: 'Преземањето на прашањата беше неуспешно.',
  roomNotFound: 'Просторијата не постои.',
  sessionNotFound: 'Сесијата не постои.',
  staffNotFound: 'Професорот не постои.',
  ticketingDisabled: 'Тикетите не се овозможени.',
  unknownChatError:
    'Настана грешка при испраќање на промптот. Обидете се повторно.',
};

export const commandErrorFunctions = {
  invalidConfiguration: (error: unknown) =>
    // @ts-expect-error error is unknown
    `Дадената конфигурација не е валидна: ${codeBlock('json', error)}`,
};
