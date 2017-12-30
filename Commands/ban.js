const fs = require('fs');
const Discord = require('discord.js');

exports.description = "Ban a user.";
exports.usage = "(prefix)ban (mention/id/username+tag) (reason)";

exports.call = function (bot, msg, args)
{
    let member;
    if (args[1].startsWith("<@"))
    {
        member = args[1].mentions.members.first();
    }
    else if (args[1].includes("#"))
    {
        let iter = msg.guild.members.entries();
        for (let i=0;i<msg.guild.members.size;i++)
        {
            let M = iter.next().value;
            if (M[1].user.tag == args[1])
            {
                member = M[1] 
                break;
            }
        }
    }
    else if (args[1].length == 18)
    {
        member = msg.guild.members.get(args[1]);
    }
    member.ban(args.length > 2 ? args.slice(2).join(" ") : "No reason given");
    msg.channel.send(member.user.tag+" was banned! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given"));
}
