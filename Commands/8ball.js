var funcs = require("../funcs.js");

exports.description = "Magic 8 ball."
exports.usage = "(prefix)8ball (question)";
exports.category = "misc";

exports.call = function (bot, msg, args)
{
    let responses = ["Yes.","Absolutely.","I garuntee it.","Probably.","I have no idea.","No.","Not at all.","Nope.","Probably not.","Ask Riko."];
    msg.channel.send(responses[funcs.randInt(0,responses.length)]);
    return;
}
