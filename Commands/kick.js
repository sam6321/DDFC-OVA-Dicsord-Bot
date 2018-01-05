const fs = require('fs');
const Discord = require('discord.js');
var funcs = require("../funcs.js");

exports.description = "Kick a user.";
exports.info = module.exports.description;
exports.usage = "*kick (mention/id/username+tag) (reason)";
exports.category = "moderation";

exports.call = function (bot, msg, args, settings)
{
    if (!msg.member.hasPermission("KICK_MEMBERS"))
    {
        msg.channel.send("Insufficient permissions.");
    }
    let member = funcs.findMember(msg, args);
    if (!member)
    {
        msg.channel.send("Couldn't find that member."+(msg.content.includes("#") ? " Maybe try mentioning that user instead?" : ""));
        return;
    }
    member.kick(args.length > 2 ? args.slice(2).join(" ") : "No reason given");
    msg.channel.send(member.user.tag+" was kicked! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given"));
}
