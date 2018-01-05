const fs = require('fs');
const path = require('path');
const bSettings = require("./core/config.js")();
/*
var redis = require("redis"),
    client = redis.createClient(process.env.REDIS_URL);
const Redite = require("redite");
const db = new Redite({client});
*/
const USER_VALUE_PATH = './user_values.json';
/*
module.exports.guildSettings = async function (guild)
{
    let textChannel = guild.channels.find('type', 'text');

    if(!textChannel)
    {
        console.error(`funcs: Guild ${guild.name} does not have a text channel!`);
    }
    if (await db.guilds.has(guild.id))
    { 
        return await db.guilds[guild.id].get;
    }

    const init_settings =
    {
        banned_users    :   [],
        custom_commands :   [],
        prefix          :   bSettings.prefix,
        admins          :   [guild.ownerID],
        enabled_events  :   [],
        greet           :   true,
        greet_channel   :   textChannel.id, // defaultChannel is deprecated, just default to the very first channel.
        mod_channel     :   null,  
        disabled        :   []
    };
    console.log(`Creating db entry for guild: ${guild.name}`);

    db.guilds[guild.id].set(init_settings);
    return init_settings;
};
*/
module.exports.guildfolder = function (guild)
{
    let textChannel = guild.channels.find('type', 'text');
    let guildPath = `./Guilds/${guild.id}/`;

    if(!textChannel)
    {
        console.error(`funcs: Guild ${guild.name} does not have a text channel!`);
    }

    const init_settings =
    {
        banned_users    :   [],
        custom_commands :   [],
        prefix          :   bSettings.prefix,
        admins          :   [guild.ownerID],
        enabled_events  :   [],
        greet           :   true,
        greet_channel   :   textChannel.id, // defaultChannel is deprecated, just default to the very first channel.
        mod_channel     :   null,  
        disabled        :   []
    };

    if (!fs.existsSync("./Guilds"))
    {
        console.log("Creating Guilds directory...");
        fs.mkdir("./Guilds");
    }

    if (!fs.existsSync(guildPath))
    {
        console.log(`Creating initial folder for guild: ${guild.name}`);

        fs.mkdirSync(guildPath);
        fs.writeFileSync(path.join(guildPath, "settings.json"), JSON.stringify(init_settings, null, 4));
    }

    return guildPath;
};

module.exports.guildSettings = function (guild)
{
    let folder = module.exports.guildfolder(guild);
    return JSON.parse(fs.readFileSync(`${folder}/settings.json`));
};

module.exports.setUserValue = function(user, valueName, value)
{
    db.users[user.id][valueName].set(value);
};
/*
module.exports.getUserValue = function(user, valueName)
{
    if (await db.users[user.id].has(valueName));
    { 
        return await db.users[user.id][valueName].get;
    }
};
*/
module.exports.parseString = function(string)
{
    let out = '';
    switch (string)
    {
        case "null":
            return null;
        case "undefined":
            return undefined
        case "true":
            return true;
        case "false":
            return false
        default:
            if (parseInt(string)+'' == string)
            {
                return parseInt(string);
            }
            else
            {
                return string;
            }
    }
}
module.exports.mentiontoID = function(string, members)
{
    if (string.startsWith("<"))
    {
        return string.substr(2,20);
    }
    if (args[1].includes("#"))
    {
        let iter = members.entries();
        for (let i=0;i<members.size;i++)
        {
            let M = iter.next().value;
            if (M[1].user.tag == args[1])
            {
                return M[1].id;
            }
        }
    }
    return string;

}
module.exports.IDtoString = function(string, guild)
{
    if (guild.members.get(string) != undefined)
    {
        return guild.members.get(string).user.tag;
    }
    if (guild.channels.get(string) != undefined)
    {
        return guild.channels.get(string).name;
    }
    return 'invalid_id';
}

module.exports.findMember = function(msg, args)
{
    let member;
    if (args[1].startsWith("<@"))
    {
        member = msg.mentions.members.first();
    }
    else if (args[1].includes("#"))
    {
        let iter = msg.guild.members.entries();
        for (let i=0;i<msg.guild.members.size;i++)
        {
            let M = iter.next().value;
            if (M[1].user.tag == args[1])
            {
                member = M[1];
                break;
            }
        }
    }
    else if (args[1].length == 18)
    {
        member = msg.guild.members.get(args[1]);
    }
    return member;
};

module.exports.randInt = function(min,max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Pick a random item out of the provided array.
 * @param array - The array to pick the item from.
 * @returns {*} - An item from the array, or undefined.
 */
module.exports.sample = function (array)
{
    if (arguments.length > 1)
    {
        array = Array.prototype.slice.call(arguments);
    }
    console.log(array);
    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Map a value, x, in the range a1, a2 to an equivalent value in the range b1, b2
 * @param x - The value to map.
 * @param a1 - Lower bound of the current range.
 * @param a2 - Upper bound of the current range.
 * @param b1 - Lower bound of the new range.
 * @param b2 - Upper bound of the new range.
 * @returns {*} - Value mapped too the new range.
 */
module.exports.mapLinear = function (x, a1, a2, b1, b2)
{
    return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
};

module.exports.formatTime = function (inSeconds)
{
    let minutes = Math.floor(inSeconds / 60);
    let hours = Math.floor(minutes / 60);
    let seconds = inSeconds % 60;

    minutes %= 60;

    return hours + ":" + ('0' + minutes.toFixed(0)).slice(-2) + ":" + ('0' + seconds.toFixed(0)).slice(-2);
};

var availableFuncs =
{
    randomNumber : module.exports.randInt,
    randomResponse : module.exports.sample
};

function customFunc (func, params, variables, n)
{
    n += 1;
    let arr = params.substr(1, params.length-2).split(',');

    for (let i=0; i<arr.length; i++)
    {
        arr[i] = module.exports.customStringParse(arr[i], variables, n);
    }

    arr = arr.map(p => p = module.exports.parseString(p));

    if (!Array.isArray(arr))
    {
        return new Error("I wasn't given a list [] for the paramaters of "+func+".");
    }
    if (arr.length < availableFuncs[func].length)
    {
        return new Error(`${func} takes ${availableFuncs[func].length} parameters, but I was given ${arr.length}.`);
    }
    return availableFuncs[func].apply(null, arr);
}

module.exports.customStringParse = function(string, variables, n)
{
    if (n != undefined && n > 2)
    {
        return new Error("Do not nest more than two functions/variables inside of each other.");
    }
    if (typeof string != 'string')
    {
        return string;
    }
    let tokens = string.match(/\$\{([^(\$\{)\}]*|\$\{([^(\$\{)\}]*|\$\{[^(\$\{)\}]*\})*\})*\}/g);
    if (!tokens)
    {
        return string;
    }
    tokens = tokens.map(t => t = t.substr(2,t.length-3));
    let arr;
    for (let n=0;n<tokens.length;n++)
    {
        let t = tokens[n];
        console.log(t);
        let func = t.slice(0, t.indexOf(":"));
        let newVal = '';
        if (t.startsWith("config:"))
        {
            if (!config[t.substr(7)]) {return new Error("Tried to access a config that doesn't exist.");}
            newVal = config[t.substr(7)];
        }
        else if (variables[t] != undefined)
        {
            newVal = variables[t];
        }
        else if (availableFuncs[func] != undefined)
        {
            newVal = customFunc(func, t.slice(t.indexOf(":")+1), variables, n);
        }
        if (!newVal) {return new Error(`A dynamic variable ${t} didn't correspond to a valid function, config, or message/event property.`);}
        t = t.replace(/\[/, "\\[");
        t = t.replace(/\]/, "\\]");
        let reg = new RegExp ("\\$\\{"+module.exports.customStringParse(t, variables, n)+"\\}", 'g');
        string = string.replace(reg, newVal);
    }
    return string;
};

module.exports.runCustomCommand = function (command, msg, args)
{
    //command looks like {params:["sides"], response:"I rolled a ${sides} sided die and got a ${randomNumber:[1,${sides}]}"}
    if (args.length < command.params.length+1)
    {
        return new Error("Not enough arguments were given. Arguments are: "+command.params.slice(0).join(', '));
    }
    let variables =
    {
        author : msg.author.username,
        server : msg.guild.name
    }
    for (let i=0; i<command.params.length; i++)
    {
        variables[command.params[i]] = args[i+1];
    }
    msg.channel.send(module.exports.customStringParse(command.response, variables, 0));
}
