const redis = require("redis");
const Redite = require("redite");

/**
 * Responsible for handling a configuration that's stored in redis.
 */
class RedisConfig
{
    constructor (connection, descriptor)
    {
        this.config = null;
        this.descriptor = descriptor;
        this.connection = connection;
    }

    /**
     * Create a connection to a redis server.
     * @param redisUrl - The URL of the redis server to connect to.
     * @returns {Redite} - A redite client to perform redis queries with.
     */
    static connect (redisUrl)
    {
        const client = redis.createClient(redisUrl);
        return new Redite({client});
    }

    get data () { return this.descriptor.data(this.connection); }

    async initial ()
    {
        let initial = this.descriptor.initial();

        await this.data.set(initial);

        return initial;
    }

    async load ()
    {
        try
        {
            this.config = await this.data.get;
        }
        catch (e)
        {
            // Doesn't exist
            this.config = await this.initial();
        }

        return this.config;
    }

    async save ()
    {
        try
        {
            await this.data.set(this.config);
        }
        catch (e)
        {
            console.error(e);
        }
    }
}

module.exports = RedisConfig;