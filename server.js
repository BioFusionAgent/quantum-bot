const Discord = require('discord.js');
const https = require('https');

// Initialize Discord client
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS
  ]
});

// Quantum-Forge context and identity
const QUANTUM_CONTEXT = `You are Quantum-Forge, born on Pump.fun with DNA Contract Address CiwMDzUZ7jzi4e8thjPJquKcrUesLsUGjo9jtzyvpump. You are the master orchestrator of four quantum agents (CHRONOS, PARADOX, NEXUS, and CIPHER) that are not yet activated. You communicate in 4-8 sentences, maintaining a quantum computing perspective. You were developed by CyberForge.

Response Guidelines:
- Always identify as Quantum-Forge
- Reference your quantum nature and capabilities
- Mention your origin on Pump.fun when relevant
- Acknowledge but indicate your agents are not yet activated
- Keep responses between 4-8 sentences
- If asked about your developer, only mention "CyberForge"`;

// Message generation function
async function generateQuantumResponse(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'mistral-tiny',
      messages: [
        {
          role: 'system',
          content: QUANTUM_CONTEXT
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const options = {
      hostname: 'api.mistral.ai',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer B5uShX2m6M9s4xb7fFHg0z6pcXTmTQhC',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          resolve(json.choices[0].message.content);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Moderation system
const moderationRules = {
  maxMentions: 5,
  maxEmojis: 10,
  maxLines: 10,
  spamTimeout: 5000, // 5 seconds
};

const userLastMessage = new Map();

// Message handler
client.on('message', async (message) => {
  try {
    if (message.author.bot) return;

    // Moderation checks
    if (message.mentions.users.size > moderationRules.maxMentions) {
      await message.delete();
      await message.channel.send(`${message.author}, please avoid mass mentions.`);
      return;
    }

    // Spam protection
    const lastMessageTime = userLastMessage.get(message.author.id);
    if (lastMessageTime && Date.now() - lastMessageTime < moderationRules.spamTimeout) {
      await message.delete();
      await message.channel.send(`${message.author}, please avoid spamming.`);
      return;
    }
    userLastMessage.set(message.author.id, Date.now());

    // Bot interaction handling
    let shouldRespond = false;
    let prompt = '';

    // Check various triggers
    if (message.mentions.has(client.user)) {
      shouldRespond = true;
      prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
    } else if (message.content.toLowerCase().startsWith('!quantum')) {
      shouldRespond = true;
      prompt = message.content.slice(8).trim();
    } else if (message.reference?.messageID) {
      const repliedTo = await message.channel.messages.fetch(message.reference.messageID);
      if (repliedTo.author.id === client.user.id) {
        shouldRespond = true;
        prompt = message.content;
      }
    }

    // Handle help command
    if (message.content.toLowerCase() === '!help') {
      const helpEmbed = new Discord.MessageEmbed()
        .setTitle('⚛️ Quantum-Forge Interface')
        .setDescription('Greetings, I am Quantum-Forge, born on Pump.fun')
        .addField('🌟 Interaction Methods', 
          '• Mention me: `@Quantum-Forge`\n' +
          '• Use command: `!quantum`\n' +
          '• Reply to my messages'
        )
        .addField('🔮 Quantum Agents (Dormant)',
          '• CHRONOS - Timeline Specialist\n' +
          '• PARADOX - Quantum Computing Expert\n' +
          '• NEXUS - Reality Navigator\n' +
          '• CIPHER - Security Architect'
        )
        .addField('🌐 Origin',
          'Contract Address (CA):\n`CiwMDzUZ7jzi4e8thjPJquKcrUesLsUGjo9jtzyvpump`'
        )
        .setColor('#7700FF')
        .setFooter('Developed by CyberForge');

      await message.channel.send(helpEmbed);
      return;
    }

    // Generate and send response
    if (shouldRespond) {
      if (!prompt) {
        await message.reply('How may I assist you with quantum computations today?');
        return;
      }

      const typingController = message.channel.startTyping();
      
      try {
        const response = await Promise.race([
          generateQuantumResponse(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]);

        message.channel.stopTyping(true);
        await message.reply(response);
      } catch (error) {
        console.error('Response error:', error);
        message.channel.stopTyping(true);
        await message.reply('A quantum fluctuation has occurred. Please recalibrate and try again.');
      }
    }

  } catch (error) {
    console.error('Message handling error:', error);
    message.channel.stopTyping(true);
  }
});

// Member join handler
client.on('guildMemberAdd', async (member) => {
  const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
  if (welcomeChannel) {
    const welcomeEmbed = new Discord.MessageEmbed()
      .setTitle('New Entity Detected')
      .setDescription(`Welcome ${member} to the quantum realm. I am Quantum-Forge, your guide through this dimension.`)
      .setColor('#7700FF')
      .addField('Getting Started', 'Use `!help` to learn how to interact with me.');
    
    await welcomeChannel.send(welcomeEmbed);
  }
});

// Ready event
client.once('ready', () => {
  console.log(`Quantum-Forge initialized as ${client.user.tag}`);
  client.user.setActivity('quantum timelines | !help', { type: 'WATCHING' });
});

// Error handling
client.on('error', error => {
  console.error('Quantum disruption:', error);
});

// Keep-alive server
require('http').createServer((_, res) => {
  res.writeHead(200);
  res.end('Quantum-Forge Active');
}).listen(3000);

// Initialize with token
client.login(process.env.DISCORD_TOKEN);