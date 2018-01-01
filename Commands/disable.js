var funcs = require("../funcs.js");

exports.description = "Disables a command. Shorthand for (prefix)config add disabled (command)."
exports.usage = "(prefix)disable (command)";
exports.info = module.exports.description;
exports.category = "administration";

exports.call = function (bot, msg, args)
{
    let config = require("./Commands/config.js");
    config.call(bot, msg, ["config","add","disabled",args[1]]);
}
