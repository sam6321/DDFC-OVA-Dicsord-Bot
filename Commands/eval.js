const fs = require('fs');
const Discord = require('discord.js');
const bSettings = require("../core/config.js")();
var funcs = require("../funcs.js");

exports.description = "Bot developer command.";
exports.info = exports.description
exports.usage = "*eval (code)";
exports.category = "hidden";

exports.call = function (bot, msg, args)
{
    if (msg.author.id !== bSettings.host)
    {
        return;
    }
    try
    {
        eval(args.slice(1).join(" "));
    }
    catch(err)
    {
        console.log(err);
    }
}
