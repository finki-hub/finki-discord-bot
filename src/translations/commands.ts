import {
  bold,
  channelMention,
  codeBlock,
  type GuildPremiumTier,
  inlineCode,
  italic,
  roleMention,
  userMention,
} from 'discord.js';

import type { PollCategory } from '../lib/schemas/PollCategory.js';

import { type Role } from '../lib/schemas/Role.js';

export const commandDescriptions = {
  about: 'За Discord ботот',
  'admin add': 'Предложи нов администратор',
  'admin remove': 'Отстрани администратор',
  'ad send': 'Испрати реклама',
  anto: 'Преземи Анто факт',
  ask: 'Преземи најчесто поставувано прашање',
  'chat closest': 'Преземи најблиски прашања',
  'chat embed': 'Ембедирај ги документите',
  'chat models': 'Преземи листа на јазични модели',
  'chat query': 'Испрати промпт до LLM агентот',
  'chat unembedded': 'Преземи неембедирани документи',
  classroom: 'Преземи информации за просторија',
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
  'experience add': 'Додади поени за активност',
  'experience dump': 'Извлечи ги сите потсетници од базата на податоци',
  'experience get': 'Преземи ниво и активност',
  'experience leaderboard': 'Преземи листа на членови според активност',
  'experience set': 'Измени поени за активност',
  faq: 'Преземи најчесто поставувано прашање',
  help: 'Преземи листа од сите достапни команди',
  home: 'Преземи линк до изворниот код',
  invite: 'Преземи пристапен линк за серверот',
  'irregulars add': 'Предложи нов член на Вонредните',
  'irregulars remove': 'Отстрани член од Вонредните',
  link: 'Преземи најчесто баран линк',
  'list links': 'Преземи листа од сите линкови',
  'list questions': 'Преземи листа од сите прашања',
  'lottery end': 'Заврши лотарија предвремено',
  'manage anto-add': 'Додади Анто факт',
  'manage anto-delete': 'Избриши Анто факт',
  'manage anto-dump': 'Извлечи ги сите Анто факти од базата на податоци',
  'manage anto-mass-add': 'Додади многу Анто факти',
  'manage company-delete': 'Избриши компанија',
  'manage company-dump': 'Извлечи ги сите компании од базата на податоци',
  'manage company-mass-add': 'Додади многу компании',
  'manage company-set': 'Додади или измени компанија',
  'manage infomessage-delete': 'Избриши информативна порака',
  'manage infomessage-dump':
    'Извлечи ги сите информативни пораки од базата на податоци',
  'manage infomessage-get': 'Преземи информативна порака',
  'manage infomessage-set': 'Додади или измени информативна порака',
  'manage link-content': 'Прикажи содржина на линк',
  'manage link-delete': 'Избриши линк',
  'manage link-dump': 'Извлечи ги сите линкови од базата на податоци',
  'manage link-set': 'Додади или измени линк',
  'manage question-content': 'Прикажи содржина на прашање',
  'manage question-delete': 'Избриши прашање',
  'manage question-dump': 'Извлечи ги сите прашања од базата на податоци',
  'manage question-set': 'Додади или измени прашање',
  'manage rule-delete': 'Избриши правило',
  'manage rule-dump': 'Извлечи ги сите правила од базата на податоци',
  'manage rule-set': 'Додади или измени правило',
  'members barred': 'Преземи листа од забранети членови',
  'members boosters': 'Преземи листа од бустери',
  'members boys': 'Преземи листа од членови на Boys',
  'members count': 'Прикажи број на членови на серверот',
  'members girlies': 'Преземи листа од членови на Girlies',
  'members irregulars': 'Преземи листа од вонредните членови',
  'members management': 'Преземи листа од членовите на управа',
  'members regulars': 'Преземи листа од редовните членови',
  'members statistics': 'Прикажи статистика за улогите за членови',
  'members vip': 'Преземи ги членовите на ВИП',
  message: 'Испрати порака',
  office: 'Преземи информации за просторија',
  ping: 'Прикажи време на одзив',
  'poll add': 'Додади опции на анкети',
  'poll close': 'Затвори анкета за гласање',
  'poll create': 'Креирај анкета',
  'poll delete': 'Избриши анкета',
  'poll edit': 'Измени наслов и опис на анкета',
  'poll info': 'Информации за анкета',
  'poll list': 'Преземи листа од сите анкети',
  'poll open': 'Отвори анкета за гласање',
  'poll remove': 'Избриши опции на анкета',
  'poll show': 'Прикажи анкета',
  'poll stats': 'Прикажи статистика за гласови',
  profile: 'Преземи информации за студент',
  prompt: 'Испрати промпт до LLM агентот',
  purge: 'Бриши пораки',
  query: 'Испрати промпт до LLM агентот',
  question: 'Преземи најчесто поставувано прашање',
  register: 'Регистрирај команди',
  'regulars add': 'Додади нов редовен член',
  'regulars lottery': 'Спроведи лотарија за влез во редовните',
  'regulars recreate': 'Рекреирај го привремениот канал за редовни',
  'regulars remove': 'Отстрани редовен член',
  'reminder create': 'Креирај потсетник',
  'reminder delete': 'Избриши потсетник',
  'reminder dump': 'Извлечи ги сите потсетници од базата на податоци',
  'reminder list': 'Преземи листа од сите потсетници',
  rules: 'Преземи правила на серверот',
  'script colors': 'Испрати ембед за избирање бои',
  'script courses': 'Испрати ембеди за избирање предмети',
  'script info': 'Испрати ги сите информации за серверот',
  'script notifications': 'Испрати ембед за избирање нотификации',
  'script programs': 'Испрати ембед за избирање смерови',
  'script register': 'Регистрирај команди',
  'script rules': 'Испрати ги правилата на серверот',
  'script special': 'Испрати ембед за барања за анкети',
  'script years': 'Испрати ембед за избирање години',
  session: 'Преземи распоред за испитна сесија или колоквиумска недела',
  'special bar': 'Предложи забрана на член',
  'special delete': 'Избриши анкета',
  'special list': 'Прикажи листа од сите анкети',
  'special override': 'Спроведи анкета',
  'special remaining': 'Прикажи листа од членови кои не гласале на анкета',
  'special unbar': 'Предложи укинување на забрана на корисник',
  staff: 'Преземи информации за професор',
  'statistics color': 'Прикажи статистика за улогите за бои',
  'statistics course': 'Прикажи статистика за улогите за предмети',
  'statistics notification': 'Прикажи статистика за улогите за нотификации',
  'statistics program': 'Прикажи статистика за улогите за програми',
  'statistics server': 'Прикажи статистика за серверот',
  'statistics year': 'Прикажи статистика за улогите за години',
  'ticket close': 'Затвори тикет',
  'ticket list': 'Преземи листа од сите тикети',
  timeout: 'Дај си тајмаут',
  'vip add': 'Предложи нов член за ВИП',
  'vip recreate': 'Рекреирај го привремениот канал за ВИП',
  'vip remove': 'Предложи бркање на член на ВИП',
};

export const commandResponses = {
  adSent: 'Рекламата е испратена.',
  allCoursesAdded: 'Ги земавте сите предмети.',
  allCoursesRemoved: 'Ги отстранивте сите предмети.',
  allSemestersCoursesAdded: 'Ги земавте предметите од сите семестри.',
  allSemestersCoursesRemoved: 'Ги отстранивте предметите од сите семестри.',
  antoDeleted: 'Го избришавте Анто фактот.',
  antosCreated: 'Креиравте Анто фактот.',
  chooseRemindersToDelete:
    'Изберете ги потсетниците кои сакате да ги избришете.',
  commandsRegistered: 'Ги регистриравте командите.',
  companiesCreated: 'Креиравте компании.',
  companyCreated: 'Креиравте компанија.',
  companyDeleted: 'Ја избришавте компанијата.',
  configurationReloaded: 'Конфигурацијата е освежена.',
  configurationReloading: 'Се освежува конфигурацијата...',
  embedCreated: 'Креиравте ембед.',
  faqDeleted: 'Го избришавте прашањето.',
  infoCreated: 'Креиравте информативна порака.',
  infoDeleted: 'Ја избришавте информативната порака.',
  infoUpdated: 'Информативната порака е ажурирана.',
  linkDeleted: 'Го избришавте линкот.',
  lotteryEnded: 'Лотаријата е завршена.',
  messageCreated: 'Испративте порака.',
  noBarred: 'Нема членови со забрана.',
  noReminders: 'Нема потсетници.',
  noVoters: 'Нема гласачи.',
  pollClosed: 'Анкетата е затворена.',
  pollDeleted: 'Анкетата е избришана.',
  pollOpen: 'Анкетата е отворена за гласање.',
  pollOptionsAdded: 'Опциите се додадени.',
  pollOptionsDeleted: 'Опциите се избришани.',
  pollOverridden: 'Спроведовте анкета.',
  reminderDeleted: 'Го избришавте потсетникот.',
  ruleCreated: 'Креиравте правило.',
  ruleDeleted: 'Го избришавте правилото.',
  scriptExecuted: 'Ја извршивте скриптата.',
  temporaryChannelRecreated: 'Го рекреиравте привремениот канал.',
  ticketClosed: 'Тикетот е затворен.',
  timeoutImpossible: 'Не може да си поставите тајмаут.',
  timeoutSet: 'Си поставивте тајмаут.',
  userGivenRegular: 'Го додадовте корисникот во редовните корисници.',
  userRemovedRegular: 'Го отстранивте корисникот од редовните корисници.',
  voteRemoved: 'Го тргнавте гласот.',
};

export const commandResponseFunctions = {
  colorAddedOrRemoved: (roleId: string, added: boolean) =>
    `Ја ${added ? 'земавте' : 'отстранивте'} бојата ${roleMention(roleId)}.`,

  commandFor: (userId: string) => italic(`за ${userMention(userId)}`),

  courseAdded: (roleId: string) =>
    `Го земавте предметот ${roleMention(roleId)}. ${bold(
      'НАПОМЕНА',
    )}: препорачано е да ги земате предметите од делот ${inlineCode(
      'Channels & Roles',
    )} најгоре во листата на каналите.`,

  courseAddedOrRemoved: (roleId: string, added: boolean) =>
    `Го ${added ? 'земавте' : 'отстранивте'} предметот ${roleMention(
      roleId,
    )}. ${bold(
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

  deletingMessages: (count: number | string) => `Се бришат ${count} пораки...`,

  experienceAdded: (experience: number | string, userId: string) =>
    `Додадовте ${experience} поени за активност на корисникот ${userMention(
      userId,
    )}.`,

  experienceSet: (experience: number | string, userId: string) =>
    `Ги поставивте поените за активност на корисникот ${userMention(
      userId,
    )} на ${experience}.`,

  lotteryPollCreated: (channelId: string) =>
    `Креиравте лотарија во ${channelMention(channelId)}.`,

  messageStarred: (messageUrl: string) => `Пораката ${messageUrl} е обележана!`,

  notificationAddedOrRemoved: (roleId: string, added: boolean) =>
    `${added ? 'земавте' : 'отстранивте'} нотификации за ${roleMention(
      roleId,
    )}.`,

  ping: (ping: number | string) => `${ping} ms`,

  pollEdited: (edits: string) => `Ја изменивте анкетата (${edits}).`,

  pollOverriden: (decision: string) =>
    `Спроведовте анкета со одлука ${inlineCode(decision)}.`,

  pollStats: (pollTitle: string) =>
    `Преглед на гласовите за анкетата ${inlineCode(pollTitle)}`,

  programAddedOrRemoved: (roleId: string, added: boolean) =>
    `Го ${added ? 'земавте' : 'отстранивте'} смерот ${roleMention(roleId)}.`,

  reminderCreated: (timestamp: string, message: string) =>
    `Креиравте потсетник во ${timestamp} за: ${message}.`,

  seePollChanges: (command: string) =>
    `Користете ${command} за да ги видите промените.`,

  semesterCoursesAdded: (semester: number | string) =>
    `Ги земавте предметите од семестар ${semester}.`,

  semesterCoursesRemoved: (semester: number | string) =>
    `Ги отстранивте предметите од семестар ${semester}.`,

  serverAnimatedEmojiStat: (emojiCount: number, maxCount: number) =>
    `Анимирани емоџиња: ${emojiCount} / ${maxCount}`,

  serverBoostLevelStat: (boostLevel: GuildPremiumTier) => `Ниво: ${boostLevel}`,

  serverBoostStat: (boostCount: number) => `Бустови: ${boostCount}`,

  serverChannelsStat: (channelCount: number) => `Канали: ${channelCount} / 500`,

  serverCommandsStat: (commandCount: number) => `Команди: ${commandCount}`,

  serverEmojiStat: (emojiCount: number, maxCount: number) =>
    `Емоџиња: ${emojiCount} / ${maxCount}`,

  serverInvitesStat: (inviteCount: number) => `Покани: ${inviteCount}`,

  serverMembers: (memberCount: number | string | undefined) =>
    `Серверот има ${memberCount ?? 'непознат број на'} членови.`,

  serverMembersStat: (memberCount: number, maxMembers: null | number) =>
    maxMembers === null
      ? `Членови: ${memberCount}`
      : `Членови: ${memberCount} / ${maxMembers}`,

  serverRolesStat: (roleCount: number) => `Улоги: ${roleCount} / 250`,

  serverSoundboardSoundsStat: (soundCount: number, maxCount: number) =>
    `Звуци: ${soundCount} / ${maxCount}`,

  serverStickersStat: (stickerCount: number, maxCount: number) =>
    `Стикери: ${stickerCount} / ${maxCount}`,

  voteAdded: (option: string) => `Гласавте за ${inlineCode(option)}.`,

  yearAddedOrRemoved: (roleId: string, added: boolean) =>
    `Годината ${roleMention(roleId)} е ${added ? 'земена' : 'отстранета'}.`,
};

export const commandErrors = {
  alreadyIrregular: 'Веќе сте член на Вонредните.',
  alreadyVipMember: 'Веќе сте член на ВИП.',
  antoCreationFailed: 'Креирањето на Анто фактот беше неуспешно.',
  antoNotFound: 'Анто фактот не постои.',
  antosCreationFailed: 'Креирањето на Анто фактите беше неуспешно.',
  barsFetchFailed: 'Преземањето на забраните беше неуспешно.',
  buttonNoPermission: 'Командата не е ваша.',
  classroomNotFound: 'Просторијата не постои.',
  commandError:
    'Настана грешка при извршување на командата. Обидете се повторно, или пријавете ја грешката.',
  commandNoPermission: 'Немате дозвола да ја извршите командата.',
  commandNotFound: 'Командата не постои.',
  commandsNotRegistered: 'Регистрирањето на командите беше неуспешно.',
  companiesCreationFailed: 'Креирањето на компаниите беше неуспешно.',
  companiesNotFound: 'Компаниите не постојат.',
  companyCreationFailed: 'Креирањето на компанијата беше неуспешно.',
  companyNotFound: 'Компанијата не постои.',
  configurationSavingFailed: 'Зачувувањето на конфигурацијата беше неуспешно.',
  courseNotFound: 'Предметот не постои.',
  coursesNotFound: 'Предметите не постојат.',
  dataFetchFailed: 'Преземањето на податоците беше неуспешно.',
  embedSendError: 'Креирањето на ембедот беше неуспешно.',
  faqCreationFailed: 'Креирањето на прашањето беше неуспешно.',
  faqNotFound: 'Прашањето не постои.',
  faqSendFailed: 'Испраќањето на прашањето беше неуспешно.',
  guildFetchFailed: 'Преземањето на серверот беше неуспешно.',
  infoNotFound: 'Информативната порака не постои.',
  invalidAntos: 'Анто фактите се во невалиден формат.',
  invalidChannel: 'Каналот е невалиден.',
  invalidColor: 'Бојата е невалидна.',
  invalidCompanies: 'Компаниите се во невалиден формат.',
  invalidDateTime: 'Датумот и/или времето се невалидни.',
  invalidLink: 'Линкот е невалиден.',
  invalidLinks: 'Линковите се во невалиден формат.',
  invalidRole: 'Улогата е невалидна.',
  invalidRoles: 'Улогите се невалидни.',
  invalidTicket: 'Тикетот не е валиден.',
  invalidTicketType: 'Дадениот тип на тикетот не е валиден.',
  inviteCreationFailed: 'Креирањето на пристапен линк беше неуспешно.',
  linkCreationFailed: 'Креирањето на линкот беше неуспешно.',
  linkNotFound: 'Линкот не постои.',
  linkSendFailed: 'Испраќањето на линкот беше неуспешно.',
  linksFetchFailed: 'Преземањето на линковите беше неуспешно.',
  llmUnavailable: 'Јазичниот модел не е достапен. Обидете се подоцна.',
  memberNotFound: 'Членот не постои.',
  noAnto: 'Анто фактите не се креирани.',
  noTicketMembers:
    'Не се избрани членови до кои може да се испрати тикетот. Обидете се на друга категорија.',
  noTickets: 'Нема тикети.',
  notImplemented: 'Оваа функционалност не е имплементирана.',
  oathNoPermission: 'Заклетвата не е ваша.',
  optionNotFound: 'Опцијата не постои.',
  pollAnonymous: 'Анкетата е анонимна.',
  pollCreationFailed: 'Креирањето на анкетата беше неуспешно.',
  pollDeletionFailed: 'Бришењето на анкетата беше неуспешно.',
  pollNoOptions: 'Анкетата нема опции.',
  pollNoPermission: 'Анкетата не е ваша.',
  pollNotFound: 'Анкетата не постои.',
  pollOrOptionNotFound: 'Анкетата или опцијата не постои.',
  pollsFetchFailed: 'Преземањето на анкетите беше неуспешно.',
  pollTooManyOptions: 'Анкетата има премногу опции.',
  pollVotesFetchFailed: 'Преземањето на гласовите беше неуспешно.',
  promptFailed: 'Настана грешка при одговарање.',
  questionsFetchFailed: 'Преземањето на прашањата беше неуспешно.',
  reminderCreateError: 'Креирањето на потсетникот беше неуспешно.',
  reminderNoPermission: 'Ова не е ваш потсетник.',
  remindersLoadError: 'Настана грешка при вчитување на потсетниците.',
  rulesFetchFailed: 'Преземањето на правилата беше неуспешно.',
  rulesNotFound: 'Правилата не постојат.',
  scriptNotExecuted: 'Скриптата не е извршена.',
  serverOnlyCommand: 'Командата се повикува само во серверот.',
  sessionNotFound: 'Сесијата не постои.',
  specialPollsFetchFailed: 'Преземањето на анкетите беше неуспешно.',
  staffNotFound: 'Професорот не постои.',
  ticketingDisabled: 'Тикетите не се овозможени.',
  unknownChatError:
    'Настана грешка при испраќање на промптот. Обидете се повторно.',
  unsupportedChannelType: 'Типот на каналот не е поддржан.',
  userAdmin: 'Корисникот е администратор.',
  userBarred: 'Корисникот е забранет.',
  userBot: 'Корисникот е бот.',
  userIrregularMember: 'Корисникот е член на Вонредните.',
  userNotAdmin: 'Корисникот не е администратор.',
  userNotBarred: 'Корисникот не е забранет.',
  userNotFound: 'Корисникот не постои.',
  userNotIrregular: 'Корисникот не е член на Вонредните.',
  userNotLevel: 'Корисникот е под потребното ниво.',
  userNotMember: 'Корисникот не е член на серверот.',
  userNotRegular: 'Корисникот не е член од редовните корисници.',
  userNotVipMember: 'Корисникот не е член на ВИП.',
  userRegular: 'Корисникот е член на редовните корисници.',
  userSpecialPending: 'Постои предлог за овој корисник.',
  userVipMember: 'Корисникот е член на ВИП.',
};

export const commandErrorFunctions = {
  invalidConfiguration: (error: unknown) =>
    // @ts-expect-error error is unknown
    `Дадената конфигурација не е валидна: ${codeBlock('json', error)}`,

  pollNotOfCategory: (category: PollCategory) =>
    `Анкетата не е од категоријата ${inlineCode(category)}.`,

  pollNoVotePermission: (roleIds: string[]) =>
    `Немате дозвола да гласате на анкетата. Потребна ви е барем една од улогите: ${roleIds
      .map((roleId) => roleMention(roleId))
      .join(', ')}`,

  roleNotFound: (role: Role) => `Улогата ${role} не постои.`,
};
