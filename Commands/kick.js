var funcs = require("../funcs.js");

exports.description = "Kick a user.";
exports.info = module.exports.description;
exports.usage = "*kick (mention/id/username+tag) (reason)";
exports.category = "moderation";

exports.call = async function (context)
{
    let args = context.args;

    if (!context.member.hasPermission("KICK_MEMBERS"))
    {
        await context.send("Insufficient permissions.");
        return;
    }

    let member = funcs.findMember(context.msg, args);
    let joinedArgs = context.args.join('');

    if (!member)
    {
        await context.send("Couldn't find that member."+(joinedArgs.includes("#") ? " Maybe try mentioning that user instead?" : ""));
        return;
    }

    try
    {
        await member.kick(args.length > 2 ? args.slice(2).join(" ") : "No reason given");
        await context.send(member.user.tag+" was kicked! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given"))
    }
    catch (err)
    {
        await context.send("Failed to kick user " + member.user.tag +". Reason: " + err.message);
    }
};
