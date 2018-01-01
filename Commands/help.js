const fs = require('fs');
const Discord = require('discord.js');
var funcs = require('../funcs.js');

exports.description = "Recieve a list of commands.";
exports.usage = "(prefix)help";
exports.category = "misc";

exports.call = function (bot, msg, args)
{
    let embed = new Discord.RichEmbed().setTitle("Command List");
    if(msg.guild)
    {
        var guild_settings = funcs.guildSettings(msg.guild);
        desc = `**The prefix for this server is ${guild_settings.prefix}**\n\n`;
    }
    else
    {
        desc = `**DM Channel requires no prefix**\n\n`;
    }

    fs.readdir("./Commands", (err, files) => 
    {
        let desc = 
        {
            misc : "",
            administration : "",
            moderation : "",
            music : ""
        };

        files.forEach(file => 
        {
            let filename = file.substr(0, file.length - 3);
            let m = require(`./${file}`);
            desc[m.category] += "__" + guild_settings.prefix + filename + "__\n" + m.description + "\nUsage: " + m.usage + "\n\n";
        });
        embed.addField("Miscellaneous", desc.misc);
        embed.addField("Moderation", desc.moderation);
        embed.addField("Administration", desc.administration);
        embed.addField("Music", desc.music);

        msg.channel.send({embed});
    });
};
