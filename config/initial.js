/**
 * Builds a default global config definition.
 * @returns {{token: string, prefix: string}}
 */
module.exports.global = function()
{
    return {
        "token": "token_here",
        "prefix": "*"
    };
};

/**
 * Builds a default guild config definition.
 * @param globalConfig - The global config
 * @param guild - The guild to build the config for.
 * @returns {{banned_users: Array, custom_commands: Array, prefix: string|*|string|string, admins: *[], enabled_events: Array, greet: boolean, greet_channel, mod_channel: null, disabled: Array, aliases: {}}}
 */
module.exports.guild = function (globalConfig, guild)
{
    let textChannel = this.guild.channels.find('type', 'text');

    return {
        banned_users    :   [],
        custom_commands :   [],
        prefix          :   globalConfig.prefix,
        admins          :   [this.guild.ownerID],
        enabled_events  :   [],
        greet           :   true,
        greet_channel   :   textChannel.id, // defaultChannel is deprecated, just default to the very first channel.
        mod_channel     :   null,
        disabled        :   [],
        aliases         :   {}
    };
};

/**
 * Builds a default user config definition.
 * @param globalConfig - The global config
 * @param user - The user to build the config for.
 * @returns {{key: string}} - New user config object.
 */
module.exports.user = function (globalConfig, user)
{
    return {
        key : ""
    };
};