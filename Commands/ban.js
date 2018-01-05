var funcs = require("../funcs.js");

exports.description = "Ban a user.";
exports.info = "Ban a user by their tag, e.g John#1337, id, e.g 234642241564442625, or just mention them. Providing a reason is optional.";
exports.usage = "*ban (mention/id/username+numbers) (reason)";
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
        context.send("Couldn't find that member." + (joinedArgs.includes("#") ? " Maybe try mentioning that user instead?" : ""));
        return;
    }

    member.ban(args.length > 2 ? args.slice(2).join(" ") : "No reason given")
        .then(() => context.send(member.user.tag + " was banned! Reason: " + (args.length > 2 ? args.slice(2).join(" ") : "No reason given")))
        .catch(err => context.send("Failed to ban user " + member.user.tag +". Reason: " + err.message));
};
