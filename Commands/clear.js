const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Clears an amount of messages.";
exports.info = "Clears an amount of messages with the paramater of 'any', 'bots', or 'users'. Any will remove all types of messages, while bots and users deletes messages sent by certain types of accounts.";
exports.usage = "*clear (number of messages) (any/bots/users)";
exports.category = "moderation";

exports.call = function (bot, msg, args)
{
    let amount = parseInt(args[1]);
    let type = 'any';
    if (args[2].toLowerCase() == "bots")
    {
        type = 'bots';
    }
    else if (args[2].toLowerCase() == "users")
    {
        type = 'users';
    }
    msg.channel.fetchMessages({limit:amount}).then((messages) =>
    {
        if (type == 'bots')
        {
            messages = messages.filter(msg => msg.author.bot);
        }
        else if (type == 'users')
        {
            messages = messages.filter(msg => !msg.author.bot);
        }
        msg.channel.send("Deleted "+messages.size+" messages!");
        messages.deleteAll();
    });
}
