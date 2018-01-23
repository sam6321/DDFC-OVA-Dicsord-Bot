const Discord = require("discord.js");
const search = require("../core/imageSearch");

exports.description = "Search for an anime image of some kind.";
exports.usage = "*image (tags)";
exports.info = module.exports.description;
exports.category = "misc";

exports.call = async function (context)
{
    let tags = context.args.slice(1).join(' ');
    let description = tags;

    let images = await search({
        limit: 1,
        random: 'true',
        tags: `rating:s ${tags}`
    });

    let embed = new Discord.RichEmbed()
        .setTitle("Image Search");

    if (images.length)
    {
        embed.setImage(images[0]);
    }
    else
    {
        description = "No results: " + description;
    }

    embed.setDescription(description)

    context.send({embed});
};
