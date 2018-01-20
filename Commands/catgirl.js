const Discord = require("discord.js");
var funcs = require("../funcs.js");
const got = require("got");

exports.description = "Display a catgirl of some kind.";
exports.usage = "*catgirl";
exports.info = module.exports.description;
exports.category = "misc";

const query = "/posts.json?limit=1s&random=true&tags=rating:s nekomimi";
const baseUrl = "https://danbooru.donmai.us";

exports.call = async function (context)
{
    let response = await got(baseUrl + query);
    let body = JSON.parse(response.body);
    let image = baseUrl + body[0].file_url;

    let embed = new Discord.RichEmbed()
        .setTitle("Catgirl(s)")
        .setDescription("And occasionally catguys...")
        .setImage(image);

    context.send({embed});
};
