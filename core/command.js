const fs = require("fs");
const path = require("path");

exports.description = "Reads command functions from a set of js files in a directory, and dispatches command requests to the appropriate function.";

class CommandLoader
{
    constructor(dispatcher)
    {
        this.dispatcher = dispatcher;
    }

    addDirectory(directory)
    {
        let stat = fs.lstatSync(directory);

        if (stat.isDirectory())
        {
            for (const file of fs.readdirSync(directory))
            {
                this.addFile(path.join(directory, file));
            }
        }
        else
        {
            throw new Error(`command: addDirectory ${directory} is not a directory.`);
        }
    }

    addFile(filePath)
    {
        let stat = fs.lstatSync(filePath);

        if (!stat.isFile())
        {
            throw new Error(`command: addFile ${filePath} is not a file.`);
        }
        else if (!filePath.endsWith(".js"))
        {
            throw new Error(`command: addFile ${filePath} is not a js file.`);
        }
        else
        {
            let name = path.basename(filePath, '.js');
            let command = require(path.resolve(filePath));

            this.dispatcher.add(name, command);
        }
    }
}


/**
 * Command dispatcher responsible for holding a list of commands that can be called via the 'dispatch' method.
 * Commands can be registered as functions, or objects that have a 'call' function.
 */
class CommandDispatcher
{
    /**
     * Construct a new CommandDispatcher
     */
    constructor ()
    {
        this._commands = {};
    }

    /**
     * Returns a dispatch function for the provided callable object.
     * @param object - The object to form the dispatch function for.
     * @returns {function|null} - The dispatch function, or null if the object is not callable.
     */
    createDispatcher (object)
    {
        if (typeof object === 'function')
        {
            return args => object(...args);
        }
        else if (typeof object.call === 'function')
        {
            return args => object.call(...args);
        }
        else
        {
            return null;
        }
    }

    /**
     * Add a new command to the command dispatcher.
     * This will silently overwrite pre-existing commands with the same name.
     * @param name - The name of the command.
     * @param callable - A function, or object that has a 'call' method that should be called when the function is invoked.
     */
    add (name, callable)
    {
        let dispatcher = this.createDispatcher(callable);

        if (!dispatcher)
        {
            throw new Error(`command: add ${name} is not registered with a valid function or callable instance.`);
        }
        else
        {
            this._commands[name] = dispatcher;
        }
    }

    /**
     * Removes the specified command from the command dispatcher.
     * This will do nothing if the command isn't added.
     * @param name - The command to remove.
     */
    remove (name)
    {
        delete this._commands[name];
    }

    /**
     * Determines whether this command dispatcher has the specified command.
     * @param name - The command to check for.
     * @returns {boolean} - True if the command is present, false if not.
     */
    has (name)
    {
        return this._commands[name] !== undefined;
    }

    /**
     * Call a command with the provided arguments.
     * @param name - The command to call.
     * @param args - Arguments for the command.
     */
    async dispatch (name, ...args)
    {
        let command = this._commands[name];

        if (command)
        {
            return await command(args);
        }

        return null;
    }

    /**
     * Iterate over all the commands registered in this dispatcher.
     * @example for(const command of dispatcher) { /* do something with command *\/}
     */
    *[Symbol.iterator] ()
    {
        yield* Object.entries(this._commands);
    }
}

module.exports.Loader = CommandLoader;
module.exports.Dispatcher = CommandDispatcher;