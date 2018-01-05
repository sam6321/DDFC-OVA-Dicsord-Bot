var funcs = require("../funcs.js");

exports.description = "Kick a user.";
exports.info = module.exports.description;
exports.usage = "*kick (mention/id/username+tag) (reason)";
exports.category = "moderation";

exports.call = function (context)
{
    let args = context.args;

    if (!context.member.hasPermission("KICK_MEMBERS"))
    {
        context.send("Insufficient permissions.");
    }

    let member = funcs.findMember(context.msg, args);
    let joinedArgs = context.args.join('');

    if (!member)
    {
        context.send("Couldn't find that member."+(joinedArgs.includes("#") ? " Maybe try mentioning that user instead?" : ""));
        return;
    }

    member.kick(args.length > 2 ? args.slice(2).join(" ") : "No reason given")
        .then(() => context.send(member.user.tag+" was kicked! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given")))
        .catch(err => context.send("Failed to kick user " + member.user.tag +". Reason: " + err.message));
};
