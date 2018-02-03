var funcs = require("../funcs.js");

exports.description = "Softban a user. Deletes all of their messages, but they can still rejoin.";
exports.info = module.exports.description;
exports.usage = "*softban (mention/id/username+tag) (reason)";
exports.category = "moderation";

exports.call = async function (context)
{
    let args = context.args;

	if (!context.member.hasPermission("BAN_MEMBERS"))
    {
        await context.send("Insufficient permissions.");
        return;
    }

    let member = funcs.findMember(context.msg, args);
    let joinedArgs = args.join('');

    if (!member)
    {
        await context.send("Couldn't find that member."+(joinedArgs.includes("#") ? " Maybe try mentioning that user instead?" : ""));
        return;
    }

    try
    {
        await member.ban(7, (args.length > 2 ? args.slice(2).join(" ") : "No reason given"));
        await context.guild.unban(member.user);
        await context.send(member.user.tag+" was softbanned! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given"));
    }
    catch(err)
    {
        context.send("Failed to softban user " + member.user.tag +". Reason: " + err.message);
    }
};
