const MusicContext = require("../music/context.js");

// TODO: Update description.
exports.description = "Play a music file. Currently just from a local directory.";
exports.info = module.exports.description;
exports.usage = "*music (file)";
exports.category = "music";

let contexts = {};

/**TODO:
 * play - Music queue
 * Stream music from youtube / other external sources
 * skip - Skip vote to skip the current track.
 * list - List to list all queued tracks, and the current track.
 */

exports.call = function (bot, msg, args)
{
    if(!msg.guild)
    {
        msg.channel.send("Can't access music commands outside of a guild.");
        return;
    }

    let context = contexts[msg.guild.id];

    if(!context)
    {
        // This guild doesn't have a context, so get one for it.
        context = new MusicContext(msg.guild);
        contexts[msg.guild.id] = context;
    }

    context.run(bot, msg, args);
};