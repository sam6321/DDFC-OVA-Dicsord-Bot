const path = require("path");
const fs = require("fs");
var funcs = require("../funcs.js");

exports.description = "Setting user encryption key."

module.exports = function (bot, msg, args)
{
    let guildDirectory = funcs.guildfolder(msg.guild);
    let key = args[1];

    if(!guildDirectory)
    {
        return;
    }

    if(!key.length)
    {
        msg.channel.send("Please provide an actual key.");
        return;
    }

    if(key.length > 1024)
    {
        // Can't let people store too much.
        key = key.slice(0, 1024);
    }

    let userKeyPath = path.join(guildDirectory, `${msg.author.id}_key.json`);

    let keyJson = {
        key: key
    };

    fs.writeFile(userKeyPath, JSON.stringify(keyJson));

    msg.channel.send(`Your key has been set to ${key}.`);
}
