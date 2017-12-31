const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Update or display a guild config setting(s). Add and remove are used for lists/arrays only.";
exports.usage = "(prefix)config (display/set/add/remove) (config name) (value/undefined)";

exports.call = function (bot, msg, args)
{
    let guild_settings = require("."+funcs.guildfolder(msg.guild)+"/settings.json");
    let desc = '';
    let embed = new Discord.RichEmbed();
    if (args[1].toLowerCase() == "add")
    {
        if (guild_settings[args[2]].constructor != Array)
        {
            msg.channel.send("Add should only be used to add items to pre-existing arrays. Create an array with "+guild_settings.prefix+"config set (config name) []");
            return;
        }
        guild_settings[args[2]].push(funcs.parseString(args.slice(3).join(" ")));
        msg.channel.send("Added item "+args.slice(3).join(" ")+" to "+args[2]);
    }
    else if (args[1].toLowerCase() == "remove")
    {
        if (guild_settings[args[2]].constructor != Array)
        {
            msg.channel.send("Remove should only be to remove items from pre-existing arrays. Create an array with "+guild_settings.prefix+"config set (config name) []");
            return;
        }
        for (let i=0;i<guild_settings[args[2]].length;i++)
        {
        	if (guild_settings[args[2]] == funcs.parseString(args.slice(3).join(" ")))
        	{
        		guild_settings[args[2]].splice(i,1);
        	}
        }
        msg.channel.send("Removed item from "+args.slice(3).join(" ")+" to "+args[2]);
    }
    else if (args[1].toLowerCase() == "set")
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
        if (args[3].startsWith("["))
        {
        	guild_settings[args[2]] = JSON.parse(args.slice(3).join(" "));
        	msg.channel.send("Set config "+args[2]+" to "+guild_settings[args[2]].toString());
        }
        else
        {
            guild_settings[args[2]] = funcs.parseString(args.slice(3).join(" "));
            if (funcs.parseString(args.slice(3).join(" ")) == undefined)
            {
            	delete guild_settings[args[2]];
            }
            msg.channel.send("Set config "+args[2]+" to "+guild_settings[args[2]]);
        }
    }
    else if (args[1].toLowerCase() == "display")
    {
        for (var U in guild_settings)
        {
        	if (guild_settings[U] != null && guild_settings[U].constructor == Array)
        	{
        		desc += "__**"+U+"**__ : ["+guild_settings[U].toString()+"]\n";
        		continue;
        	}
            desc += "__**"+U+"**__ : "+guild_settings[U]+"\n";
        }
        embed.setTitle(msg.guild.name+"'s config list:")
        .setDescription(desc);
        msg.channel.send({embed});
        return;
    }
    fs.writeFile(funcs.guildfolder(msg.guild)+"/settings.json", JSON.stringify(guild_settings,null,4), function(){});
    return;
}