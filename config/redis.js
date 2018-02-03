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

    async initial ()
    {
        let initial = this.descriptor.initial(this.connection);

        await this.descriptor.setData(this.connection, initial);

        return initial;
    }

    async load ()
    {
        if (this.config === null)
        {
            try
            {
                this.config = await this.descriptor.getData(this.connection);
            }
            catch (e)
            {
                // Doesn't exist
                this.config = await this.initial();
            }
        }

        return this.config;
    }

    async save ()
    {
        try
        {
            await this.descriptor.setData(this.connection, this.config);
        }
        catch (e)
        {
            console.error(e);
        }
    }
}

module.exports = RedisConfig;