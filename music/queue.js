const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const funcs = require("../funcs.js");

/**
 * A music queue item for a youtube video.
 * Contains information about the video.
 * @event load - Fired once the info for this video has been loaded.
 */
class MusicQueueItem
{
    /**
     * Construct a new MusicQueueItem.
     * @param url - The youtube URL of the item.
     */
    constructor (url)
    {
        this.url = url;
        this.loaded = false;
        this.info = null;
        this.infoPromise = ytdl.getInfo(url, {filter: 'audioonly'})
            .then(info => { this.loaded = true; this.info = info; })
            .catch(console.error);
    }

    /**
     * @returns {string} The title of this item, or its URL if the info hasn't loaded.
     */
    get title () { return this.loaded ? this.info.title : this.url; }
    get channelURL () { return this.loaded ? this.info.author.channel_url : ""; }
    get duration () { return this.loaded ? this.info.length_seconds : ""; }

    /**
     * Returns a discordjs RichEmbed representing this item.
     * @returns {RichEmbed}
     */
    embed ()
    {
        let embed = new Discord.RichEmbed();
        let description = this.title;

        if (this.loaded)
        {
            description += ` (${funcs.formatTime(this.duration)})\n${this.url}`;
        }

        embed.setDescription(description);

        return embed;
    }

    /**
     * Converts this item to a string.
     * @returns {string}
     */
    toString ()
    {
        let str = this.title;

        if (this.loaded)
        {
            str += ` (${funcs.formatTime(info.duration)})\n${this.url}`;
        }

        return str;
    }
}

/**
 * Music queue that contains a list of queued items, waiting to play.
 */
class MusicQueue
{
    /**
     * Construct a new MusicQueue
     * @param context - The MusicContext that the queue belongs to.
     */
    constructor (context)
    {
        this.context = context;
        this.queue = [];
    }

    /**
     * @returns {number} - Length of the queue.
     */
    get length () { return this.queue.length; }

    /**
     * Returns a discordjs RichEmbed representing all items in the queue.
     * @returns {RichEmbed}
     */
    embed ()
    {
        let embed = new Discord.RichEmbed().setTitle("Music Queue");

        embed.addField("Now playing", this.context.currentItem);

        if (this.queue.length)
        {
            let count = this.queue.length;

            if(this.queue.length > 24)
            {
                let overflow = this.queue.length - 24;
                embed.setDescription(overflow + " queue items not shown.");
                count = 24;
            }
            else
            {
                embed.setDescription("Showing all items.");
            }

            for(let i = 0; i < count; ++i)
            {
                embed.addField(i === 0 ? "Next" : i.toFixed(0), this.queue[i]);
            }
        }

        return embed;
    }

    /**
     * Push a new item on to the queue.
     * @param {MusicQueueItem} item - The item to add to the queue.
     * @returns {MusicQueue}
     */
    push (item)
    {
        this.queue.push(item);
        return this;
    }

    /**
     * Move on to playing the next item in the queue, or stop playing if the queue is now empty.
     */
    next ()
    {
        //  Try to pop an item from the queue and start playing it.
        let next = this.queue.shift();

        if(next)
        {
            // Move on to playing the next thing
            this.context.startPlay(next);
        }
        else
        {
            // Done playing everything.
            this.context.stopPlay();
        }
    }
}

module.exports.Item = MusicQueueItem;
module.exports.Queue = MusicQueue;