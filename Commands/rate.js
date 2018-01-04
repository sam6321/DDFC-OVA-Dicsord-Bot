const funcs = require('../funcs.js');

exports.description = "Rate something out of 10.";
exports.info = exports.description;
exports.usage = "*rate (something)";
exports.category = "misc";

const replaceRegex = /\bour\b|\bmy\b|\byour\b|\bthese\b|\bmyself\b|\byourself\b|\bme\b|\byou\b|\bi\b/gi;

const replacements = {
    "our": "your",
    "my": "your",
    "your": "my",
    "these": "those",
    "myself": "yourself",
    "yourself": "myself",
    "me": "you",
    "you": "me",
    "i": "you"
};

const special = [
    " a 9/11.",
    " an 11/10.",
    " absolutely perfect.",
    " completely awful.",
    " rather reasonable.",
    " meh."
];

exports.call = function (bot, msg, args)
{
    let query = args.slice(1).join(' ');
    let rating = "";

    if (!query)
    {
        msg.channel.send("I rate your ability to use this command a 0/10.");
        return;
    }

    // Handle the special case of the user providing a number.
    let number = parseFloat(query);
    if (!Number.isNaN(number))
    {
        msg.channel.send("I rate " + number + " **" + (number * 10) + "/10.**");
        return;
    }

    if (funcs.randInt(0, 10) === 10)
    {
        // Show a special rating
        rating = funcs.sample(special);
    }
    else
    {
        // Show a normal rating
        let number = funcs.randInt(0, 10);
        let prefix = number === 8 ? " an **" : " a **";
        rating = prefix + number + "/10.**";
    }

    let response = query.replace(replaceRegex, matched => {
        let replace = replacements[matched.toLowerCase()];

        // Match capitalisation of the first letter if the user provided it.
        if(matched[0] === matched[0].toUpperCase())
        {
            // Fucking immutable strings.
            replace = replace[0].toUpperCase() + replace.slice(1);
        }

        return replace;
    });

    msg.channel.send("I rate " + response + rating);
};
