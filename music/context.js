const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const MusicQueue = require("./queue.js");
const MusicSkipHandler = require("./skip.js");

/**
 * Validate a message and URL provided by a user. If either is not valid, this message can't be processed.
 * @param msg - The user's message.
 * @param url - The URL provided by the user.
 * @returns {boolean} True if the message is valid, false if not.
 */
function validate (msg, url)
{
    if (!url)
    {
        msg.channel.send("I can't play nothing.");
        return false;
    }
    else if (!ytdl.validateURL(url))
    {
        msg.channel.send("You have not provided a valid Youtube URL.");
        return false;
    }
    else if (!msg.member.voiceChannel)
    {
        msg.channel.send("You're not in a voice channel!");
        return false;
    }

    return true;
}

/**
 * Represents the music player context for a single guild.
 * Responsible for processing music commands.
 */
class MusicContext
{
    /**
     * Construct a new MusicContext
     * @param guild - The guild to build the context for.
     */
    constructor (guild)
    {
        this.skipHandler = new MusicSkipHandler(this);
        this.guild = guild; // The guild that this music context is currently running in.

        this.queue = new MusicQueue.Queue(this); // Queue of items to play.
        this.currentItem = null; // Queue item representing what we're currently playing.

        this.textChannel = null; // Text channel that the initial play command was issued in. This probably could use changing.
        this.channel = null; // Current voice channel we're playing in. Currently, I'm under the assumption that we'll never be in a channel and not playing.

        this.connection = null; // Channel's voice connection.
        this.stream = null; // Current video's stream.

        function skipPrint(prefix, e)
        {
            let embed = new Discord.RichEmbed();

            embed.setTitle(prefix + " (" + e.current + " / " + e.required + ")");
            embed.setDescription(e.votes.reduce((value, user) => value + user.tag + "\n", "Votes:\n"));

            e.message.channel.send({embed});
        }

        // Called when someone votes to skip.
        this.skipHandler.on("vote", e => {
            if(e.current >= e.required)
            {
                let embed = this.currentItem.embed().setTitle("Skipping");
                e.message.channel.send({embed});
            }
            else
            {
                skipPrint(e.message.author.tag + " voted to skip", e);
            }
        });

        // Called when someone tried to vote to skip, but they already have.
        this.skipHandler.on("duplicateVote", e => {
            skipPrint("You already voted to skip!", e);
        });

        // Called when the skip is successful.
        this.skipHandler.on("skip", e => {
            // Kill the current encoder, and also kill the current stream.
            this.connection.player.destroy();
            this.connection.player.destroyCurrentStream();
        });
    }

    /**
     * @returns {boolean} True if music is currently being played, false if not.
     */
    get playing () { return this.channel != null; }

    /**
     * Runs a music command on this context
     * @param bot - The bot.
     * @param msg - The received message.
     * @param args - Message arguments.
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

    /**
     * Play command for playing music.
     * If music is currently playing, this new track will be queued up.
     * If music is not playing, the bot will join the user's voice channel and begin playing music.
     * @param msg - The user's message.
     * @param url - The user's provided url.
     */
    play (msg, url)
    {
        // Check if the play command is valid for this url.
        if(!validate(msg, url))
        {
            // Invalid play command
            return;
        }

        // Build the queue item for the user's provided url.
        let item = new MusicQueue.Item(url);

        // Play command is all good, so what shall we do?
        if(this.playing)
        {
            // Currently playing something, so try to queue this up
            this.queue.push(item);
        }
        else
        {
            // Join the user's channel and start playing now.
            this.channel = msg.member.voiceChannel;
            this.textChannel = msg.channel;

            this.channel.join()
                .then(c => {
                    this.connection = c;
                    this.startPlay(item);
                })
                .catch(e => {
                    this.stopPlay();
                    console.log("An error occurred while trying to play audio: " + e);
                });
        }
    }

    /**
     * Skip command for skipping the currently played track.
     * @param msg - The user's message.
     */
    skip (msg)
    {
        if (!this.playing)
        {
            msg.channel.send("Can't skip when I'm not playing anything.");
            return;
        }

        if (!this.channel.members.has(msg.author.id))
        {
            msg.channel.send("You're not even in the voice channel.");
            return;
        }

        this.skipHandler.vote(msg);
    }

    /**
     * List command for listing the current music queue.
     * @param msg - The user's message.
     */
    list (msg)
    {
        if(!this.playing)
        {
            msg.channel.send("Nothing is playing.");
            return;
        }

        let embed = this.queue.embed();

        msg.channel.send({embed});
    }

    /**
     * Start playing a music queue item.
     * @param queueItem - The queue item to begin playing.
     */
    startPlay (queueItem)
    {
        let ctx = this;

        function playQueueItem (item)
        {
            // If the context has moved on to another item while the info for this one was loading, don't play.
            if(ctx.currentItem !== item)
            {
                return;
            }

            let embed = item.embed().setTitle("Now playing");
            ctx.textChannel.send({embed});

            ctx.skipHandler.clear(); // Clear the skip handler for this new item.

            ctx.stream = ytdl(item.url, {filter: 'audioonly'});
            ctx.connection.playStream(ctx.stream, {seek: 0, volume: 1})
                .on("end", () => ctx.queue.next());
        }

        this.currentItem = queueItem;

        if (!this.connection)
        {
            // Something bad fucked up
            console.log("music: Somehow attempting to play without being in a channel.");
            return;
        }

        if (queueItem.loaded)
        {
            // Play the item immediately, as its info is already loaded.
            playQueueItem(queueItem);
        }
        else
        {
            // Wait for the info to load before playing.
            queueItem.on("load", playQueueItem);
        }
    }

    /**
     * Stop playing music and leave the voice channel.
     */
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
}

module.exports = MusicContext;