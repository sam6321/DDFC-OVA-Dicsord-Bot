const fs = require('fs');
const Discord = require('discord.js');

exports.description = "Recieve a list of commands.";

exports.call = function (bot, msg, args)
{
    let embed = new Discord.RichEmbed().setTitle("Command List");
    let desc = "";
    fs.readdir("./Commands", (err, files) => 
    {
        files.forEach(file => 
        {
            desc += "__***"+file.substr(0, file.length-3)+"**__\n"+require("./"+file).description+"\n\n";
            console.log(require("./"+file).description);
        });
        embed.setDescription(desc);
        msg.channel.send({embed});
        return;
    });
}
