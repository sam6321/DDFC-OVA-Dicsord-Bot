// The state of the guild config is loaded at the start of a message handler.
// The handler can then make modifications to the settings, and if any changes are made, they are auto-comitted at the end.

const initial = require("./initial.js");
const path = require("path");

const BASE_GUILD_PATH = "./Guilds/";
const BASE_USER_PATH = "./Users/";

const GUILD_CONFIG_FILE_NAME = "guild_config.json";
const USER_CONFIG_FILE_NAME = "user_config.json";


/**
 * Describes a redis user config file.
 */
class RedisUserDescriptor
{
    constructor (user, globalConfig)
    {
        this.user = user;
        this.globalConfig = globalConfig;
    }

    async setData (db, data)
    {
        return await db[`user_${this.user.id}`].set(data);
    }

    async getData (db)
    {
        return await db[`user_${this.user.id}`].get;
    }

    initial ()
    {
        return initial.user(this.globalConfig, this.user);
    }
}

/**
 * Describes a redis guild config.
 */
class RedisGuildDescriptor
{
    constructor (guild, globalConfig)
    {
        this.guild = guild;
        this.globalConfig = globalConfig;
    }

    async setData (db, data)
    {
        return await db[`guild_${this.guild.id}`].set(data);
    }

    async getData (db)
    {
        return await db[`guild_${this.guild.id}`].get;
    }

    initial ()
    {
        return initial.guild(this.globalConfig, this.guild);
    }
}

/**
 * Describes a file user config.
 */
class FileUserDescriptor
{
    constructor (user, globalConfig)
    {
        this.user = user;
        this.path = path.join(BASE_USER_PATH, this.user.id, USER_CONFIG_FILE_NAME);
        this.globalConfig = globalConfig;
    }

    initial ()
    {
        return initial.user(this.globalConfig, this.user);
    }
}

/**
 * Describes a file guild config.
 */
class FileGuildDescriptor
{
    constructor (guild, globalConfig)
    {
        this.guild = guild;
        this.path = path.join(BASE_GUILD_PATH, this.guild.id, GUILD_CONFIG_FILE_NAME);
        this.globalConfig = globalConfig;
    }

    initial ()
    {
        return initial.guild(this.globalConfig, this.guild);
    }
}

exports.RedisUser = RedisUserDescriptor;
exports.RedisGuild = RedisGuildDescriptor;
exports.FileUser = FileUserDescriptor;
exports.FileGuild = FileGuildDescriptor;