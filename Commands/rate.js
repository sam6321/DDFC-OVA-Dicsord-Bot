const funcs = require('../funcs.js');

exports.description = "Rate something out of 10.";
exports.info = exports.description;
exports.usage = "*rate (something)";
exports.category = "misc";

const replacements = {
    "our": "your",
    "my": "your",
    "your": "my",
    "these": "those",
    "myself": "yourself",
    "yourself": "myself",
    "me": "you"
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

    if (funcs.randInt(0, 10) === 10)
    {
        // Show a special rating
        rating = funcs.sample(special);
    }
    else
    {
        // Show a normal rating
        let number = funcs.randInt(0, 10);
        let prefix = number === 8 ? " an " : " a ";
        rating = prefix + number + "/10.";
    }

    let response = query.replace(/\bour\b|\bmy\b|\byour\b|\bthese\b|\bmyself\b|\byourself\b|\bme\b/g, matched => replacements[matched]);

    msg.channel.send("I rate " + response + rating);
};
