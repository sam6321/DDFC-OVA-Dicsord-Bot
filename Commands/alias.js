exports.description = "Alias a command, so that when the alias name is entered, it resolves to the provided command text.";
exports.usage = "*alias (name) (nothing / command string / delete)";
exports.info = module.exports.description;
exports.category = "administration";

exports.call = function (context)
{
    if (!context.guild)
    {
        context.send("This command can only be used from within a guild.");
        return;
    }

    let aliases = context.guildConfig.aliases;
    let aliasName = context.args[1];
    let subcommand = context.args[2];
    let response = null;

    if (subcommand)
    {
        subcommand = subcommand.toLowerCase();
    }

    switch (subcommand)
    {
        case undefined:
            let alias = aliases[aliasName];

            response = "No alias registered with the name " + aliasName;

            if (alias)
            {
                response = "Alias " + aliasName + " resolves to " + alias;
            }
            break;

        case "delete":
            delete aliases[aliasName];

            response = "Alias " + aliasName + " delete.";
            break;

        default:
            // Attempt to use anything else as a valid command string.
            let command = context.args.slice(2).join(' ');

            aliases[aliasName] = command;

            response = "Alias " + aliasName + " set to " + command;
            break;
    }

    context.send(response);
};
