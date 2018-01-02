const MusicContext = require("../music/context.js");

exports.description = "Plays music from Youtube. Has three subcommands: 'play', 'skip', and 'list'";
exports.info = "Plays music from Youtube.\n'play' - Specify a Youtube video URL to play. If a video is already playing, it will be added to the queue.\n'skip' - Vote to skip the current video.\n'list' - List all videos that are currently in the queue";
exports.usage = "(prefix)music play (url), (prefix)music skip, (prefix)music list";
exports.category = "music";

let contexts = {};

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