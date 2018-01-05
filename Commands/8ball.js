var funcs = require("../funcs.js");

exports.description = "Magic 8 ball.";
exports.usage = "*8ball (question)";
exports.info = module.exports.description;
exports.category = "misc";

exports.call = async function (context)
{
    let responses = ["Yes.","Absolutely.","I garuntee it.","Probably.","I have no idea.","No.","Not at all.","Nope.","Probably not.","Ask Riko."];
    context.send(responses[funcs.randInt(0,responses.length)]);
};
