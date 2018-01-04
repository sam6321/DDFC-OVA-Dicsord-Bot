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
        this._info = null;

        this.infoPromise = ytdl.getInfo(url)
            .then(info => {
                this._info = {
                    title: info.title,
                    channelURL: info.author.channel_url,
                    duration: info.length_seconds
                };
            })
            .catch(console.error);
    }

    /**
     * @returns {Promise} A promise for the info of this queue item.
     */
    get info ()
    {
        return new Promise((resolve, reject) => {
            this.infoPromise
                .then(() => resolve(this._info))
                .catch(reject);
        });
    }

    /**
     * @returns {boolean} true if the item has loaded, false if not.
     */
    get loaded () { return this._info !== null; }

    /**
     * @returns {string} The title of this item, or its URL if the info hasn't loaded.
     */
    get title () { return this.loaded ? this._info.title : this.url; }

    /**
     * Returns a discordjs RichEmbed representing this item.
     * @returns {RichEmbed}
     */
    embed ()
    {
        let info = this._info;

        let embed = new Discord.RichEmbed();

        if (this.loaded)
        {
            embed.setDescription(info.title + " (" + funcs.formatTime(info.duration) + ")\n" + this.url);
        }
        else
        {
            embed.setDescription(this.url);
        }

        return embed;
    }

    /**
     * Converts this item to a string.
     * @returns {string}
     */
    toString ()
    {
        let info = this._info;

        if (this.loaded)
        {
            return info.title + " (" + funcs.formatTime(info.duration) + ")\n" + this.url;
        }
        else
        {
            return this.url;
        }
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