const funcs = require('../funcs.js');

const availableFuncs =
{
    randomNumber : funcs.randInt,
    randomResponse : funcs.sample
};

function customFunc (func, params, variables, n, context)
{
    n += 1;
    let arr = params.substr(1, params.length-2).split(',');

    for (let i=0; i<arr.length; i++)
    {
        arr[i] = customStringParse(arr[i], variables, n, context);
    }

    arr = arr.map(p => funcs.parseString(p));
    arr.push(context);
    if (!Array.isArray(arr))
    {
        return new Error("I wasn't given a list [] for the paramaters of "+func+".");
    }
    if (arr.length-1 < availableFuncs[func].length)
    {
        return new Error(`${func} takes ${availableFuncs[func].length} parameters, but I was given ${arr.length}.`);
    }
    return availableFuncs[func].apply(null, arr);
}

function customStringParse (string, variables, n, context)
{
    if (n !== undefined && n > 2)
    {
        return new Error("Do not nest more than two functions/variables inside of each other.");
    }
    if (typeof string !== 'string')
    {
        return string;
    }
    let tokens = string.match(/\$\{([^(\$\{)\}]*|\$\{([^(\$\{)\}]*|\$\{[^(\$\{)\}]*\})*\})*\}/g);
    if (!tokens)
    {
        return string;
    }
    tokens = tokens.map(t => t.substr(2,t.length-3));

    for (let n=0;n<tokens.length;n++)
    {
        let t = tokens[n];
        console.log(t);
        let func = t.slice(0, t.indexOf(":"));
        let newVal = '';
        if (t.startsWith("config:"))
        {
            if (!context.guildConfig[t.substr(7)]) {return new Error("Tried to access a config that doesn't exist.");}
            newVal = context.guildConfig[t.substr(7)];
        }
        else if (variables[t] !== undefined)
        {
            newVal = variables[t];
        }
        else if (availableFuncs[func] !== undefined)
        {
            newVal = customFunc(func, t.slice(t.indexOf(":")+1), variables, n, context);
        }
        if (!newVal) {return new Error(`A dynamic variable ${t} didn't correspond to a valid function, config, or message/event property.`);}
        t = t.replace(/\[/, "\\[");
        t = t.replace(/\]/, "\\]");
        let reg = new RegExp ("\\$\\{"+customStringParse(t, variables, n, context)+"\\}", 'g');
        string = string.replace(reg, newVal);
    }
    return string;
}

function runCustomCommand (context, command)
{
    //command looks like {params:["sides"], response:"I rolled a ${sides} sided die and got a ${randomNumber:[1,${sides}]}"}
    if (context.args.length < command.params.length+1)
    {
        return new Error("Not enough arguments were given. Arguments are: "+command.params.slice(0).join(', '));
    }

    // Sort out the values for variables.
    let variables =
    {
        author : context.author.username,
        server : context.guild.name
    };

    // Strip off the last params args and use them to provide the values for the variables.
    // These will be the last two things the user provides to this custom command.
    let args = context.args.slice(-command.params.length);
    for(let i = 0; i < command.params.length; i++)
    {
        variables[command.params[i]] = args[i];
    }

    context.send(customStringParse(command.response, variables, 0, context));
}

module.exports = runCustomCommand;
