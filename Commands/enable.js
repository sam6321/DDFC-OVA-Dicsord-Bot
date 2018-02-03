exports.description = "Enables a command. Shorthand for (prefix)config remove disabled (command).";
exports.usage = "*enable (command)";
exports.info = module.exports.description;
exports.category = "administration";

exports.call = async function (context)
{
    let config = require("../Commands/config.js");
    context.setArgs("config remove disabled " + context.args[1]);
    await config.call(context);
};
