import { userMention } from 'discord.js';

import type { Ticket } from '../lib/schemas/Ticket.js';

export const ticketMessages = {
  createTicket: `# Тикети\nДоколку имате некакво прашање, проблем, предлог, или слично, овде имате можност да креирате тикет до надлежните луѓе. Изберете го типот на тикетот и напишете го Вашето образложение. Вашиот тикет е приватен. Ќе добиете одговор во најбрз можен рок.\n\nМожете да испратите тикет до:`,
  sendMessage:
    'Напишете ја Вашата порака во следните 30 минути. Во спротивно, тикетот ќе биде отфрлен.',
};

export const ticketMessageFunctions = {
  ticketCreated: (userId: string) =>
    `${userMention(userId)} Ова е Ваш приватен тикет. Образложете го Вашиот проблем или прашање овде. Ќе добиете одговор во најбрз можен рок. Доколку сакате да го затворите тикетот, притиснете го копчето за затворање.`,
  ticketLink: (ticketLink: string) => `Креиран е Вашиот тикет: ${ticketLink}`,
  ticketStarted: (roles: string) => `${roles} Креиран е тикет до Вас.`,
  ticketTypes: (ticketTypes: Ticket[]) =>
    ticketTypes
      .map((ticket) => `- ${ticket.name}: ${ticket.description}`)
      .join('\n'),
};
