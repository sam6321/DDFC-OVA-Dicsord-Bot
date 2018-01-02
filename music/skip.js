const EventEmitter = require('events');

/**
 * Responsible for holding a set of skip votes for a voice channel.
 * @event duplicateVote - Fired whenever a user votes to skip the same song multiple times.
 * @event vote - Fired whenever a user votes to skip for the first time.
 * @event skip - Fired whenever the appropriate number of votes to skip has been reached.
 */
class MusicSkipHandler extends EventEmitter
{
    /**
     * Construct a new MusicSkipHandler.
     * @param context - The MusicContext using this skip handler.
     * @param threshold - A skip is successful when this percentage of the voice channel votes to skip.
     */
    constructor (context, threshold=0.8)
    {
        super();

        this.context = context;
        this.skipVotes = {};
        this.requiredThreshold = threshold;
    }

    /**
     * @returns {number} Number of people that have voted to skip.
     */
    get count () { return Object.values(this.skipVotes).length; }

    /**
     * @returns {number} Required number of votes to skip.
     */
    get required () { return Math.round(this.requiredThreshold * (this.context.channel.members.size - 1)); }

    /**
     * Handle a skip vote message.
     * This will fire off the appropriate events based on the vote.
     * @param msg - The message to handle.
     */
    vote (msg)
    {
        // Check to be sure that our current set of votes is correct (check all users in the voice channel,
        // and be sure that if any have left the channel, but have a vote in skipVotes, to clear their vote first).
        // Add in this user's vote.

        let channel = this.context.channel;
        let user = msg.author;
        let id = user.id;
        let event = "";

        if (!channel)
        {
            console.log("No voice channel.");
            return; // Not in a voice channel anyway.
        }

        // Clear out all votes from people in this channel that have left.
        Object.keys(this.skipVotes).forEach(k => {
            if (!channel.members.has(k))
            {
                delete this.skipVotes[k];
            }
        });

        if (this.skipVotes[id])
        {
            // User already voted to skip.
            event = "duplicateVote";
        }
        else
        {
            // User voted to skip for the first time.
            this.skipVotes[id] = user;
            event = "vote";
        }

        let current = this.count;
        let required = this.required;

        let args = {
            message: msg,
            votes: Object.values(this.skipVotes),
            current: current,
            required: required,
            willSkip: current >= required
        };

        // Fire off the duplicateVote / vote event.
        this.emit(event, args);

        // Fire off the skip event if we have enough votes.
        if(args.willSkip)
        {
            this.emit("skip", args);
        }
    }

    /**
     * Clear all current skip votes.
     */
    clear ()
    {
        this.skipVotes = {};
    }
}

module.exports = MusicSkipHandler;