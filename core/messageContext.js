let bSettings = require("./globalConfig.js")();

class MessageContext
{
    constructor (client, msg)
    {
        this.client = client;
        this.msg = msg;
        this.prefix = bSettings.prefix;
        this.authorConfig = null;

        this.setArgs(msg.content);
    }

    get guild () { return this.msg.guild; }
    get author () { return this.msg.author; }
    get member () { return this.msg.member; }
    get channel () { return this.msg.channel; }
    get type () { return this.msg.type; }
    get command () { return this.args[0]; }

    validate ()
    {
        return true; // Assume the message is valid by default.
    }

    setArgs (args)
    {
        this.args = args.slice(this.prefix.length).split(' ');
    }

    setPrefix (prefix)
    {
        this.prefix = prefix;
    }

    setAuthorConfig (config)
    {
        this.authorConfig = config;
    }

    send (...response)
    {
        return this.channel.send(...response);
    }
}

class GuildMessageContext extends MessageContext
{
    constructor (client, msg)
    {
        super(client, msg);
        this.guildConfig = null;
    }

    setGuildConfig (config)
    {
        this.guildConfig = config;
    }

    validate ()
    {
        let msg = this.msg;

        return !this.guildConfig.disabled.includes(this.command) &&
            (msg.content.startsWith(this.prefix) ||
            msg.content.startsWith(`${bSettings.prefix}help`));
    }
}

class DMMessageContext extends MessageContext
{
    constructor (client, msg)
    {
        super(client, msg);
        this.setPrefix(''); // No prefix in DM
    }
}

class GroupMessageContext extends MessageContext
{
    constructor (client, msg)
    {
        super(client, msg);
    }

    validate ()
    {
        // Valid if the message starts with the default prefix.
        return this.msg.content.startsWith(this.prefix);
    }
}

const messageContextMap = {
    "text": GuildMessageContext,
    "dm": DMMessageContext,
    "group": GroupMessageContext
};

/**
 * Creates a message context for the given message
 * @param client
 * @param msg
 * @returns {GroupMessageContext|DMMessageContext|GuildMessageContext}
 */
module.exports = function (client, msg)
{
    let constructor = messageContextMap[msg.channel.type];

    if (!constructor)
    {
        return null; // Can't construct a context for this message.
    }

    return new constructor(client, msg);
};