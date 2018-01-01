const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Softban a user. Deletes all of their messages, but they can still rejoin.";
exports.info = module.exports.description;
exports.usage = "(prefix)softban (mention/id/username+tag) (reason)";
exports.category = "moderation";

exports.call = function (bot, msg, args)
{
	if (!msg.member.hasPermission("BAN_MEMBERS"))
    {
        msg.channel.send("Insufficient permissions.");
    }
    let member = funcs.findMember(msg, args);
    if (!member)
    {
        msg.channel.send("Couldn't find that member."+(msg.content.includes("#") ? " Maybe try mentioning that user instead?" : ""));
        return;
    }
    member.ban(7, (args.length > 2 ? args.slice(2).join(" ") : "No reason given"));
    msg.guild.unban(member.user);
    msg.channel.send(member.user.tag+" was softbanned! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given"));
}
