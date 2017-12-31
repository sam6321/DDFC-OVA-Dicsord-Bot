const fs = require('fs');
const bSettings = require("./settings.json");

module.exports.guildfolder = function (guild)
{
    let textChannel = guild.channels.find('type', 'text');

    if(!textChannel)
    {
        console.error(`funcs: Guild ${guild.name} does not have a text channel!`);
    }

    var init_settings = 
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

    if (fs.existsSync("./Guilds/"+guild.id))
    {
        return "./Guilds/"+guild.id;
    }
    else
    {
        fs.mkdirSync("./Guilds/"+guild.id);
        fs.writeFileSync("./Guilds/"+guild.id+"/settings.json",JSON.stringify(init_settings,null,4));
    }
};

module.exports.memberFolder = function(user)
{
    let folder = `./Users/${user.id}`;

    if(!fs.existsSync(folder))
    {
        fs.mkdirSync(folder);
    }

    return folder;
};

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
}

module.exports.randInt = function(min,max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
