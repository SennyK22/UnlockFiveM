const Discord = require('discord.js'),

    { Client, GatewayIntentBits, ApplicationCommandOptionType, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js'),
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
        failIfNotExists: false,
        retryLimit: 3,
        presence: {
            status: 'online'
        }
    }),
    config = require('./config.json'),
    commandes = require('./src/structures/commands'),
    events = require('./src/structures/events')
    
commandes()
events(client)

module.exports = client
client.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return interaction.reply('Error');
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        command.run(client, interaction);
    }
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.login(config.token).catch(err => {
    console.error('Erreur de connexion:', err);
});

process.on('beforeExit', (code) => { //
  console.error('[antiCrash] :: [beforeExit]');
  console.error(code);
});
process.on('exit', (error) => { //
  console.error('[antiCrash] :: [exit]');
  console.error(error);
});
/* process.on('multipleResolves', (type, promise, reason) => {
  console.error('[antiCrash] :: [multipleResolves]');
  console.error(type, promise, reason);
}); */
process.on('unhandledRejection', (error) => {
    console.error('Erreur non gérée (Promise):', error);
});
process.on('rejectionHandled', (promise) => { //
  console.error('[antiCrash] :: [rejectionHandled]');
  console.error(promise);
})
process.on("uncaughtException", (error) => {
    console.error('Exception non attrapée:', error);
    process.exit(1);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('[antiCrash] :: [uncaughtExceptionMonitor]');
  console.error(err, origin);
});
process.on('warning', (warning) => { //
  console.error('[antiCrash] :: [warning]');
  console.error(warning);
});