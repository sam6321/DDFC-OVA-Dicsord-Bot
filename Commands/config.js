const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

const BLACKLIST = ["enable", "disable", "config"];

exports.description = "Update or display a server config setting(s). Add and remove are used for lists/arrays only.";
exports.info = "Used to modify, create, or delete any server setting (with exceptions).\nTyping '*config display' will give you a list of existing configs and their values.\nSet, add, and remove are three different actions you can make. examples:\n*config set greet false\n*config add banned_users 234642241564442625\n*config remove banned_users 234642241564442625\nSetting a config to undefined will delete that config. It's possible to set arrays by formatting them as such: [item1,item2,item3].\nShorthand commands such as *disable and *enable will do the same thing as this command, but only modify certain configs.\nUsers/channels are represented by their IDs in banned_users, admins, greet_channel, etc. Type '*config display readable' to replace these with the user/channel name. Setting/adding/removing a mention will automatically be turned into an ID.";
exports.usage = "*config (display/set/add/remove) (config name) (value/undefined)";
exports.category = "administration";

exports.call = function (bot, msg, args)
{
    let guild_settings = require("."+funcs.guildfolder(msg.guild)+"/settings.json");
    let desc = '';
    let embed = new Discord.RichEmbed();
    if (args[1].toLowerCase() == "add")
    {
        if (args[2] === "disabled" && BLACKLIST.includes(args[3]))
        {
            msg.channel.send("You're not allowed to disable that command.");
            return;
        }

        if (!Array.isArray(guild_settings[args[2]]))
        {
            msg.channel.send("Add should only be used to add items to pre-existing arrays. Create an array with "+guild_settings.prefix+"config set (config name) []");
            return;
        }
        guild_settings[args[2]].push(funcs.parseString(args.slice(3).join(" ")));
        msg.channel.send("Added item "+args.slice(3).join(" ")+" to "+args[2]);
    }
    else if (args[1].toLowerCase() == "remove")
    {
        if (!Array.isArray(guild_settings[args[2]]))
        {
            msg.channel.send("Remove should only be to remove items from pre-existing arrays. Create an array with "+guild_settings.prefix+"config set (config name) []");
            return;
        }
        for (let i=0;i<guild_settings[args[2]].length;i++)
        {
        	if (guild_settings[args[2]][i] == funcs.parseString(args.slice(3).join(" ")))
        	{
        		guild_settings[args[2]].splice(i,1);
        	}
        }
        msg.channel.send("Removed item "+args.slice(3).join(" ")+" from "+args[2]);
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
            let newValue = JSON.parse(args.slice(3).join(" "));

            if (newValue.some(item => BLACKLIST.includes(item)))
            {
                msg.channel.send("You tried to add a blacklisted item in that array.\nBlacklisted items: " + BLACKLIST.slice(0).join(", "));
                return;
            }

        	guild_settings[args[2]] = newValue;

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
        	if (guild_settings[U] != null && Array.isArray(guild_settings[U]))
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
