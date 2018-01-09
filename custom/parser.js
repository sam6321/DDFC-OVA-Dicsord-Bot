const funcs = require('../funcs.js');
const Lexer = require('./lexer.js');
const Node = require('./node.js');

class Parser
{
    constructor (codeBlock)
    {
        this.lexer = new Lexer(codeBlock);
    }

    expect (...tokenTypes)
    {
        function expected ()
        {
            return tokenTypes.reduce((value, token, index) => {
                return value + token + index === tokenTypes.length ? "" : " or ";
            }, "");
        }

        let token = this.lexer.lex();

        if (!token)
        {
            throw new Error("Parse error: Expected " + expected() + ". Got end of input");
        }

        // Check through the expected tokens list. Need to match at least one of the expected ones.
        if (!tokenTypes.some(type => token.type === type))
        {
            throw new Error("Parse error: Expected " + expected() + ". Got: " + token.type);
        }

        return token;
    }

    next ()
    {
        return this.lexer.lex();
    }

    parseFunctionParameter (scope)
    {
        while (true)
        {
            let token = this.next();
            switch (token.type)
            {
                case "${":
                    // Parse a nested expression
                    this.parseExpression(scope);
                    break;

                case "id":
                    // Parse an identifier value
                    scope.addChild(new Node.Variable(token.value));
                    break;

                case "raw":
                    // Parse a raw string
                    scope.addChild(new Node.Immediate(token.value));
                    break;

                case ",":
                    // On to the next parameter
                    return true;

                case "]":
                    // End of all parameters
                    return false;

                default:
                    throw new Error("Unexpected token while parsing function parameter: " + token.type);
            }
        }
    }

    parseFunction (scope)
    {
        // [expression, expression, ...]

        // Looking at function parameters, they can either be ${} expressions, or immediate values.
        // Function parameters are separated by commas

        // Always start with an open parameter list ( [ )
        this.expect("[");
        let done = false;

        do
        {
            // Add the group node for this input.
            let paramScope = new Node.Group();

            // TODO: This is pretty awkward...
            done = !this.parseFunctionParameter(paramScope);

            if (paramScope.length)
            {
                scope.addChild(paramScope);
            }
        }
        while(!done);

    }

    parseExpression (scope)
    {
        // ${variable | function: [params]}

        // The very first thing we need in an expression is always an variable name, or a function call.
        // These are both returned as identifier tokens, with the secondaryType referring to the the type of identifier
        // (function name, or variable name)
        let identifier = this.expect("id");
        let newScope;

        switch (identifier.secondaryType)
        {
            case "function":
                newScope = new Node.Function(identifier.value);
                this.parseFunction(newScope);
                break;

            case "variable":
                newScope = new Node.Variable(identifier.value);
                break;

            default:
                throw new Error("Bad identifier secondary type " + identifier.secondaryType);
        }

        scope.addChild(newScope);

        this.expect("}");
    }

    run ()
    {
        let scope = new Node.Group();

        while (true)
        {
            let token = this.next();

            // Hit the end of everything
            if (!token)
            {
                break;
            }

            // First token should be either a raw string, or an expression open.
            switch (token.type)
            {
                case "raw":
                    // Add the raw string in.
                    scope.addChild(new Node.Immediate(token.value));
                    break;

                case "${":
                    // This is an expression ( ${} ) so it needs to be parsed in to something.
                    this.parseExpression(scope);
                    break;

                default:
                    throw new Error("Unexpected token " + token.type);
            }
        }

        return scope;
    }
}

module.exports = Parser;