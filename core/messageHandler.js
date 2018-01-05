const Command = require('./command.js');
const createMessageContext = require('./messageContext.js');

class MessageHandler
{
    constructor (client)
    {
        this.client = client;
        this.commands = new Command.Dispatcher();
        this.alias = {};
    }

    /**
     * Handle the specified message.
     * @param msg
     */
    runMessage (msg)
    {
        let context = createMessageContext(this.client, msg);

        if (!context)
        {
            return; // Can't create a valid message context.
        }

        // Look at the command in the context.
        let alias = this.alias[context.command];

        if (alias)
        {
            // This command is an alias, so we need to replace its args with the alias' args
            context.setArgs(alias);
        }

        // Check if the context is good.
        if (context.validate())
        {
            // Message context is valid, so run its command.
            this.commands.dispatch(context.command, context);
        }
    }
}

module.exports = MessageHandler;