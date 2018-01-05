const Command = require('./command.js');
const Config = require("./config.js");
const createMessageContext = require('./messageContext.js');

class MessageHandler
{
    constructor (client)
    {
        this.client = client;
        this.commands = new Command.Dispatcher();
    }

    /**
     * Handle the specified message.
     * @param msg
     */
    async runMessage (msg)
    {
        let context = createMessageContext(this.client, msg);
        let guildConfigLoader = null;

        if (!context)
        {
            return; // Can't create a valid message context.
        }

        // Load up the author's config.
        let authorConfigLoader = new Config.UserConfigFile(msg.author);
        context.setAuthorConfig(await authorConfigLoader.load());

        if (context.guild)
        {
            // Load up the config for this guild.
            guildConfigLoader = new Config.GuildConfigFile(context.guild);
            context.setGuildConfig(await guildConfigLoader.load());

            // Check for any command aliases for this command.
            let alias = context.guildConfig.aliases[context.command];

            if (alias)
            {
                // Found an alias, use it as the context's arguments instead.
                // Append any other additional arguments on to the end of the new args.
                context.setArgs(alias + ' ' + context.args.slice(1));
            }
        }

        // Check if the context is good.
        if (!context.validate())
        {
            // Issue with the context, don't run this command.
            return;
        }

        // Dispatch the command, with the appropriate message context.
        this.commands.dispatch(context.command, context);

        if (context.guild)
        {
            // Save changes to the guild config that were performed during the command.
            guildConfigLoader.save();
        }

        // Save changes to the author's config.
        authorConfigLoader.save();
    }
}

module.exports = MessageHandler;