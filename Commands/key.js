const path = require("path");
const fs = require("fs");
var funcs = require("../funcs.js");

const KEY_MAX_LENGTH = 1024;

exports.description = "Provide an encryption key to encrypt messages with.";
exports.usage = "(prefix)key (your key here)";

module.exports = function (bot, msg, args)
{
    if(msg.channel.type !== "dm")
    {
        msg.channel.send("I suggest you provide your key to me over DM, to keep your key secret.");
    }

    let memberFolder = funcs.memberFolder(msg.author);
    let key = args[1];

    if(!memberFolder)
    {
        // Silently return if we can't find their local folder for some reason.
        return;
    }

    if(!key || !key.length)
    {
        msg.channel.send("Please provide an actual key.");
        return;
    }

    if(key.length > KEY_MAX_LENGTH)
    {
        // Can't let people store too much.
        key = key.slice(0, KEY_MAX_LENGTH);
    }

    let userKeyPath = path.join(memberFolder, `encrypt_key.json`);

    let keyJson = {
        key: key
    };

    fs.writeFile(userKeyPath, JSON.stringify(keyJson), e => {
        if(!e)
        {
            msg.channel.send(`Your key has been set to ${key}.`);
        }
        else
        {
            console.log(`key: Error setting key for ${msg.author.tag}`);
        }
    });
};
