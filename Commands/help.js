const fs = require('fs');
const Discord = require('discord.js');

exports.description = "Recieve a list of commands.";
exports.info = module.exports.description;
exports.usage = "*help (blank/compact/command name)";
exports.category = "misc";

exports.call = function (context)
{
    let args = context.args;
    let embed = new Discord.RichEmbed().setTitle("Command List");

    if(context.guild)
    {
        embed.setDescription(`**The prefix for this server is ${context.guildSettings.prefix}**\nType '*help (command name)' to see the usage of each command.\n\n`);
    }
    else
    {
        embed.setDescription(`**DM Channel requires no prefix**\n\n`);
    }

    if (args[1] !== undefined)
    {
        if (args[1] === "compact")
        {
            fs.readdir("./Commands", (err, files) => 
            {
                let desc = '';

                for (const file of files)
                {
                    let filename = file.substr(0, file.length - 3);
                    let m = require(`./${file}`);
                    desc += "__" + context.guildSettings.prefix + filename + "__: " + m.description + "\n";
                }

                embed.setDescription(desc);
                context.send({embed});
            });
        }
        else if (!fs.existsSync("../Commands/" + args[1] + ".js"))
        {
            let m = require("../Commands/" + args[1] + ".js");
            embed.setTitle(context.guildSettings.prefix + args[1]);
            embed.setDescription(m.info.replace(/\*/g , context.guildSettings.prefix) + "\n__Usage:__ " + m.usage + "\n\n".replace(/\*/g , context.guildSettings.prefix));
            context.send({embed});
        }
        else
        {
            context.send("I can't find any command called " + args[1]);
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

            for (const file of files)
            {
                let filename = file.substr(0, file.length - 3);
                let m = require(`./${file}`);
                desc[m.category] += "__" + context.guildSettings.prefix + filename + "__\n" + m.description.replace(/\*/g , context.guildSettings.prefix) + "\n\n";
            }

            embed.addField("Miscellaneous", desc.misc);
            embed.addField("Moderation", desc.moderation);
            embed.addField("Administration", desc.administration);
            embed.addField("Music", desc.music);

            context.send({embed});
        });
    }
};
