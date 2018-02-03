const Command = require('./command.js');
const config = require('../config/config.js');
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
        let save = [];

        if (!context)
        {
            return; // Can't create a valid message context.
        }

        // Only load the guild config if this is a guild message.
        let guildConfigLoader;
        // Load up the user's config
        let userConfigLoader = config.userConfig(msg.author);
        save.push(userConfigLoader);

        context.setAuthorConfig(await userConfigLoader.load());

        if (context.guild)
        {
            // Load up the config for this guild.
            guildConfigLoader = config.guildConfig(context.guild);
            save.push(guildConfigLoader);

            context.setGuildConfig(await guildConfigLoader.load());

            // Check for any command aliases for this command.
            let alias = context.guildConfig.aliases[context.command];

            if (alias)
            {
                // Found an alias, use it as the context's arguments instead.
                // Append any other additional arguments on to the end of the new args.
                context.setArgs(alias + ' ' + context.args.slice(1).join(' '));
            }
        }

        // Check if the context is good.
        if (!context.validate())
        {
            // Issue with the context, don't run this command.
            return;
        }

        // Dispatch the command, with the appropriate message context.
        await this.commands.dispatch(context.command, context);

        // Save changes to configs and return when we're done.
        await Promise.all(save.map(item => item.save()));
    }
}

module.exports = MessageHandler;