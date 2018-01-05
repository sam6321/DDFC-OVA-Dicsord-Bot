const methods = {
    prng: require("../encryption/prng-pa-cipher.js"),
    xor: require("../encryption/xor-cipher.js")
};

module.exports = function (action, context)
{
    let cipher = methods[context.args[1]];
    let text = context.args.slice(2).join('');
    let key = context.authorConfig.key;

    if (!key)
    {
        context.send("You have not set your key. Please use the 'key' command to set it.");
    }
    else if (context.args.length < 2)
    {
        context.send("You must provide me with a cipher name.");
    }
    else if (!cipher)
    {
        context.send(`Invalid cipher ${context.args[1]}`);
    }
    else if (context.args.length < 3)
    {
        context.send(`You must provide me with text to ${action}.`);
    }
    else
    {
        let functionMap = {encrypt: cipher.encrypt, decrypt: cipher.decrypt};
        return functionMap[action](text, key);
    }

    return null;
};
