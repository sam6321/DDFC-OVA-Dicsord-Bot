const bSettings = require("../core/globalConfig.js")();

exports.description = "Bot developer command.";
exports.info = exports.description;
exports.usage = "*eval (code)";
exports.category = "hidden";

exports.call = function (context)
{
    if (context.author.id !== bSettings.host)
    {
        return;
    }

    try
    {
        eval(context.args.slice(1).join(" "));
    }
    catch(err)
    {
        console.log(err);
    }
};
