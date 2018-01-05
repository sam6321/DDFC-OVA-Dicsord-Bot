const Discord = require("discord.js");
const encryption = require('../encryption/common.js');

exports.description = "Encrypt a message with your private key. Provide a key using the 'key' command. Available ciphers: prng, xor.";
exports.info = module.exports.description;
exports.usage = "*encrypt (cipher) (your text here)";
exports.category = "misc";

exports.call = function (bot, msg, args, settings)
{
    let author = msg.author;
    let channel = msg.channel;

    // Can't delete DM messages.
    if(msg.guild)
    {
        msg.delete();
    }

    let text = encryption('encrypt', author, channel, args);

    if(text)
    {
        let embed = new Discord.RichEmbed();
        embed.setTitle("Your encrypted message is:");
        embed.setDescription(text);

        channel.send({embed});
    }
};
