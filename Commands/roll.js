var funcs = require("../funcs.js");

exports.description = "Rolls a die (or flips a coin!).";
exports.info = module.exports.description;
exports.usage = "*roll (number of sides)";
exports.category = "misc";

exports.call = async function (context)
{
    let args = context.args;
    let max = 6;

    if (args[1])
    {
        max = parseInt(args[1]);
    }

    let outcome = funcs.randInt(1, max);

    if (max < 2) //User being a douche and trying to roll a die that doesn't exist :lul:
    {
        let s = max === 1 ? "" : "s";
        await context.send("I don't appear to have a die with " + max + " side" + s + ", wonder why...");
    }
    else if (max === 2)
    {
        await context.send("I flipped a coin and got " + (outcome === 1 ? "tails!" : "heads!"));
    }
    else
    {
        await context.send("I rolled a "+max+" sided die and got: "+outcome+".");
    }
};
