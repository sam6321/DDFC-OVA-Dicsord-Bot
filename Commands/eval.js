const bSettings = require("../core/config.js")();

exports.description = "Bot developer command.";
exports.info = exports.description;
exports.usage = "*eval (code)";
exports.category = "hidden";

exports.call = function (bot, msg, args, settings)
{
    if (msg.author.id !== bSettings.host)
    {
        return;
    }

    try
    {
        eval(args.slice(1).join(" "));
    }
    catch(err)
    {
        console.log(err);
    }
};
