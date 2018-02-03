exports.description = "Say hello!";
exports.info = module.exports.description;
exports.usage = "*hello";
exports.category = "misc";

exports.call = async function (context)
{
    await context.send(`Hello! I'm ${context.client.user.tag}. Please type '${context.prefix}help' for a list of commands!`);
};