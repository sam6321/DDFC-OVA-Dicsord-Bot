function isAlphaNumeric (str)
{
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}


class Lexer
{
    constructor (text)
    {
        this.text = text.trim();
        this.index = 0;
        this.state = [];
        this.token = null;

        // This should lex strings as follows
        // [thing1, thing2, thing3] = openParamBlock, id, id, id
        // ${thing1: [${param1}, something]} = ${Block, functionCall, openParamBlock, ${Block, identifier, }Block, ,, identifier, closeParamBlock, }Block
        // this is a string = rawString

        // ${ = ${Block
        // } = }Block
        // [ = openParamBlock
        // ] = closeParamBlock
        // , = ,
        // 'anything' (if in param block or expression block) = identifier
        // identifier: = functionCall
        // all other raw values outside of param or expression blocks are just flat raw strings.
    }

    stateTop ()
    {
        return this.state[this.state.length - 1];
    }

    ch (offset=0)
    {
        return this.text[this.index + offset];
    }

    setToken (type, value, secondaryType = "")
    {
        this.token = {
            type: type,
            secondaryType: secondaryType,
            value: value
        };
    }

    consume (amount)
    {
        this.index += amount;
        return this.ch();
    }

    lexRawString ()
    {
        // Just pull characters out until we hit a ${
        let ch = this.ch();
        let string = "";

        while (ch)
        {
            if (ch === '$' && this.ch(1) === "{")
            {
                // This is where we finish our current string.
                break;
            }

            string += ch;
            ch = this.consume(1);
        }

        this.setToken("raw", string);
    }

    lexIdentifier ()
    {
        // Pull out characters for an identifier. They have to be alphanumeric
        let ch = this.ch();
        let string = "";
        let secondaryType = "variable";

        while (ch)
        {
            if (ch === ":")
            {
                // This marks the end of the identifier, and that the identifier is a function call.
                secondaryType = "function";
                this.consume(1);
                break;
            }

            // Non-alphanumeric = end of this identifier
            if (!isAlphaNumeric(ch))
            {
                break;
            }

            string += ch;
            ch = this.consume(1);
        }

        this.setToken("id", string, secondaryType);
    }

    lex ()
    {
        let ch = this.ch();
        let next = this.ch(1);
        let stateTop = this.stateTop();

        // While we're inside an expression or param list, skip over whitespace.
        while (/\s/.test(ch) && (stateTop === "${" || stateTop === "["))
        {
            this.consume(1);
            ch = this.ch();
            next = this.ch(1);
        }

        switch (ch)
        {
            case undefined:
                // Hit the end of the input
                if (stateTop !== undefined)
                {
                    throw new Error("Hit end of input without a close for " + stateTop);
                }

                return null;

            // $ might be an open expression
            case "$":
                if (next === "{")
                {
                    this.setToken("${", "${");
                    this.state.push("${");
                    this.consume(2);
                }
                else
                {
                    // Not an open expression, just treat as a raw string
                    this.lexRawString();
                }

                break;

            // } might be the close of an expression.
            case "}":
                if (stateTop === "${")
                {
                    // This is the end of the current ${
                    this.state.pop();
                    this.setToken("}");
                    this.consume(1);
                }
                else
                {
                    // treat as raw string
                    this.lexRawString();
                }

                break;

            // [ might be the open of a param list
            case "[":
                if (stateTop === "${")
                {
                    this.state.push("[");
                    this.setToken("[");
                    this.consume(1);
                }
                else
                {
                    // treat as raw string
                    this.lexRawString();
                }
                break;

            // ] might be the close of a param list
            case "]":
                if (stateTop === "[")
                {
                    this.state.pop();
                    this.setToken("]");
                    this.consume(1);
                }
                else
                {
                    // treat as raw string
                    this.lexRawString();
                }

                break;

            case ",":
                if (stateTop === "[")
                {
                    this.setToken(",");
                    this.consume(1);
                }
                else
                {
                    // treat as raw string
                    this.lexRawString();
                }
                break;

            default:
                if (stateTop === "[" || stateTop === "${")
                {
                    // We're inside a param list or expression, so this is an identifier
                    this.lexIdentifier();
                }
                else
                {
                    // We're outside a param list or expression, so this is just a raw string.
                    this.lexRawString();
                }
                break;
        }

        return this.token;
    }
}

module.exports = Lexer;