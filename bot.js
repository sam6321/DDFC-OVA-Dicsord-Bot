const Discord = require("discord.js");
const bot = new Discord.Client();
var gSettings = require("./settings.json");

bot.on("ready", () =>
{
  console.log("Bot is ready");
});

bot.on("message", (message) =>
{
});

bot.login(gSettings.token);
