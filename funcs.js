const fs = require('fs');
const path = require('path');
const config = require("./config/config.js");
const globalConfig = config.globalConfig();

const permFlags =
{
    banUsers : "BAN_MEMBERS",
    admin : "ADMINISTRATOR",
    kickUsers : "KICK_MEMBERS",
    mentionEveryone : "MENTION_EVERYONE",
    manageChannels : "MANAGE_CHANNELS",
    manageServer : "MANAGE_GUILD",
    manageNicks : "MANAGE_NICKNAMES",
    manageRoles : "MANAGE_ROLES"
};

module.exports.parseString = function(string)
{
    switch (string)
    {
        case "null":
            return null;
        case "undefined":
            return undefined;
        case "true":
            return true;
        case "false":
            return false;
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
};

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

module.exports.randInt = function(min, max)
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

module.exports.setConfig = function (name, value, context)
{
    context.guildConfig[name] = module.exports.parseString(value);
    return "";
};

module.exports.requiredPerms = function ()
{
    let context = arguments[arguments.length-1];

    for (let i=0; i<arguments.length-1; i++)
    {
        if (arguments[i] == "botAdmin")
        {
            if (!context.guildConfig.admins.includes(context.author.id))
            {
                throw new Error("User is not an administrator of the bot. Bot administrators are defined in the server configuration.");
            }
            else
            {
                continue;
            }
        }
        if (!context.member.hasPermission(permFlags[arguments[i]]))
        {
            throw new Error(`User is missing permission ${arguments[i]}`);
        }
    }
    return "";
}

module.exports.enumerate = function* (array)
{
    let count = 0;
    for(const element of array)
    {
        yield [count, element];
        count++;
    }
};