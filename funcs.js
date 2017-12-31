const fs = require('fs');
const path = require('path');
const bSettings = require("./settings.json");

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
            console.log(M);
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
