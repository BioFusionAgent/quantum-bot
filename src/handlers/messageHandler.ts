import { Message } from 'discord.js';
import { formatBotResponse } from '../utils/responseFormatter';

export async function handleMessage(message: Message, aiResponse: string) {
  // Track conversation context to avoid repetitive introductions
  const conversationContext = message.channel.messages.cache
    .filter(m => m.author.id === message.client.user?.id)
    .map(m => m.content)
    .join(' ');

  const formattedResponse = formatBotResponse(aiResponse, conversationContext);
  
  try {
    await message.reply({
      content: formattedResponse,
      allowedMentions: { repliedUser: true }
    });
  } catch (error) {
    console.error('Error sending response:', error);
    await message.reply('I encountered an error processing your request.');
  }
}

