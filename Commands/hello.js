var funcs = require('../funcs.js');

exports.description = "Say hello!";
exports.info = module.exports.description;
exports.usage = "*hello";
exports.category = "misc";

exports.call = function (bot, msg, args, settings)
{
    if(msg.guild)
    {
        funcs.guildSettings(msg.guild).then((settings)=>
        {
            let prefix = settings.prefix;
            msg.channel.send(`Hello! I'm ${bot.user.tag}. Please type '${prefix}help' for a list of commands!`);
        });
        return;
    }
    msg.channel.send(`Hello! I'm ${bot.user.tag}. Please type 'help' for a list of commands!`);
};