const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Clears an amount of messages.";
exports.usage = "(prefix)clear (number of messages) (any/bots/users)";

exports.call = function (bot, msg, args)
{
    let amount = parseInt(args[1]);
    let type = 'any';
    if (args[2].toLowerCase() == "bots")
    {
        any = 'bots';
    }
    else if (args[2].toLowerCase() == "users")
    {
        any = 'users';
    }
    msg.channel.fetchMessages({limit:amount}).then((messages) =>
    {
        if (any == 'bots')
        {
            messages = messages.filter(msg => msg.author.bot);
        }
        else if (any == 'users')
        {
            messages = messages.filter(msg => !msg.author.bot);
        }
        msg.channel.send("Deleted "+messages.size+" messages!");
        messages.deleteAll();
    });
}
