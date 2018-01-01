const ytdl = require("ytdl-core");
const Discord = require('discord.js');

// TODO: Update description.
exports.description = "Play a music file. Currently just from a local directory.";
exports.info = module.exports.description;
exports.usage = "*music (file)";
exports.category = "music";

let contexts = {};

// TODO: Finish this off so that we can display nicer info for videos being played, rather than just the URL.
class MusicQueueItem
{
    constructor(url)
    {
        this.info = null;
        ytdl.getInfo(url, (err, info) => {
            let title = info.title;
            let channelURL = info.author.channel_url;
            let duration = "";
        });
    }
}

class MusicContext
{
    constructor (guild)
    {
        this.queue = []; // Queue of items to play.
        this.currentURL = ""; // URL of what we're currently playing.

        // Text channel that the initial play command was issued in. This probably could use changing.
        this.textChannel = null;
        // Current voice channel we're playing in. Currently, I'm under the assumption that we'll never be in a channel and not playing.
        this.channel = null;
        this.connection = null; // Channel's voice connection.
        this.stream = null; // Current video's stream.

        this.guild = guild; // The guild that this music context is currently running in.
    }

    get playing () { return this.channel != null; }

    /**
     * Runs a music command on this context
     * @param bot
     * @param msg
     * @param args
     */
    run (bot, msg, args)
    {
        switch(args[1])
        {
            case "play":
                this.play(msg, args[2]);
                break;

            case "skip":
                this.skip(msg);
                break;

            case "list":
                this.list(msg);
                break;

            default:
                msg.channel.send("Invalid music command.");
                break;
        }
    }

    validate (msg, url)
    {
        if (!url)
        {
            msg.channel.send("I can't play nothing.");
            return false;
        }
        else if (!ytdl.validateURL(url))
        {
            msg.channel.send("You have not provided a valid youtube URL.");
            return false;
        }
        else if (!msg.member.voiceChannel)
        {
            msg.channel.send("You're not in a voice channel!");
            return false;
        }

        return true;
    }

    play (msg, url)
    {
        // Check if the play command is valid for this url.
        if(!this.validate(msg, url))
        {
            // Invalid play command
            return;
        }

        // Play command is all good, so what shall we do?
        if(this.playing)
        {
            // Currently playing something, so try to queue this up
            this.queue.push(url);
        }
        else
        {
            // Join the user's channel and start playing now.
            this.channel = msg.member.voiceChannel;
            this.textChannel = msg.channel;

            this.channel.join()
                .then(c => {
                    this.connection = c;
                    this.startPlay(url);
                })
                .catch(e => {
                    this.stopPlay();
                    console.log("An error occurred while trying to play audio: " + e);
                });
        }
    }

    skip (msg)
    {
        if(!this.channel)
        {
            msg.channel.send("Can't skip when I'm not playing anything.");
            return;
        }

        msg.channel.send("Skipping: " + this.currentURL);
        this.connection.player.destroyCurrentStream();
    }

    list (msg)
    {
        if(!this.channel)
        {
            msg.channel.send("Nothing is playing.");
            return;
        }

        let embed = new Discord.RichEmbed().setTitle("Music Queue");
        let index = 1;
        let desc = "Now playing: " + this.currentURL + "\nQueue:\n";

        desc = this.queue.reduce((text, url) => {
            let entry = index + ": " + url + "\n";
            index++;
            return text + entry;
        }, desc);

        embed.setDescription(desc);

        msg.channel.send({embed});
    }

    startPlay (url)
    {
        this.currentURL = url;

        if(!this.connection)
        {
            // Something bad fucked up
            console.log("music: Somehow attempting to play without being in a channel.");
            return;
        }

        this.textChannel.send("Now playing: " + url);

        this.stream = ytdl(url, {filter: 'audioonly'});
        this.connection.playStream(this.stream, {seek: 0, volume: 1})
            .on("end", this.nextQueue.bind(this))
            .on("close", this.nextQueue.bind(this));
    }

    stopPlay ()
    {
        if(this.stream)
        {
            this.stream.destroy();
        }

        if(this.connection.speaking)
        {
            this.connection.disconnect();
        }

        if(this.channel)
        {
            this.channel.leave();
        }

        this.connection = null;
        this.channel = null;
        this.stream = null;
    }

    nextQueue ()
    {
        //  Try to pop an item from the queue
        let next = this.queue.shift();

        if(next)
        {
            // Move on to playing the next thing
            this.startPlay(next);
        }
        else
        {
            this.stopPlay();
            this.textChannel.send("Finished playing entire queue.");
        }
    }
}

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