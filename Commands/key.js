var funcs = require("../funcs.js");

const KEY_MAX_LENGTH = 1024;

exports.description = "Provide an encryption key to encrypt messages with.";
exports.info = module.exports.description;
exports.usage = "*key (your key here)";
exports.category = "misc";

exports.call = function (context)
{
    if(context.type !== "dm")
    {
        context.send("I suggest you only perform key commands over DM.");
    }

    let key = args.slice(1).join(' ');

    if(!key || !key.length)
    {
        // We're just printing out the key, I guess.
        key = funcs.getUserValue(context.author, 'encrypt-key');
        context.send(`Your key is: ${key}`);
    }
    else if ((key.length % 3) !== 0)
    {
        context.send("Key length must be a multiple of 3.");
    }
    else if (key.length > KEY_MAX_LENGTH)
    {
        context.send("Key too big.");
    }
    else
    {
        funcs.setUserValue(context.author, 'encrypt-key', key);
        context.send(`Your key has been set to ${key}.`);
    }
};
