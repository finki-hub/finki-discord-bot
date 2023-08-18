/* eslint-disable id-length */

import { type ProgramName } from "../types/ProgramName.js";
import { type ProgramShorthand } from "../types/ProgramShorthand.js";

export const commandDescriptions = {
  about: "Информации за ботот",
  anto: "Анто факт",
  calendar: "Академски календар",
  classroom: "Информации за простории",
  config: "Види или измени конфигурација на ботот",
  "course info": "Информации за предмети",
  "course participants": "Број на слушатели на предмети",
  "course prerequisite": "Предуслови за предмети",
  "course professors": "Наставен кадар на предмети",
  "course role": "Број на корисници во канали на предмети",
  "course summary": "Сите информации за предмети",
  "course toggle": "Земи или отстрани улога за предмет",
  "courses add": "Земи улоги за предмети",
  "courses prerequisite": "Сите предмети според предуслов",
  "courses program": "Сите предмети според смер",
  "courses remove": "Отстрани улоги за предмети",
  crosspost: "Вклучи или исклучи crossposting",
  embed: "Креирај ембед",
  "experience add": "Додади поени за активност на член",
  "experience get": "Ниво и активност за член",
  "experience leaderboard": "Листа на најактивни членови",
  faq: "Најчесто поставувани прашања",
  help: "Помош за командите",
  home: "Изворен код на ботот",
  invite: "Пристапен линк до серверот",
  link: "Најчесто барани линкови",
  "list links": "Листа од сите линкови",
  "list questions": "Листа од сите прашања",
  members: "Број на членови на серверот",
  ping: "Пинг на ботот",
  "poll add": "Додади опции на анкети",
  "poll close": "Затвори ја анкетата за гласање",
  "poll create": "Креирај анкети",
  "poll delete": "Избриши анкети",
  "poll edit": "Измени наслов и опис на анкети",
  "poll info": "Информации за анкети",
  "poll list": "Излистај ги сите анкети",
  "poll open": "Отвори ја анкетата за гласање",
  "poll remove": "Избриши опции на анкети",
  "poll show": "Прикажи анкети",
  "poll stats": "Статистика за анкети",
  profile: "Информации за студенти",
  purge: "Бриши пораки",
  "question get": "Превземи прашање",
  "question set": "Додади или измени прашање",
  quiz: "Започни го квизот Кој Сака Да Биде Морален Победник",
  register: "Регистрирај ги сите команди на ботот",
  reminder: "Потсетник",
  "script colors": "Испрати ембед за избирање бои",
  "script courses": "Испрати ембеди за избирање предмети",
  "script info": "Испрати ги сите информации за серверот",
  "script notifications": "Испрати ембед за избирање нотификации",
  "script programs": "Испрати ембед за избирање смерови",
  "script register": "Синхронизирај ги командите",
  "script rules": "Испрати ги правилата на серверот",
  "script vip": "Испрати ембед за ВИП",
  "script years": "Испрати ембед за избирање години",
  session: "Распоред за испитни сесии и колоквиуми",
  staff: "Информации за професори",
  "statistics color": "Статистика за улогите за бои",
  "statistics course": "Статистика за улогите за предмети",
  "statistics notification": "Статистика за улогите за нотификации",
  "statistics program": "Статистика за улогите за програми",
  "statistics server": "Статистика за серверот",
  "statistics year": "Статистика за улогите за години",
  timetable: "Распоред на часови",
  "vip add": "Предложете нов член за ВИП",
  "vip delete": "Избриши ВИП анкета",
  "vip invite": "Покани член во ВИП",
  "vip invited": "Прикажи ги сите членови кои се поканети во ВИП",
  "vip list": "Излистај ги сите ВИП анкети",
  "vip members": "Моментален состав на ВИП",
  "vip override": "Одлучи за ВИП анкета",
  "vip remaining": "Прикажи ги членовите кои се уште не гласале",
  "vip remove": "Покренете гласање за недоверба против член на ВИП",
  "vip upgrade": "Предложи обичен ВИП член за полноправен член на ВИП",
};

export const programMapping: { [index in ProgramName]: ProgramShorthand } = {
  ИМБ: "imb",
  КЕ: "ke",
  КИ: "ki",
  КН: "kn",
  ПИТ: "pit",
  СИИС: "siis",
};

export const emojis = {
  "!": "❗",
  "#": "#️⃣",
  "*": "*️⃣",
  "?": "❓",
  "0": "0️⃣",
  "1": "1️⃣",
  "2": "2️⃣",
  "3": "3️⃣",
  "4": "4️⃣",
  "5": "5️⃣",
  "6": "6️⃣",
  "7": "7️⃣",
  "8": "8️⃣",
  "9": "9️⃣",
  "10": "🔟",
  a: "🇦",
  b: "🇧",
  c: "🇨",
  d: "🇩",
  e: "🇪",
  f: "🇫",
  g: "🇬",
  h: "🇭",
  i: "🇮",
  j: "🇯",
  k: "🇰",
  l: "🇱",
  m: "🇲",
  n: "🇳",
  o: "🇴",
  p: "🇵",
  q: "🇶",
  r: "🇷",
  s: "🇸",
  t: "🇹",
  u: "🇺",
  v: "🇻",
  w: "🇼",
  x: "🇽",
  y: "🇾",
  z: "🇿",
};

export const errors = {
  commandNoPermission: "Немате дозвола да ја извршите оваа команда.",
  commandNotFound: "Таа команда не постои.",
  courseNotFound: "Не постои таков предмет.",
  invalidChannel: "Невалиден канал.",
  pollNoPermission: "Ова не е ваша анкета.",
  pollNotFound: "Анкетата не постои.",
  quizNoPermission: "Ова не е ваш квиз.",
  serverOnlyCommand: "Оваа команда се повикува само во сервер.",
};

export const quizHelp =
  "Добредојдовте во помош делот на квизот!\n\nКако се игра?\nВо текот на квизот ќе ви бидат поставени 15 прашања поврзани со темата и областа на ФИНКИ и серверот.\nОдговорете на сите 15 прашања и ќе добиете две награди.\nЕдна од наградите е сопствена боја на серверот, а другата за сега е тајна. :face_with_hand_over_mouth:\n\nВо текот на квизот ќе имате 3 алатки за помош:\n- 50 - 50\n- друго прашање\n- помош од компјутер\n\nОвие алатки ќе може да ги искористите само до 12-тото прашање, после тоа НЕ СЕ ДОЗВОЛЕНИ!\n\nКвизот нема бесконечен број на обиди, смеете да го играте само 3 пати!\n\nДоколку се случи да изгубите еден обид и мислите дека неправедно сте го изгубиле, контактирајте нè за да решиме овој проблем.\nВи посакуваме среќна и забавна игра!";
