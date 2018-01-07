const Lexer = require('./lexer.js');
const Node = require('./node.js');

class Parser
{
    constructor (codeBlock)
    {
        this.lexer = new Lexer(codeBlock);
    }

    expect (tokenType)
    {
        let token = this.lexer.lex();

        if (token.type !== tokenType)
        {
            throw new Error("Parse error: Expected " + tokenType + ". Got: " + token.type);
        }

        return token;
    }

    next ()
    {
        return this.lexer.lex();
    }

    parseFunction (scope)
    {
        // [expression, expression, ...]

        // Looking at function parameters, they can either be ${} expressions, or immediate values.
        // Function parameters are separated by commas

        // Always start with an open parameter list ( [ )
        this.expect("[");

        while (true)
        {
            let token = this.next();

            if (!token)
            {
                throw new Error("Hit end of input while parsing function parameter list.");
            }

            switch (token.type)
            {
                // Now we can either parse an expression that'll resolve to one of this function's parameters, or an immediate value.
                case "${":
                    // Ok, we're parsing an expression
                    this.parseExpression(scope);
                    this.expect("}");
                    break;

                case "id":
                    scope.addChild(new Node.Immediate(token.value));
                    break;
            }

            token = this.next();

            if (!token)
            {
                throw new Error("Hit end of input while parsing function parameter list.");
            }

            if (token.type === "]")
            {
                // We're done parsing parameters
                break;
            }

            if (token.type !== ",")
            {
                // We need commas between expressions.
                throw new Error("Commas are required between function parameters. Found " + token.type);
            }
        }
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
                    this.expect("}");
                    break;

                default:
                    throw new Error("Unexpected token " + token.type);
            }
        }

        return scope;
    }
}

module.exports = Parser;