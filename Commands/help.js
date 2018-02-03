const fse = require('fs-extra');
const Discord = require('discord.js');

exports.description = "Recieve a list of commands.";
exports.info = module.exports.description;
exports.usage = "*help (blank/compact/command name)";
exports.category = "misc";

exports.call = async function (context)
{
    let args = context.args;
    let embed = new Discord.RichEmbed().setTitle("Command List");

    if(context.guild)
    {
        embed.setDescription(`**The prefix for this server is ${context.guildConfig.prefix}**\nType '*help (command name)' to see the usage of each command.\n\n`);
    }
    else
    {
        embed.setDescription(`**DM Channel requires no prefix**\n\n`);
    }

    if (args[1] !== undefined)
    {
        if (args[1] === "compact")
        {
            let desc = '';

            for (const file of await fse.readdir("./Commands"))
            {
                let filename = file.substr(0, file.length - 3);
                let m = require(`./${file}`);
                desc += "__" + context.guildConfig.prefix + filename + "__: " + m.description + "\n";
            }

            embed.setDescription(desc);
            await context.send({embed});
        }
        else if (!await fse.exists("../Commands/" + args[1] + ".js"))
        {
            let m = require("../Commands/" + args[1] + ".js");
            embed.setTitle(context.guildConfig.prefix + args[1]);
            embed.setDescription(m.info.replace(/\*/g , context.guildConfig.prefix) + "\n__Usage:__ " + m.usage + "\n\n".replace(/\*/g , context.guildConfig.prefix));
            await context.send({embed});
        }
        else
        {
            await context.send("I can't find any command called " + args[1]);
        }
    }
    else
    {
        let desc =
        {
            misc : "",
            administration : "",
            moderation : "",
            music : ""
        };

        for (const file of await fse.readdir("./Commands"))
        {
            let filename = file.substr(0, file.length - 3);
            let m = require(`./${file}`);
            desc[m.category] += "__" + context.guildConfig.prefix + filename + "__\n" + m.description.replace(/\*/g , context.guildConfig.prefix) + "\n\n";
        }

        embed.addField("Miscellaneous", desc.misc);
        embed.addField("Moderation", desc.moderation);
        embed.addField("Administration", desc.administration);
        embed.addField("Music", desc.music);

        await context.send({embed});
    }
};
