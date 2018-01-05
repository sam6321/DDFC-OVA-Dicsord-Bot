require.extensions[".txt"] = function (module, filename) 
{
    module.exports = fs.readFileSync(filename, "utf8");
};

const Discord = require("discord.js");
const Command = require("./core/command.js");
const fs = require("fs");
const funcs = require("./funcs.js");
let bSettings = require("./core/config.js")();

const bot = new Discord.Client();
let commandDispatcher = new Command.Dispatcher();
commandDispatcher.addDirectory("./Commands"); // Add all commands from this directory in to the dispatcher.

let messageHandlers = {};

// Handle a guild text channel message.
messageHandlers.text = function (msg)
{
    let guild_settings = funcs.guildSettings(msg.guild);

    if (!msg.content.startsWith(guild_settings.prefix) && !msg.content.startsWith(`${bSettings.prefix}help`))
    {
        return;
    }

    // Ignore the prefix, and split args in to words.
    let args = msg.content.slice(guild_settings.prefix.length).split(" ");

    if (guild_settings.disabled.includes(args[0].toLowerCase()))
    {
        return; //return if the command is disabled in the guild
    }

    commandDispatcher.dispatch(args[0], bot, msg, args, guild_settings);
};

// Handle a direct message.
messageHandlers.dm = function (msg)
{
    // No prefix in DM
    let args = msg.content.split(" ");
    commandDispatcher.dispatch(args[0], bot, msg, args);
};

// Handle a group chat message.
messageHandlers.group = function (msg)
{
    // Just use whatever the default prefix is for group chats.
    // This bot will probably never be in group chat anyway.
    if(!msg.content.startsWith(bSettings.prefix))
    {
        return;
    }

    let args = msg.content.slice(bSettings.prefix.length).split(" ");
    commandDispatcher.dispatch(args[0], bot, msg, args);
};

// Handle a voice chat message?
messageHandlers.voice = function (msg)
{
    console.log("Weird attempt to handle text response in voice channel.");
};

bot.on("guildMemberAdd", member => {
    let guild_settings = funcs.guildSettings(member.guild);
    let channel = member.guild.channels.get(guild_settings.greet_channel);

    channel.send("Welcome to the server " + member.user.tag + ". We hope you enjoy yourself!");
});

bot.on("guildMemberRemove", member => {
    let guild_settings = funcs.guildSettings(member.guild);
    let channel = member.guild.channels.get(guild_settings.greet_channel);

    channel.send("Goodbye " + member.user.tag + ". We hope you enjoyed your time here!");
});

bot.on("ready", () =>
{
    console.log("Bot is ready.");
    console.log(`Logged in as ${bot.user.tag}.`);
    bot.user.setGame(`Type ${bSettings.prefix}help to get started.`);
});

bot.on("guildCreate", guild =>
{
    funcs.guildfolder(guild); 
});

// Don"t have events/add yet.
/*
bot.on("guildMemberAdd", member =>
{
    let guild_settings = require(funcs.guildfolder(member.guild)+"/settings.json");
    require("./events/add")(member, guild_settings);
})
*/ 

bot.on("message", msg =>
{
    if(msg.author === bot.user)
    {
        return; // Never respond to ourself.
    }

    let handler = messageHandlers[msg.channel.type];

    if(!handler)
    {
        console.log("Unknown message type. Local API version might be out of date.");
        return;
    }

    try
    {
        handler(msg);
    }
    catch(err)
    {
        let id = funcs.randInt(0, 999999999999);
        let guild = msg.guild ? msg.guild.name : "DM";
        let date = new Date();
        let dateString = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`;
        let report = `\n-Error occured in ${guild}, at ${dateString} with ID: ${id}-\n${err}\n`;

        msg.channel.send(`Whoops! Something went wrong executing your command. This has been logged. ID: ${id}`);

        fs.appendFile("./log.txt", report);
        console.error(err);
    }
});

// All good to go.
console.log("Available command(s): ");
commandDispatcher.each(command => {
    console.log(`  ${command}`);
});

bot.login(bSettings.token);


