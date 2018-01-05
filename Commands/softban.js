var funcs = require("../funcs.js");

exports.description = "Softban a user. Deletes all of their messages, but they can still rejoin.";
exports.info = module.exports.description;
exports.usage = "*softban (mention/id/username+tag) (reason)";
exports.category = "moderation";

exports.call = function (context)
{
    let args = context.args;

	if (!context.member.hasPermission("BAN_MEMBERS"))
    {
        context.send("Insufficient permissions.");
    }

    let member = funcs.findMember(context.msg, args);
    let joinedArgs = args.join('');

    if (!member)
    {
        context.send("Couldn't find that member."+(joinedArgs.includes("#") ? " Maybe try mentioning that user instead?" : ""));
        return;
    }

    let error = err => context.send("Failed to softban user " + member.user.tag +". Reason: " + err.message);
    member.ban(7, (args.length > 2 ? args.slice(2).join(" ") : "No reason given"))
        .then(() => {
            context.guild.unban(member.user)
                .then(() => context.send(member.user.tag+" was softbanned! Reason: "+(args.length > 2 ? args.slice(2).join(" ") : "No reason given")))
                .catch(error);
        })
        .catch(error);
};
