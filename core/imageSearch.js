const got = require("got");

const baseUrl = "https://danbooru.donmai.us";
const baseQuery = "/posts.json?";

function buildQuery(params)
{
    let string = baseUrl + baseQuery;
    let index = 0;
    let entries = Object.entries(params);

    for(const [key, value] of entries)
    {
        let sep = index < entries.length - 1 ? "&" : "";
        string += `${key}=${value}${sep}`;
        index++;
    }

    return string;
}

module.exports = async function(params)
{
    let response = await got(buildQuery(params));
    let body = JSON.parse(response.body);

    return body.map(item => baseUrl + item.file_url)
};