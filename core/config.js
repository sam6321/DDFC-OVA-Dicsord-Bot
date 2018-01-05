// The state of the guild config is loaded at the start of a message handler.
// The handler can then make modifications to the settings, and if any changes are made, they are auto-comitted at the end.
const fse = require("fs-extra");
const path = require("path");
const globalSettings = require("./globalConfig.js")();

const BASE_GUILD_PATH = "./Guilds/";
const BASE_USER_PATH = "./Users/";

const GUILD_CONFIG_FILE_NAME = "guild_config.json";
const USER_CONFIG_FILE_NAME = "user_config.json";

function getInitialGuildSettings (guild)
{

}

class ConfigFile
{
    constructor (path)
    {
        this.config = null;
        this.path = path;
    }

    async initial ()
    {
        let initialSettings = this.getInitialSettings();

        await fse.ensureFile(this.path);
        await fse.writeFile(this.path, JSON.stringify(initialSettings, null, 4));

        return initialSettings;
    }

    getInitialSettings ()
    {
        return {};
    }

    async load ()
    {
        if (!await fse.pathExists(this.path))
        {
            this.config = await this.initial();
        }
        else
        {
            let config = await fse.readFile(this.path, 'utf8');
            this.config = JSON.parse(config);
        }

        return this.config;
    }

    async save ()
    {
        await fse.writeFile(this.path, JSON.stringify(this.config, null, 4));
    }
}

/**
 * Responsible for handling the guild's config file.
 * Loads the config file up, then any changes to this._config will be saved when save is called.
 */
class GuildConfigFile extends ConfigFile
{
    constructor (guild)
    {
        let guildPath = path.join(BASE_GUILD_PATH, guild.id, GUILD_CONFIG_FILE_NAME);

        super(guildPath);

        this.guild = guild;
    }

    getInitialSettings ()
    {
        let textChannel = this.guild.channels.find('type', 'text');

        return {
            banned_users    :   [],
            custom_commands :   [],
            prefix          :   globalSettings.prefix,
            admins          :   [this.guild.ownerID],
            enabled_events  :   [],
            greet           :   true,
            greet_channel   :   textChannel.id, // defaultChannel is deprecated, just default to the very first channel.
            mod_channel     :   null,
            disabled        :   [],
            aliases         :   {}
        };
    }

    async initial ()
    {
        console.log(`guildConfig: Creating guild config entry for guild: ${this.guild.name}`);
        return await super.initial();
    }
}

class UserConfigFile extends ConfigFile
{
    constructor (user)
    {
        let userPath = path.join(BASE_USER_PATH, user.id, USER_CONFIG_FILE_NAME);

        super(userPath);

        this.user = user;
    }

    getInitialSettings ()
    {
        return {
            key    :   "",
        };
    }

    async initial ()
    {
        console.log(`userConfig: Creating user config entry for user: ${this.user.username}`);
        return await super.initial();
    }
}

module.exports.GuildConfigFile = GuildConfigFile;
module.exports.UserConfigFile = UserConfigFile;