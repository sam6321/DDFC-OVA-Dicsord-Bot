var funcs = require("../funcs.js");

const KEY_MAX_LENGTH = 1024;

exports.description = "Provide an encryption key to encrypt messages with.";
exports.info = module.exports.description;
exports.usage = "*key (your key here)";
exports.category = "misc";

exports.call = async function (context)
{
    if(context.type !== "dm")
    {
        context.send("I suggest you only perform key commands over DM.");
    }

    let key = context.args.slice(1).join(' ');

    if(!key || !key.length)
    {
        // We're just printing out the key, I guess.
        await context.send(`Your key is: ${context.authorConfig.key}`);
    }
    else if ((key.length % 3) !== 0)
    {
        await context.send("Key length must be a multiple of 3.");
    }
    else if (key.length > KEY_MAX_LENGTH)
    {
        await context.send("Key too big.");
    }
    else
    {
        context.authorConfig.key = key;
        await context.send(`Your key has been set to ${context.authorConfig.key}.`);
    }
};
