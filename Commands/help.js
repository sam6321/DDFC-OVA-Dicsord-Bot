const fs = require('fs');

exports.description = "Recieve a list of commands."

module.exports = function (bot, msg, args)
{
    let embed = new Discord.RichEmbed().setTitle("Command List");
    let desc = "";
    fs.readdir("./", (err, files) => 
    {
        files.forEach(file => 
        {
            desc += "__**"+file.substr(0, file.length-4)+"**__\n"+require(file).description+"\n\n";
        });
        embed.setDescription(desc);
        msg.channel.send(embed);
        return;
    });
}
