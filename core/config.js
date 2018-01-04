// Note: The main config is only loaded once during the lifetime of the application.

const fs = require("fs");

let config = null;

/**
 * Loads up config variables from the specified JSON file.
 * @param file - The file to load the config from.
 * @returns {*} - The loaded config variables.
 */
function loadFromFile (file)
{
    return JSON.parse(fs.readFileSync(file));
}

/**
 * Loads up config variables from the system environment variables.
 * @param env - The environment variables.
 * @returns {*} - The loaded config variables.
 */
function loadFromEnv (env)
{
    let cfg = {};

    const envMap = {
        "token": "DISCORD_TOKEN",
        "prefix": "DISCORD_PREFIX",
        "host": "DISCORD_HOST"
    };

    for (const [key, value] of Object.entries(envMap))
    {
        cfg[key] = env[value];
    }

    return cfg;
}

let loadOrder = [
    loadFromFile.bind(null, "./settings.json"),
    loadFromEnv.bind(null, process.env)
];

/**
 * Returns the current app configuration.
 * Attempts to load the configuration if it has not been loaded.
 * Will return null if no configuration loading methods succeed.
 * @returns {*} - App configuration, or null.
 */
module.exports = function ()
{
    if (!config)
    {
        for (const fn of loadOrder)
        {
            try
            {
                config = fn();
                console.log("Loaded config via: " + fn.name);
                break;
            }
            catch (e)
            {
                console.warn("config: Could not load via: " + fn.name + "\n" + e);
            }
        }

        if(!config)
        {
            console.error("config: Could not load config from any source! Please check app configuration.");
        }
    }

    return config;
};