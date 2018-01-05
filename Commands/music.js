const MusicContext = require("../music/context.js");

exports.description = "Plays music from Youtube. Has three subcommands: 'play', 'skip', and 'list'";
exports.info = "Plays music from Youtube.\n'play' - Specify a Youtube video URL to play. If a video is already playing, it will be added to the queue.\n'skip' - Vote to skip the current video.\n'list' - List all videos that are currently in the queue";
exports.usage = "*music play (url), *music skip, *music list";
exports.category = "music";

let contexts = {};

exports.call = function (messageContext)
{
    if(!messageContext.guild)
    {
        messageContext.send("Can't access music commands outside of a guild.");
        return;
    }

    let musicContext = contexts[messageContext.id];

    if(!musicContext)
    {
        // This guild doesn't have a context, so get one for it.
        musicContext = new MusicContext(messageContext.guild);
        contexts[messageContext.id] = musicContext;
    }

    musicContext.run(messageContext);
};
