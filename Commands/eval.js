const config = require("../config/config.js");

exports.description = "Bot developer command.";
exports.info = exports.description;
exports.usage = "*eval (code)";
exports.category = "hidden";

exports.call = function (context)
{
    let globalConfig = config.globalConfig();

    if (context.author.id !== globalConfig.host)
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
