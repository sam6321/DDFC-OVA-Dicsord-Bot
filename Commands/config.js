const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Update or display a guild config setting(s).";
exports.usage = "(prefix)config (display/set) (config name) (value/undefined)";

exports.call = function (bot, msg, args)
{
    let guild_settings = require("."+funcs.guildfolder(msg.guild)+"/settings.json");
    let desc = '';
    let embed = new Discord.RichEmbed();
    if (args[1].toLowerCase() == "set")
    {
        if (!args[3])
        {
            msg.channel.send("You didn't give me a new value! If you wish to delete a config, ask me to set it to undefined. If you wish you to create an empty config, ask me to set it to null.");
            return;
        }
        if (!guild_settings[args[2]])
        {
            msg.channel.send(args[2]+" doesn't exist, but I'll create it for you anyways.");
        }
        switch (args[3])
        {
            case "null":
                guild_settings[args[2]] = null;
                break;
            case "undefined":
                delete guild_settings[args[2]];
                break;
            case "true":
                guild_settings[args[2]] = true;
                break;
            case "false":
                guild_settings[args[2]] = false;
                break;
            default:
                if (parseInt(args[3])+'' == args[3])
                {
                    guild_settings[args[2]] = parseInt(args[3]);
                }
                else
                {
                    guild_settings[args[2]] = args[3];
                }
                break;
        }
        msg.channel.send("Set config "+args[2]+" to "+guild_settings[args[2]]);
        fs.writeFile(funcs.guildfolder(msg.guild)+"/settings.json", JSON.stringify(guild_settings,null,4), function(){});
        return;
    }
    else if (args[1].toLowerCase() == "display")
    {
        for (var U in guild_settings)
        {
            desc += "__**"+U+"**__ : "+guild_settings[U]+"\n";
        }
        embed.setTitle(msg.guild.name+"'s config list:")
        .setDescription(desc);
        msg.channel.send({embed});
        return;
    }
}