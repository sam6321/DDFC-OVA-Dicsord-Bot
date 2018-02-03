var funcs = require("../funcs.js");

exports.description = "Magic 8 ball.";
exports.usage = "*8ball (question)";
exports.info = module.exports.description;
exports.category = "misc";

const responses = ["Yes.","Absolutely.","I garuntee it.","Probably.","I have no idea.","No.","Not at all.","Nope.","Probably not.","Ask Riko."];

exports.call = async function (context)
{
    await context.send(funcs.sample(responses));
};
