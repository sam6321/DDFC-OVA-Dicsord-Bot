const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Ban a user.";
exports.usage = "(prefix)ban (mention/id/username+tag) (reason)";

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
    member.ban(args.length > 2 ? args.slice(2).join(" ") : "No reason given");
    msg.channel.send(member.user.tag+" was banned! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given"));
}
