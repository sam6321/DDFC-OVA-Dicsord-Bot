var funcs = require('../funcs.js');

exports.description = "Say hello!";
exports.usage = "(prefix)hello";

exports.call = function (bot, msg, args)
{
    let prefix = "";

    if(msg.guild)
    {
        let guild_settings = funcs.guildSettings(msg.guild);
        prefix = guild_settings.prefix;
    }

    msg.channel.send(`Hello! I'm ${bot.user.tag}. Please type '${prefix}help' for a list of commands!`);
};