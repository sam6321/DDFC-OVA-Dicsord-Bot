const Discord = require('discord.js');
const fs = require('fs');
const funcs = require('./funcs.js');
const MessageHandler = require('./core/messageHandler.js');
const Command = require('./core/command.js');
const config = require("./config/config.js");
const globalConfig = config.globalConfig();

const bot = new Discord.Client();
const messageHandler = new MessageHandler(bot);

bot.on("guildMemberAdd", async member => {
    let guildConfig = await config.globalConfig(member.guild).load();
    let channel = member.guild.channels.get(guildConfig.greet_channel);

    if (channel)
    {
        channel.send("Welcome to the server " + member.user.tag + ". We hope you enjoy yourself!");
    }
});

bot.on("guildMemberRemove", async member => {
    let guildConfig = await config.globalConfig(member.guild).load();
    let channel = member.guild.channels.get(guildConfig.greet_channel);

    if (channel)
    {
        channel.send("Goodbye " + member.user.tag + ". We hope you enjoyed your time here!");
    }
});

bot.on('ready', async () =>
{
    console.log("Bot is ready.");
    console.log(`Logged in as ${bot.user.tag}.`);
    await bot.user.setGame(`Type ${globalConfig.prefix}help to get started.`);
});

bot.on('message', async msg =>
{
    if (msg.author.id === bot.user.id)
    {
        return; // Never respond to ourself.
    }

    try
    {
        await messageHandler.runMessage(msg);
    }
    catch(err)
    {
        let id = funcs.randInt(0, 999999999999);
        let guild = msg.guild ? msg.guild.name : "DM";
        let date = new Date();
        let dateString = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`;
        let report = `\n-Error occurred in ${guild}, at ${dateString} with ID: ${id}-\n${err}\n`;

        msg.channel.send(`Whoops! Something went wrong executing your command. This has been logged. ID: ${id}`);

        fs.appendFile("./log.txt", report, console.error);
        console.error(err);
    }
});

// Add all the commands from the commands folder to the message handler's command list.
new Command.Loader(messageHandler.commands).addDirectory('./Commands');

bot.login(globalConfig.token)
    .then(() => {
        // All good to go.
        console.log("Available command(s): ");
        for (const command of messageHandler.commands)
        {
            console.log(`  ${command[0]}`);
        }
    })
    .catch(console.error);


