var funcs = require("../funcs.js");

const methods = {
    prng: require("../encryption/prng-pa-cipher.js"),
    xor: require("../encryption/xor-cipher.js")
};

module.exports = function (action, user, channel, args)
{
    let cipher = methods[args[1]];
    let text = args.slice(2).join('');
    let key = funcs.getUserValue(user, 'encrypt-key');

    if (!key)
    {
        channel.send("You have not set your key. Please use the 'key' command to set it.");
    }
    else if (args.length < 2)
    {
        channel.send("You must provide me with a cipher name.");
    }
    else if (!cipher)
    {
        channel.send(`Invalid cipher ${args[1]}`);
    }
    else if (args.length < 3)
    {
        channel.send(`You must provide me with text to ${action}.`);
    }
    else
    {
        let functionMap = {encrypt: cipher.encrypt, decrypt: cipher.decrypt};
        return functionMap[action](text, key);
    }

    return null;
};
