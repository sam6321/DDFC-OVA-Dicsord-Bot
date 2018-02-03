// Note: The main config is only loaded once during the lifetime of the application.
const fs = require("fs");
const initial = require("./initial.js");

const CONFIG_PATH = "./config.json";

/**
 * Loads up config variables from the specified JSON file.
 * @param file - The file to load the config from.
 * @returns {*} - The loaded config variables.
 */
function loadFromFile (file)
{
    let config = JSON.parse(fs.readFileSync(file));
    config.source = "file";
    return config;
}

/**
 * Loads up config variables from the system environment variables.
 * @param env - The environment variables.
 * @returns {*} - The loaded config variables.
 */
function loadFromEnv (env)
{
    let config = {};
    let loaded = false;

    const envMap = {
        "token": "DISCORD_TOKEN",
        "prefix": "DISCORD_PREFIX",
        "host": "DISCORD_HOST",
        "redis": "REDIS_URL"
    };

    for (const [key, value] of Object.entries(envMap))
    {
        if (key in env)
        {
            config[key] = env[value];
            loaded = true; // At least one item loaded, so the env is somewhat correct.
        }
    }

    if (!loaded)
    {
        throw new Error("config: None of the required environment variables are present.");
    }

    config.source = "env";

    return config;
}

let loadOrder = [
    loadFromFile.bind(null, CONFIG_PATH),
    loadFromEnv.bind(null, process.env)
];

/**
 * Loads the global config.
 * Attepts to load from the following sources:
 *  local settings.json
 *  environment variables
 * If neither functions are able to load successfully, null is returned.
 */
exports.load = function()
{
    let globalConfig = null;
    // Load the global configuration
    for (const fn of loadOrder)
    {
        try
        {
            globalConfig = fn();
            console.log(`config: Loaded config via: ${globalConfig.source}`);
            break;
        }
        catch (e)
        {
            console.warn(`config: Could not load via: ${fn.name}\n${e}`);
        }
    }

    if(!globalConfig)
    {
        console.error("config: Could not load config from any source! Creating default config.json.");
        globalConfig = initial.global();
        fs.writeFile(CONFIG_PATH, JSON.stringify(globalConfig, null, 4));
    }

    return globalConfig;
};