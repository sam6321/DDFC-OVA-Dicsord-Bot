const Discord = require('discord.js');
const fs = require('fs');
const funcs = require('./funcs.js');
const bSettings = require("./core/globalConfig.js")();
const Config = require("./core/config.js");
const MessageHandler = require('./core/messageHandler.js');
const Command = require('./core/command.js');

const bot = new Discord.Client();
const messageHandler = new MessageHandler(bot);

bot.on("guildMemberAdd", member => {
    new Config.GuildConfigFile(member.guild).load()
        .then(config => {
            let channel = member.guild.channels.get(config.greet_channel);

            if (channel)
            {
                channel.send("Welcome to the server " + member.user.tag + ". We hope you enjoy yourself!");
            }
        });
});

bot.on("guildMemberRemove", member => {
    new Config.GuildConfigFile(member.guild).load()
        .then(config => {
            let channel = member.guild.channels.get(config.greet_channel);

            if (channel)
            {
                channel.send("Goodbye " + member.user.tag + ". We hope you enjoyed your time here!");
            }
        });
});

bot.on('ready', () =>
{
    console.log("Bot is ready.");
    console.log(`Logged in as ${bot.user.tag}.`);
    bot.user.setGame(`Type ${bSettings.prefix}help to get started.`);
});

bot.on('message', (msg) =>
{
    if (msg.author === bot.user)
    {
        return; // Never respond to ourself.
    }

    messageHandler.runMessage(msg)
        .catch(err => {
            let id = funcs.randInt(0, 999999999999);
            let guild = msg.guild ? msg.guild.name : "DM";
            let date = new Date();
            let dateString = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`;
            let report = `\n-Error occured in ${guild}, at ${dateString} with ID: ${id}-\n${err}\n`;

            msg.channel.send(`Whoops! Something went wrong executing your command. This has been logged. ID: ${id}`);

            fs.appendFile("./log.txt", report);
            console.error(err);
    });
});

// Add all the commands from the commands folder to the message handler's command list.
new Command.Loader(messageHandler.commands).addDirectory('./Commands');

// All good to go.
console.log("Available command(s): ");
for (const command of messageHandler.commands)
{
    console.log(`  ${command[0]}`);
}

bot.login(bSettings.token);


