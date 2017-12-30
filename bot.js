const Discord = require('discord.js');
const bot = new Discord.Client();

var fs = require('fs');
var bSettings = require('./config.json');
var funcs = require('./funcs.js');

require.extensions['.txt'] = function (module, filename) 
{
    module.exports = fs.readFileSync(filename, 'utf8');
};

var errorLog = require("./log.txt");

bot.on('ready', () =>
{
	console.log("Bot is ready.");
	bot.user.setGame("Type "+bSettings.prefix+"help to get started");
});

bot.on('guildCreate', (guild) =>
{
	funcs.guildfolder(guild); 
});

bot.on('guildMemberAdd', (member) =>
{
	let guSettings = require(funcs.guildfolder(member.guild)+"/settings.json");
	require("./events/add")(member, guild_settings);
})

bot.on('message', (msg) =>
{
	let guSettings = require(funcs.guildfolder(msg.guild)+"/settings.json");

	if (!msg.content.startsWith(guild_settings.prefix))
	{
		return;
	}
	let args = msg.content.split('').slice(guSettings.prefix.length).join('').split(' ');
    let command = require("./Commands/"+args[0].toLowerCase()+".js");

	if (!command)
	{
		return; 
	}
	if (guSettings.disabled[args[0].toLowerCase()])
	{
		return; //return if the command is disabled in the guild
	}
	try 
	{
		command(bot, msg, args);
	}
	catch(err)
	{
		let date = new Date();
		msg.channel.send("Whoops! Something went wrong executing your command. This has been logged.");
		let report = "\n-Error occured in"+msg.guild.name+", at"+date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+"-\n"+err;
		fs.writeFileSync("./log.txt", errorLog+report);
		console.log(report);
	}

});

bot.login(bSettings.token);
