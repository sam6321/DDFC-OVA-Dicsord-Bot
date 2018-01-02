function hash(str) {
    let res = 0,
        len = str.length;
    for (let i = 0; i < len; i++)
    {
        res = res * 31 + str.charCodeAt(i);
    }
    return res;
}

function pad (value, align, padstr=' ')
{
    let mod = value.length % align;

    if (mod)
    {
        let required = align - mod;
        let padidx = 0;

        while (required)
        {
            value += padstr[padidx];
            padidx = (padidx + 1) % padstr.length;
            required -= 1;
        }
    }

    return value
}

function rotr (val, r_bits, max_bits=64)
{
    let l = ((val & (2**max_bits - 1)) >> r_bits % max_bits);
    let r = (val << (max_bits - (r_bits % max_bits)) & (2**max_bits - 1));

    return l | r;
}

function encrypt (string, key)
{
    // Pad the input and key to 4 bytes (repeat key, pad input with spaces)
    string = pad(string, 4);
    key = pad(key, 4, key);

    let out = "";
    let keyidx = 0;
    let keyshift = 0;
    let base_key_hash = hash(key);

    for(let i = 0; i < string.length; ++i)
    {
        let ch = string.charCodeAt(i);
        let rotkey = rotr(key.charCodeAt(keyidx), keyshift, 8); // Pull one byte from the key, and shift it based on the current keyshift
        let keyhash = (rotr(base_key_hash, keyshift) & 255); // Pull one byte from the key's has, and shift it based on the current keyshift
        out += String.fromCharCode(ch ^ rotkey ^ keyhash); // Mix the character with the current key byte, in addition to one byte of the key hash
        keyshift = (keyshift + 1) % 8; // Add 1 to the key shift, and shift + wrap the key to the right. Once the shift hits 8, reset it to 0.
        keyidx = (keyidx + 1) % key.length; // Use the next key index
    }

    return out
}

exports.encrypt = function (plaintext, key)
{
    return encrypt(plaintext, key);
};

exports.decrypt = function (ciphertext, key)
{
    return encrypt(ciphertext, key);
};