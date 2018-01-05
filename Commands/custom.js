var funcs = require("../funcs.js");
const fs = require('fs');

exports.description = "Create, edit, or remove a custom command.";
exports.usage = "*custom (new/edit/remove) (name) (arguments) (response)";
exports.info = exports.usage+"\nExample: *custom new roll [sides] I rolled a ${sides} sided die and got a ${randomNumber:[1,${sides}]}";
exports.category = "administration";

exports.call = function (context)
{
    let args = context.args;
    let settings = context.guildSettings;

    if (!settings)
    {
        context.send("This command can only be used from within a guild.");
        return;
    }

	if (args[1] !== 'new')
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
	
    if (params[0] == '')
    {
    	params.length = 0;
    }

    settings.customCommands[name] = {params:params, response:response};

    fs.writeFileSync(funcs.guildfolder(context.guild)+"/settings.json", JSON.stringify(settings,null,4));
};
