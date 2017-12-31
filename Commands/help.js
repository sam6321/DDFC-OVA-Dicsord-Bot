const fs = require('fs');
const Discord = require('discord.js');
var funcs = require('../funcs.js');

exports.description = "Recieve a list of commands.";
exports.usage = "(prefix)help";

exports.call = function (bot, msg, args)
{
    let embed = new Discord.RichEmbed().setTitle("Command List");
    let desc = "**The prefix for this server is "+require("."+funcs.guildfolder(msg.guild)+"/settings.json").prefix+"**\n\n";
    fs.readdir("./Commands", (err, files) => 
    {
        files.forEach(file => 
        {
            let filename = file.substr(0, file.length - 3);
            let m = require(`./${file}`);
            desc += `__***${filename}**__\n${m.description}\n__Usage:__ ${m.usage}\n\n`;

            console.log(m.description);
        });
        
        embed.setDescription(desc);
        msg.channel.send({embed});
    });
};
