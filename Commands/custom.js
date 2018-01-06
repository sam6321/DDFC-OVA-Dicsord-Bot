const runCustomCommand = require("../core/customCommand.js");

exports.description = "Run a custom command.";
exports.usage = "*custom (arguments) (response)";
exports.info = exports.usage+"\nExample: *custom [sides] I rolled a ${sides} sided die and got a ${randomNumber:[1,${sides}]}";
exports.category = "administration";

/*
Language def:

value => any
[value*|e] => Parameter list
${value|functionCall} => valueResolve
Parameter list: name => function call
 */

exports.call = function (context)
{
    let args = context.args;
    let settings = context.guildConfig;

    if (!settings)
    {
        context.send("This command can only be used from within a guild.");
        return;
    }

    // Get the arguments to this and pass them to the custom command function to parse
    let joinedArgs = args.slice(1).join(' ');

    runCustomCommand(context, joinedArgs);
};



/*
let joinedArgs = args.slice(1).join(' ');
let matches = joinedArgs.match(/\[.*?\]/g);

if (!matches.length)
{
    context.send("Custom command params are not well formed. They must take the form [param1, param2, ...].");
    return;
}

// Split each of the fields in the first match, to get an array of values from within the square brackets e.g. "[p1, p2]" => [p1, p2]
let params = matches[0].substr(1, matches[0].length - 2).split(',').map(p => p.trim());

let response = args.slice(1, -params.length) // Remove the last params.length number of arguments from the back of the response
    .join(' ') // Join to a string.
    .slice(matches[0].length + 1) // Remove the params block from the front of the response. This will be as long as the first match.
    .trim(); // Remove any remaining whitespace around the response.

// Form the command parameters and call it.
runCustomCommand(context, {
    params: params,
    response: response
});*/

/*
const runCustomCommand = require("../core/customCommand.js");

exports.description = "Run a custom command.";
exports.usage = "*custom (arguments) (response)";
exports.info = exports.usage+"\nExample: *custom [sides] I rolled a ${sides} sided die and got a ${randomNumber:[1,${sides}]}";
exports.category = "administration";

exports.call = function (context)
{
    let args = context.args;
    let settings = context.guildConfig;

    if (!settings)
    {
        context.send("This command can only be used from within a guild.");
        return;
    }

    let joinedArgs = args.slice(1).join(' ');
    let matches = joinedArgs.match(/\[.*?\]/g);

    if (!matches.length)
    {
        context.send("Custom command params are not well formed. They must take the form [param1, param2, ...].");
        return;
    }

    // Split each of the fields in the first match, to get an array of values from within the square brackets e.g. "[p1, p2]" => [p1, p2]
    let params = matches[0].substr(1, matches[0].length - 2).split(',').map(p => p.trim());

    let response = args.slice(1, -params.length) // Remove the last params.length number of arguments from the back of the response
        .join(' ') // Join to a string.
        .slice(matches[0].length + 1) // Remove the params block from the front of the response. This will be as long as the first match.
        .trim(); // Remove any remaining whitespace around the response.

    // Form the command parameters and call it.
    runCustomCommand(context, {
        params: params,
        response: response
    });
};
 */