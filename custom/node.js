const funcs = require("../funcs.js");

const availableFuncs =
{
    randomNumber : funcs.randInt,
    randomResponse : funcs.sample
};

/**
 * A parse node evaluates to either the value of its name
 * Or, if its name is an inbuilt function, to the return value of its function called with the evaluated values of
 * its parameters.
 */
class ParseNode
{
    constructor ()
    {
        this.children = [];
    }

    addChild (...node)
    {
        this.children.push(...node);
    }

    evaluate (globalParams)
    {
        return null; // Override in subclasses.
    }
}

// The global part of this needs to just concat everything together and return it.
class GlobalParseNode extends ParseNode
{
    constructor ()
    {
        super();
    }

    evaluate (globalParams, context)
    {
        let value = "";

        for (const parameter of this.children)
        {
            value += parameter.evaluate(globalParams, context);
        }

        return value;
    }
}

// Immediates simply evaluate to whatever value they already have
class ImmediateParseNode extends ParseNode
{
    constructor (value)
    {
        super();
        this.value = value;
    }

    evaluate ()
    {
        return this.value;
    }
}

// Variables evaluate to something from the variables block.
class VariableParseNode extends ParseNode
{
    constructor (name)
    {
        super();
        this.name = name;
    }

    evaluate (globalParams)
    {
        return globalParams[this.name]
    }
}

class FunctionParseNode extends ParseNode
{
    constructor (name)
    {
        super();
        this.name = name;
    }

    evaluate (globalParams, context)
    {
        // Compute the value from whatever the provided function is.
        let func = availableFuncs[this.name];

        if (!func)
        {
            // This evaluates to the global param for this specific name.
            throw new Error("Error evaluating: " + this.name + " is not a function.");
        }

        // This evaluates to a function, so we need to evaluate the value of our
        // child nodes first, before evaluating this one.
        let parameters = this.children.map(child => {
            let stringValue = child.evaluate(globalParams, context);
            let number = parseFloat(stringValue);

            if (!isNaN(number))
            {
                return number;
            }

            return stringValue;
        });

        // Call the function with the evaluated values of our children.
        let result = func.apply(null, parameters);

        if (result === undefined || result === null || isNaN(result))
        {
            context.send("Warning: Value returned from " + this.name + " is undefined, null or NaN.");
        }

        return result;
    }
}

module.exports.Global = GlobalParseNode;
module.exports.Immediate = ImmediateParseNode;
module.exports.Variable = VariableParseNode;
module.exports.Function = FunctionParseNode;