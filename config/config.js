const descriptors = require("./descriptors.js");
const global = require("./global.js");
const FileConfig = require("./file.js");
const RedisConfig = require("./redis.js");

let globalConfig = global.load();

// Choose the descriptors we'll use
let Config, UserDescriptor, GuildDescriptor;

if (globalConfig.redis)
{
    // We have a redis URL to use
    console.log("config: Using redis for config storage.");
    Config = RedisConfig;
    UserDescriptor = descriptors.RedisUser;
    GuildDescriptor = descriptors.RedisGuild;
}
else
{
    console.log("config: Using files for config storage.");
    Config = FileConfig;
    UserDescriptor = descriptors.FileUser;
    GuildDescriptor = descriptors.FileGuild;
}

module.exports.globalConfig = function ()
{
    return globalConfig;
};

module.exports.userConfig = function (user)
{
    return new Config(new UserDescriptor(user, globalConfig));
};

module.exports.guildConfig = function (guild)
{
    return new Config(new GuildDescriptor(guild, globalConfig));
};