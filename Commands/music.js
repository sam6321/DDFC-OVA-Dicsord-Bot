const fs = require("fs");
const path = require("path");

exports.description = "Play a music file. Currently just from a local directory.";
exports.usage = "(prefix)music (file)";

const AUDIO_PATH = "./music";
let playing = false;
let connection = null;

/**TODO:
 * Music queue
 * Stream music from youtube / other external sources
 * Skip vote to skip the current track.
 * List to list all queued tracks, and the current track.
 */

exports.call = function (bot, msg, args)
{
    let voiceChannel = msg.member ? msg.member.voiceChannel : null;

    if (!msg.guild)
    {
        msg.channel.send("Can't play music outside of a guild.");
        return;
    }
    else if (!voiceChannel)
    {
        msg.channel.send("You're not in a voice channel.");
        return;
    }
    else if (!args[1])
    {
        msg.channel.send("I can't play nothing.");
        return;
    }
    else if (playing)
    {
        msg.channel.send("I'm already playing an audio file. Please wait for me to finish.");
        return;
    }

    let audioFile = path.join(AUDIO_PATH, args[1]);

    if (!path.extname(audioFile))
    {
        audioFile = `${audioFile}.mp3`; // use MP3 as the default ext if we have none.
    }

    if (!fs.existsSync(audioFile))
    {
        msg.channel.send("That audio file does not exist.");
        return;
    }

    playing = true;
    voiceChannel.join()
        .then(c => {
            c.playFile(audioFile)
                .on("end", () => {
                    voiceChannel.leave();
                    playing = false;
                });

            connection = c;
        })
        .catch(e => {
            voiceChannel.leave();
            console.log(`An error occurred while trying to play audio: ${e}`);
        });
};
