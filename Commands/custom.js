const Parser = require('../custom/parser.js');

exports.description = "Run a custom command.";
exports.usage = "*custom (arguments) (response)";
exports.info = exports.usage+"\nExample: *custom [sides] I rolled a ${sides} sided die and got a ${randomNumber:[1,${sides}]}";
exports.category = "administration";

function resolveVariables (initialVariables, parametersBlock, argumentsBlock)
{
    let variables = {},
        args = [],
        params = [];

    Object.assign(variables, initialVariables); // Copy over the initial variables first

    // Split the arguments using spaces
    if (argumentsBlock)
    {
        args = argumentsBlock.split(' ').map(a => a.trim());
    }

    // Split the parameters using commas
    if (parametersBlock)
    {
        params = parametersBlock.split(',').map(p => p.trim());
    }

    if (args.length !== params.length)
    {
        throw new Error("Incorrect number of arguments given. Expected: " + params.length + ". Got: " + args.length);
    }

    // Now, copy in the variables defined by the arguments
    for(let i = 0; i < params.length; i++)
    {
        variables[params[i]] = args[i];
    }

    return variables;
}

function runCustomCommand (context)
{
    // The code for this should be in three parts
    // 1: A starting parameter names block, e.g. [blah1, blah2, blah3]
    // 2: A code block, starting and ending with "
    // 3: A set of parameters that should be separated by spaces at the end.
    let text = context.args.slice(1).join(' ');
    let parameterBlock = "";
    let codeBlock = "";

    let initialVariables =
    {
        author : context.author.username,
        server : context.guild.name
    };

    if (text[0] === '[')
    {
        // We should we start with a parameters block, so pull that out
        let end = text.indexOf(']');

        if (end === -1)
        {
            throw new Error("Parameter block open without a matching close ]");
        }

        parameterBlock = text.slice(1, end);
        text = text.slice(end + 1).trim(); // Remove the parameter block from the text.
    }

    if (text[0] === '"')
    {
        // We're now looking at the main code block. This has to start and end with ", but we only want to consider the very first and very final "
        let end = text.lastIndexOf('"');

        if (end === -1)
        {
            throw new Error("Code block open without a matching close \"");
        }

        codeBlock = text.slice(1, end);
        text = text.slice(end + 1).trim(); // Remove the code block from the text.
    }
    else
    {
        throw new Error("Custom command without code block.");
    }

    // The final things left in the text should be the arguments, which give values to the parameters.

    // Assign values to the variable names given by the parameter block, from the values given in the arguments block.
    let variables = resolveVariables(initialVariables, parameterBlock, text);

    // Now, make a parse tree from the ${} blocks found in the code portion
    let parser = new Parser(codeBlock, context);
    let parseTree = parser.run();

    context.send(parseTree.evaluate(variables));
}

exports.call = function (context)
{
    let args = context.args;
    let settings = context.guildConfig;

    if (!settings)
    {
        context.send("This command can only be used from within a guild.");
        return;
    }

    if (args[1] === 'new')
    {
        let alias = require("./alias.js");
        context.setArgs("*alias " + args[2] + " *custom " + args.slice(3).join(" "));
        alias.call(context);
        return;
    }

    try
    {
        runCustomCommand(context);
    }
    catch(e)
    {
        context.send(e.message);
    }
};
