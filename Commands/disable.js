exports.description = "Disables a command. Shorthand for (prefix)config add disabled (command).";
exports.usage = "*disable (command)";
exports.info = module.exports.description;
exports.category = "administration";

exports.call = async function (context)
{
    let config = require("../Commands/config.js");
    context.setArgs("config add disabled " + context.args[1]);
    await config.call(context);
};
