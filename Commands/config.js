const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Update or display a guild config setting(s).";
exports.usage = "(prefix)config (display/set)(config name) (value)";

exports.call = function (bot, msg, args)
{
    let guild_settings = funcs.guildfolder(msg.guild);

}