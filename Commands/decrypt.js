const Discord = require("discord.js");
const encryption = require('../encryption/common.js');

exports.description = "Decrypt a message with your private key. Provide a key using the 'key' command. Available ciphers: prng, xor.";
exports.info = module.exports.description;
exports.usage = "*decrypt (cipher) (your text here)";
exports.category = "misc";

exports.call = async function (context)
{
    let text = encryption('decrypt');

    if(text)
    {
        let embed = new Discord.RichEmbed();
        embed.setTitle("Your decrypted message is:");
        embed.setDescription(text);

        await context.send({embed});
    }
};
