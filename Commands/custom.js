var funcs = require("../funcs.js");
const fs = require('fs');

exports.description = "Create, edit, or remove a custom command.";
exports.usage = "*custom (new/edit/remove) (name) (arguments) (response)";
exports.info = exports.usage+"\nExample: *custom new roll [sides] I rolled a ${sides} sided die and got a ${randomNumber:[1,${sides}]}";
exports.category = "administration";

exports.call = function (bot, msg, args, settings)
{
	if (args[1] != 'new')
	{
		return;
	}

    let name = args[2];
    let response = args.slice(4).join(" ");
    let params = args[3].substr(1, args[3].length-2).split(',');

    if (!settings.customCommands)
    {
    	settings.customCommands = {};
    }
    settings.customCommands[name] = {params:params, response:response};
    fs.writeFileSync(funcs.guildfolder(msg.guild)+"/settings.json", JSON.stringify(settings,null,4));
}