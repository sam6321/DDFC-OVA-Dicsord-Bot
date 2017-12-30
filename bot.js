require.extensions['.txt'] = function (module, filename) 
{
    module.exports = fs.readFileSync(filename, 'utf8');
};

const Discord = require('discord.js');
const Command = require('./core/command.js');
const fs = require('fs');
const funcs = require('./funcs.js');
const bSettings = require("./settings.json");

const bot = new Discord.Client();
let commandDispatcher = new Command.Dispatcher();

// Add all commands from this directory in to the dispatcher.
commandDispatcher.addDirectory('./Commands');

bot.on('ready', () =>
{
    console.log("Bot is ready.");
    console.log(`Logged in as ${bot.user.tag}.`);
    bot.user.setGame("Type "+bSettings.prefix+"help to get started");
});

bot.on('guildCreate', (guild) =>
{
    funcs.guildfolder(guild); 
});

// Don't have events/add yet.
/*
bot.on('guildMemberAdd', (member) =>
{
    let guild_settings = require(funcs.guildfolder(member.guild)+"/settings.json");
    require("./events/add")(member, guild_settings);
})
*/ 

bot.on('message', (msg) =>
{
    try
    {
        let guild_settings = require(funcs.guildfolder(msg.guild) + "/settings.json");

        if (!msg.content.startsWith(guild_settings.prefix))
        {
            return;
        }

        // Ignore the prefix.
        let content = msg.content.slice(guild_settings.prefix.length);
        // Split args into words.
        args = content.split(' ');

        if (guild_settings.disabled[args[0].toLowerCase()])
        {
            return; //return if the command is disabled in the guild
        }
    }
    catch(err)
    {
        // Internal error, don't report to the user
        console.log(`main: An internal exception occurred processing message: ${msg.content}.`);
        console.error(err);
        return;
    }

    try 
    {
        // Dispatch the command to the specified function.
        commandDispatcher.dispatch(args[0], bot, msg, args);
    }
    catch(err)
    {
        let date = new Date();
        let id = funcs.randInt(000000000000,999999999999);
        msg.channel.send("Whoops! Something went wrong executing your command. This has been logged. ID:"+id);
        let report = "\n-Error occured in"+msg.guild.name+", at"+date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+" with ID:"+id+"-\n"+err;
        fs.appendFile("./log.txt", errorLog + report + "\n");
        console.log(report);
    }

});

if(!bSettings.token) 
{
    console.log("main: Token is missing from settings file. Please add token to settings.json.");
    process.exit(1);
}
else 
{
    // All good to go.
    console.log("Available command(s): ");
    commandDispatcher.each(command => {
        console.log(`  ${command}`);
    });

    bot.login(bSettings.token);
}


