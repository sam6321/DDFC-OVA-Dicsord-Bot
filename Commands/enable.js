var funcs = require("../funcs.js");

exports.description = "Enables a command. Shorthand for (prefix)config remove disabled (command)."
exports.usage = "*enable (command)";
exports.info = module.exports.description;
exports.category = "administration";

exports.call = function (bot, msg, args)
{
    let config = require("../Commands/config.js");
    config.call(bot, msg, ["config","remove","disabled",args[1]]);
}
