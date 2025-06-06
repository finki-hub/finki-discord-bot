import { type ChatInputCommandInteraction, codeBlock } from 'discord.js';

import { labels } from '../translations/labels.js';

export const splitMessage = function* (message: string) {
  if (message === '') {
    yield '';

    return;
  }

  const delimiters = ['\n'];
  const length = 1_999;
  let output;
  let index = message.length;
  let split;
  let currentMessage = message;

  while (currentMessage) {
    if (currentMessage.length > length) {
      split = true;
      for (const char of delimiters) {
        index = currentMessage.slice(0, length).lastIndexOf(char) + 1;

        if (index) {
          split = false;
          break;
        }
      }

      if (split) {
        index = length;
      }

      output = currentMessage.slice(0, Math.max(0, index));
      currentMessage = currentMessage.slice(index);
    } else {
      output = currentMessage;
      currentMessage = '';
    }

    yield output;
  }
};

export const safeReplyToInteraction = async (
  interaction: ChatInputCommandInteraction,
  message: string,
  options?: {
    language?: string;
    mentionUsers?: boolean;
    useCodeBlock?: boolean;
  },
) => {
  const {
    language = '',
    mentionUsers = false,
    useCodeBlock = false,
  } = options ?? {};
  let reply = false;

  for (const output of splitMessage(message)) {
    const nextOutput = output.length === 0 ? labels.none : output;
    const nextReply = useCodeBlock ? codeBlock(language, nextOutput) : output;

    if (reply) {
      await interaction.followUp({
        ...(!mentionUsers && {
          allowedMentions: {
            users: [],
          },
        }),
        content: nextReply,
      });
    } else if (interaction.deferred) {
      await interaction.editReply({
        ...(!mentionUsers && {
          allowedMentions: {
            users: [],
          },
        }),
        content: nextReply,
      });
    } else {
      await interaction.reply({
        ...(!mentionUsers && {
          allowedMentions: {
            users: [],
          },
        }),
        content: nextReply,
      });
    }

    reply = true;
  }
};

const smartSplit = (text: string, maxLength: number): [string, string] => {
  if (text.length <= maxLength) return [text, ''];

  let splitIdx = text.lastIndexOf('\n', maxLength);
  if (splitIdx === -1) {
    splitIdx = text.lastIndexOf(' ', maxLength);
  }

  if (splitIdx === -1) {
    splitIdx = maxLength;
    // For hard breaks, don't remove any characters
    return [text.slice(0, splitIdx), text.slice(splitIdx)];
  }

  // If we split on a newline, include it in the first part and don't trim the second
  if (text[splitIdx] === '\n') {
    return [text.slice(0, splitIdx + 1), text.slice(splitIdx + 1)];
  }

  // If we split on a space, remove only the space (not newlines)
  return [text.slice(0, splitIdx), text.slice(splitIdx + 1)];
};

export const safeStreamReplyToInteraction = async (
  interaction: ChatInputCommandInteraction,
  onChunk: (callback: (chunk: string) => Promise<void>) => Promise<void>,
  options?: {
    language?: string;
    mentionUsers?: boolean;
    useCodeBlock?: boolean;
  },
) => {
  const {
    language = '',
    mentionUsers = false,
    useCodeBlock = false,
  } = options ?? {};

  const MAX_LENGTH = 2_000;
  const buffers: string[] = [''];
  const messageIds: string[] = [];
  let isFirst = true;

  const formatContent = (text: string) =>
    useCodeBlock ? codeBlock(language, text) : text;

  const sendOrEdit = async (index: number, content: string) => {
    if (content.length === 0) {
      return;
    }

    const baseOptions = mentionUsers ? {} : { allowedMentions: { users: [] } };

    if (index === 0) {
      if (isFirst) {
        if (interaction.deferred) {
          const msg = await interaction.editReply({
            ...baseOptions,
            content: formatContent(content),
          });
          messageIds[0] = msg.id;
        } else {
          const msg = await interaction.reply({
            ...baseOptions,
            content: formatContent(content),
          });
          messageIds[0] = msg.id;
        }
        isFirst = false;
      } else {
        await interaction.editReply({
          ...baseOptions,
          content: formatContent(content),
        });
      }
    } else if (messageIds[index]) {
      await interaction.channel?.messages.edit(messageIds[index], {
        content: formatContent(content),
      });
    } else {
      const msg = await interaction.followUp({
        ...baseOptions,
        content: formatContent(content),
      });
      messageIds[index] = msg.id;
    }
  };

  let lastEdit = Date.now();

  const handleChunk = async (chunk: string) => {
    let bufferIndex = buffers.length - 1;
    buffers[bufferIndex] += chunk;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    while (buffers[bufferIndex]!.length > MAX_LENGTH) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [head, tail] = smartSplit(buffers[bufferIndex]!, MAX_LENGTH);
      buffers[bufferIndex] = head;
      buffers.push(tail);
      bufferIndex++;
    }

    const now = Date.now();
    if (now - lastEdit > 1_000) {
      lastEdit = now;
      for (const [i, buffer] of buffers.entries()) {
        await sendOrEdit(i, buffer);
      }
    }
  };

  await onChunk(handleChunk);

  // Final update to ensure all content is sent
  for (const [i, buffer] of buffers.entries()) {
    await sendOrEdit(i, buffer);
  }
};
