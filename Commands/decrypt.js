const encryption = require('../encryption/common.js');

exports.description = "Decrypt a message with your private key. Provide a key using the 'key' command. Available ciphers: prng, xor.";
exports.info = module.exports.description;
exports.usage = "(prefix)decrypt (cipher) (your text here)";
exports.category = "misc";

exports.call = function (bot, msg, args)
{
    let text = encryption('decrypt', msg.author, msg.channel, args);

    if(text)
    {
        msg.channel.send(`Your decrypted message is: ${text}`);
    }
};
