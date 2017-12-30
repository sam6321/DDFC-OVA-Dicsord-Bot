var funcs = require("../funcs.js");

exports.description = "Rolls a die (or a coin!)."

exports.call = function (bot, msg, args)
{
    let max = 6;
    if (args[1])
    {
        max = parseInt(args[1]);
    }
    let outcome = funcs.randInt(1, max);

    if (max<1 || !max) //User being a douche and trying to roll a die that doesn't exist :lul:
    {
        msg.channel.send("I don't appear to have any die with "+args[1]+" sides, wonder why...");
        return;
    }
    if (max == 1)
    {
        msg.channel.send("I don't appear to have any die with one side, wonder why...");
        return;
    }
    if (args[1] == '2')
    {
        switch (outcome)
        {
            case 1:
                msg.channel.send("I flipped a coin and got tails!");
                break;
            case 2:
                msg.channel.send("I flipped a coin and got heads!");
                break;
        }
        return;
    }

    msg.channel.send("I rolled a "+max+" sided die and got: "+outcome+".");
    return;
}
