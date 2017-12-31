const path = require("path");
const fs = require("fs");
var funcs = require("../funcs.js");

const KEY_MAX_LENGTH = 1024;

exports.description = "Provide an encryption key to encrypt messages with.";
exports.usage = "(prefix)key (your key here)";

exports.call = function (bot, msg, args)
{
    if(msg.channel.type !== "dm")
    {
        msg.channel.send("I suggest you only perform key commands over DM.");
    }

    let key = args.slice(1).join(' ');

    if(!key || !key.length)
    {
        // We're just printing out the key, I guess.
        key = funcs.getUserValue(msg.author, 'encrypt-key');
        msg.channel.send(`Your key is: ${key}`);
    }
    else if ((key.length % 3) !== 0)
    {
        msg.channel.send("Key length must be a multiple of 3.");
    }
    else if (key.length > KEY_MAX_LENGTH)
    {
        msg.channel.send("Key too big.");
    }
    else
    {
        funcs.setUserValue(msg.author, 'encrypt-key', key);
        msg.channel.send(`Your key has been set to ${key}.`);
    }
};
