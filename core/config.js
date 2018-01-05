// The state of the guild config is loaded at the start of a message handler.
// The handler can then make modifications to the settings, and if any changes are made, they are auto-comitted at the end.
const fse = require("fs-extra");
const path = require("path");
const globalSettings = require("./globalConfig.js")();

const BASE_GUILD_PATH = "./Guilds/";
const GUILD_CONFIG_FILE_NAME = "config.json";

function getInitialSettings (guild)
{
    let textChannel = guild.channels.find('type', 'text');

    return {
        banned_users    :   [],
        custom_commands :   [],
        prefix          :   globalSettings.prefix,
        admins          :   [guild.ownerID],
        enabled_events  :   [],
        greet           :   true,
        greet_channel   :   textChannel.id, // defaultChannel is deprecated, just default to the very first channel.
        mod_channel     :   null,
        disabled        :   [],
        aliases         :   {}
    };
}

/**
 * Responsible for handling the guild's config file.
 * Loads the config file up, then any changes to this._config will be saved when save is called.
 */
class GuildConfigFile
{
    constructor (guild)
    {
        this.guild = guild;
        this._config = null;
        this.path = path.join(BASE_GUILD_PATH, this.guild.id);
        this.configPath = path.join(this.path, GUILD_CONFIG_FILE_NAME);
    }

    async config ()
    {
        return await this.load();
    }

    async initial ()
    {
        let initialSettings = getInitialSettings(this.guild);

        console.log(`guildConfig: Creating guild config entry for guild: ${this.guild.name}`);

        await fse.ensureDir(this.path);
        await fse.writeFile(this.configPath, JSON.stringify(initialSettings, null, 4));

        return initialSettings;
    }

    async load ()
    {
        if (!await fse.pathExists(this.configPath))
        {
            this._config = await this.initial();
        }
        else
        {
            let config = await fse.readFile(this.configPath);
            this._config = JSON.parse(config);
        }

        return this._config;
    }

    async save ()
    {
        await fse.writeFile(this.configPath, JSON.stringify(this._config, null, 4));
    }
}

module.exports.File = GuildConfigFile;