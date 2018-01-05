const funcs = require("../funcs.js");

exports.description = "Generate almond milk";
exports.info = module.exports.description;
exports.usage = "*tap (number of cups)";
exports.category = "hidden";

const responses = [
    "*liquid noises*",
    "*fluid noises*",
    "*liquid filling cups noises*",
    "*extremely fast water running sounds*",
    "*sploosh*",
    "*cow milking sound*",
    "*flowing sounds*",
    "*lava splashing sounds*",
    "*splash splash*",
    "*HNNNGGG*",
    "*small fluid explosion*",
    "*damp noises*",
    "*wet sounds*",
    "*aqueous noises*",
    "*cup filling sounds*",
    "*explosive fluid splashing*",
    "*nuclear fluidic burst*",
    "*pop*",
    "*melting sounds*",
    "*juicy splooshing sounds*",
    "*mm*",
    "*here it comes, daddy*",
    "*pulpy sloshing sounds*",
    "*runny watery sounds*",
    "*moist*",
    "*sappy moving sounds*",
    "*uncongealed sploshing*",
    "*explosive HNG sound*",
    "*succulent explosion*",
    "*liquiform sploshing*",
    "*sound of cups filling moderately fast*",
    "*splash*"
];

exports.call = function (context)
{
    let count = parseInt(context.args[1]);

    if (count === undefined || Number.isNaN(count))
    {
        context.send("Please request a valid amount.");
        return;
    }

    if (count > 50)
    {
        context.send("No, you'll dry up the tap.");
        return;
    }
    else if(count === 0)
    {
        context.send("Well if you don't want anything, why are you using the tap?");
        return;
    }
    else if(count < 0)
    {
        context.send("You can't deposit anything in to the tap.");
        return;
    }

    context.send(funcs.sample(responses));

    setTimeout(() => {
        let text = "";
        for(let i = 0; i < count; ++i)
        {
            text += ":milk: ";
        }

        context.send(text);
    }, funcs.mapLinear(count, 0, 50, 500, 3000)); // Map the count to a delay time.
};
