function isIdentifierChar (str, first=false)
{
    let code = str.charCodeAt(0);

    return (code > 47 && code < 58 && !first) || // numeric (0-9), only valid if not first.
        (code > 64 && code < 91) || // upper alpha (A-Z)
        (code > 96 && code < 123) || // lower alpha (a-z)
        (code === 242);
}

function isWhiteSpace (str)
{
    let code = str[0];

    return code === '\u0020' || code === '\u0009' || code === '\u000A' ||
        code === '\u000C' || code === '\u000D';
}
/*
Revised language
Everything outside of an initial ${} is treated as a raw string.
Inside a ${}:
    strings are encased in ''
    [ and ] are function parameters
    words are identifiers, and an identifier that ends with a : is a function
 */

class Lexer
{
    constructor (text)
    {
        this.text = text.trim();
        this.index = 0;
        this.depth = 0;
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

    isFinished ()
    {
        return this.index === this.text.length;
    }

    inExpression ()
    {
        return this.depth > 0;
    }

    ch (offset=0)
    {
        return this.text[this.index + offset];
    }

    str (size=0)
    {
        return this.text.substr(this.index, size);
    }

    consume (amount)
    {
        this.index = Math.min(this.index + amount, this.text.length);
        return this.ch();
    }

    setToken (type, value, secondaryType = "")
    {
        this.token = {
            type: type,
            secondaryType: secondaryType,
            value: value
        };
    }

    lexWhitespace ()
    {
        let ch = this.ch();

        while(isWhiteSpace(ch))
        {
            ch = this.consume(1);
        }

        return ch;
    }

    lexRawString (until)
    {
        // Just pull characters out until we hit our 'until' pattern
        let ch = this.ch();
        let string = "";

        while (ch)
        {
            let start = this.str(until.length);
            if (start === until)
            {
                // This is where we finish our current string.
                break;
            }

            string += ch;
            ch = this.consume(1);
        }

        this.setToken("raw", string);

        return this.token;
    }

    lexIdentifier ()
    {
        // Pull out characters for an identifier. They have to be alphanumeric
        let ch = this.ch();
        let string = "";
        let secondaryType = "variable";

        if (!isIdentifierChar(ch, true))
        {
            throw new Error("Identifiers must only contain alphanumeric characters or underscores, and must not start with a number. Got identifier starting with '" + ch);
        }

        while (ch)
        {
            if (ch === ":")
            {
                // This marks the end of the identifier, and that the identifier is a function call.
                secondaryType = "function";
                this.consume(1);
                break;
            }

            // Not an identifier char = end of this identifier
            if (!isIdentifierChar(ch))
            {
                break;
            }

            string += ch;
            ch = this.consume(1);
        }

        this.setToken("id", string, secondaryType);
    }

    lexExpression ()
    {
        // While we're inside an expression or param list, skip over whitespace.
        let ch = this.lexWhitespace(),
            next = this.ch(1);

        switch (ch)
        {
            case undefined:
                // Hit the end of the input
                return null;

            // $ might be an open expression
            case "$":
                if (next === "{")
                {
                    this.setToken("${");
                    this.depth++;
                    this.consume(2);
                }

                break;

            // } might be the close of an expression.
            case "}":
                // Note: This is impossible to reach without first hitting a ${
                // This is the end of the current ${
                this.depth--;
                this.setToken("}");
                this.consume(1);
                break;

            // [ might be the open of a param list
            case "[":
                this.setToken("[");
                this.consume(1);
                break;

            // ] might be the close of a param list
            case "]":
                this.setToken("]");
                this.consume(1);
                break;

            // Might be a function parameter separator
            case ",":
                this.setToken(",");
                this.consume(1);
                break;

            // Might be a raw string inside a function parameter or expression
            case "\'":
                this.consume(1); // Step over the '
                this.lexRawString("'");
                this.consume(1); // Step over the '
                break;

            default:
                // We're inside an expression, so this is an identifier
                this.lexIdentifier();
                break;
        }

        return this.token;
    }

    lex ()
    {
        if (this.str(2) === "${" || this.inExpression())
        {
            // We're sitting on an open expression, or we're inside an expression right now
            return this.lexExpression();
        }

        // If we're not parsing an expression, simply pull out a big string
        return this.isFinished() ? null : this.lexRawString("${");
    }
}

module.exports = Lexer;