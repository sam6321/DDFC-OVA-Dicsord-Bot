var fs = require('fs');
var global_settings = require("./config.json");

module.exports.guildfolder = function (guild)
{
	var init_settings = 
	{
		banned_users	:	[],
		custom_commands	:	[],
		prefix			:	global_settings.prefix,
		admins			:	[guild.ownerID],
		enabled_events	:	[],
		greet           :   true,
		greet_channel	:	guild.defaultChannel.id,
		mod_channel		:   null,  
		disabled		:   []
	}
	if (fs.existsSync("./Guilds/"+guild.id))
	{
		return "./Guilds/"+guild.id;
	}
	else
	{
		fs.mkdirSync("./Guilds/"+guild.id);
		fs.writeFileSync("./Guilds/"+guild.id+"/settings.json",JSON.stringify(init_settings,null,4));
	}
}

module.exports.randInt = function(min,max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
