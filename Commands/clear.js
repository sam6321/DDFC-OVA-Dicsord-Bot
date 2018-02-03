exports.description = "Clears an amount of messages.";
exports.info = "Clears an amount of messages with the paramater of 'any', 'bots', or 'users'. Any will remove all types of messages, while bots and users deletes messages sent by certain types of accounts.";
exports.usage = "*clear (number of messages) (any/bots/users)";
exports.category = "moderation";

exports.call = async function (context)
{
    let args = context.args;
    let amount = parseInt(args[1]);
    let type = 'any';

    if(!args[2])
    {
        type = 'users'
    }
    else if (args[2].toLowerCase() === "bots")
    {
        type = 'bots';
    }
    else if (args[2].toLowerCase() === "users")
    {
        type = 'users';
    }

    try
    {
        let messages = await context.channel.fetchMessages({limit: amount});

        if (type === 'bots')
        {
            messages = messages.filter(msg => msg.author.bot);
        }
        else if (type === 'users')
        {
            messages = messages.filter(msg => !msg.author.bot);
        }

        messages.deleteAll();
        await context.send("Deleted " + messages.size + " messages!");
    }
    catch (err)
    {
        await context.send("Failed to retrieve message from channel. Reason: " + err);
    }
};
