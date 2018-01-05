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

const people = {
    "celestia": "Celestia is one of my creators. She's pretty mysterious. Giiwca am ohepwm sgha rj lpf, nfx trypo pnfa ehv pthrjuioc eym qss li xlp krwe xw erj hvey.",
    "deelon": "Deelon is one of my creators. He's alright overall. Wore a skirt once.",
    "enra": "Enra helped out a lot in my creation. He's a great JS programmer!",
    "finite": "Finite is a rather cool chick, she's pretty chill and has a great name (Monica).",
    "hy": "Hy is one of the best non-professional cooks I've ever seen. She always makes Deelon's mouth drool when she shows her food.",
    "tyler": "Tyler is a sweet girl who just loves to pretend she's a huge slut. Kinda funny actually.",
    "nomura": "This guy is a bit weird, but fun to be around none the less. He supposedly had sex when he was like 5.",
    "latin": "An extremely professional lawyer, even though they don't have a law degree yet. I'd hire them any day.",
    "aegwynn": "Oof, her presence brings with it a lot of lewdness, it makes me flustered just thinking about her!",
    "snow": "Snow is such an amazing artist! Their gender is also a very closely guarded secret.",
    "fuji": "A very lovable mother. Fuji always spends her time protecting her children. She's so kind!",
    "sayo": "Sayo is a rather funny lawyer. Commonly found saying 'What the fuck?' to almost everything remotely strange.",
    "douwert": "Still hasn't played a game of PUBG with Deelon yet. He's still waiting for that, you know.",
    "neelarai": "A very sweet individual. Absolutely excellent to have in your raid team, too.",
    "m8gazine": "Literally one of the world's best osu players. People suspect he isn't human, and is actually a robot.",
    "pooh": "Aegwynn's familiar, Pooh is pretty cool. Commonly found telling people *real* shit.",
    "saagonsa": "A good listener, always helping people. You could probably talk to them about anything.",
    "calmaxys": "Another laywer. Does his job pretty well. Not nearly as good as Latin, though.",
    "celestial": "Yet another laywer, but more of the og laywer in comparison to the others.",
    "chr": "I'm not even sure what to say about them. They're simultaneously cool and absolutely fucked up.",
    "any": "He's only 13, please don't try to hit on him or marry him.",
    "cellery": "Dude this guys voice is deep as fuck. It makes Deelon feel like a little girl.",
    "mark": "Would probably screw Chr if he had the chance.",
    "muteogen": "Usually found commenting on how dead the chat is. Chat never truly dies, though.",
    "riko": "I can appreciate her, but she needs quite a few of her bugs sorted out.",
    "epyc": "A literal 0/10. You can't get any more 0 than this, it's mathematically impossible.",
    "supared": "todo ;)"
};

exports.call = function (context)
{
    let query = context.args.slice(1).join(' ');
    let rating = "";

    if (!query)
    {
        context.send("I rate your ability to use this command a 0/10.");
        return;
    }

    // Handle the special case of the user providing a number.
    let number = parseFloat(query);
    if (!Number.isNaN(number))
    {
        context.send("I rate " + number + " **" + (number * 10) + "/10.**");
        return;
    }

    // Respond to special inputs with a 30% chance
    if (funcs.randInt(0, 10) > 7)
    {
        let entry = people[query.toLowerCase()];
        if (entry)
        {
            context.send(entry);
            return;
        }
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

    context.send("I rate " + response + rating);
};
