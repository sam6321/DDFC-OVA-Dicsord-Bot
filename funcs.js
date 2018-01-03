const fs = require('fs');
const path = require('path');
const bSettings = require("./core/config.js")();

const USER_VALUE_PATH = './user_values.json';

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
    if(!fs.existsSync(USER_VALUE_PATH))
    {
        fs.writeFileSync(USER_VALUE_PATH, '{}');
    }

    let userData = JSON.parse(fs.readFileSync(USER_VALUE_PATH));
    let values = userData[user.id] || {};

    values[valueName] = value;

    userData[user.id] = values;

    fs.writeFileSync(USER_VALUE_PATH, JSON.stringify(userData, null, 4));
};

module.exports.getUserValue = function(user, valueName)
{
    if(!fs.existsSync(USER_VALUE_PATH))
    {
        fs.writeFileSync(USER_VALUE_PATH, '{}');
    }

    let userData = JSON.parse(fs.readFileSync(USER_VALUE_PATH));
    let values = userData[user.id] || {};

    return values[valueName];
};

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
