const descriptors = require("./descriptors.js");
const global = require("./global.js");
const FileConfig = require("./file.js");
const RedisConfig = require("./redis.js");

let globalConfig = global.load();

// Choose the descriptors we'll use
let Config, UserDescriptor, GuildDescriptor;

if (globalConfig.redis)
{
    const db = RedisConfig.connect(globalConfig.redis);
    // We have a redis URL to use
    console.log("config: Using redis for config storage.");
    Config = descriptor => new RedisConfig(db, descriptor);
    UserDescriptor = descriptors.RedisUser;
    GuildDescriptor = descriptors.RedisGuild;
}
else
{
    console.log("config: Using files for config storage.");
    Config = descriptor => new FileConfig(descriptor);
    UserDescriptor = descriptors.FileUser;
    GuildDescriptor = descriptors.FileGuild;
}

let cache = {};

module.exports.globalConfig = function ()
{
    return globalConfig;
};

module.exports.userConfig = function (user)
{
    let id = `user_${user.id}`;

    let config = cache[id];
    if (config === undefined)
    {
        config = Config(new UserDescriptor(user, globalConfig));
        cache[id] = config;
    }

    return config;
};

module.exports.guildConfig = function (guild)
{
    let id = `guild_${guild.id}`;

    let config = cache[id];
    if (config === undefined)
    {
        config = Config(new GuildDescriptor(guild, globalConfig));
        cache[id] = config;
    }

    return config;
};