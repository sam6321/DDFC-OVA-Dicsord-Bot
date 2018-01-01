const fs = require('fs');
const Discord = require('discord.js');
var funcs = require('../funcs.js');

exports.description = "Recieve a list of commands.";
exports.info = module.exports.description;
exports.usage = "*help (blank/compact/command name)";
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

    if (args[1] != undefined)
    {
        if (args[1] == "compact")
        {
            fs.readdir("./Commands", (err, files) => 
            {
                let desc = '';
                files.forEach(file => 
                {
                    let filename = file.substr(0, file.length - 3);
                    let m = require(`./${file}`);
                    desc += "__" + guild_settings.prefix + filename + "__: " + m.description + "\n";
                });
                embed.setDescription(desc);
                msg.channel.send({embed});
                return;
            });
        }
        else if (!fs.existsSync("../Commands/" + args[1] + ".js"))
        {
            let m = require("../Commands/" + args[1] + ".js");
            embed.setTitle(guild_settings.prefix+args[1]);
            embed.setDescription(m.info.replace(/\*/g , guild_settings.prefix) + "\n__Usage:__ " + m.usage + "\n\n".replace(/\*/g , guild_settings.prefix));
            msg.channel.send({embed});
            return;
        }
        else
        {
            msg.channel.send("I can't find any command called "+args[1]);
            return;
        }
    }
    else
    {
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
                desc[m.category] += "__" + guild_settings.prefix + filename + "__\n" + m.description.replace(/\*/g , guild_settings.prefix) + "\n\n";
            });
            embed.addField("Miscellaneous", desc.misc);
            embed.addField("Moderation", desc.moderation);
            embed.addField("Administration", desc.administration);
            embed.addField("Music", desc.music);

            msg.channel.send({embed});
        });
    }
};
