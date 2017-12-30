const fs = require("fs");
const path = require("path");

exports.description = "Reads command functions from a set of js files in a directory, and dispatches command requests to the appropriate function."

// Simple command dispatcher.
class CommandDispatcher
{
    constructor()
    {
        this.commands = {};
    }

    addDirectory(directory)
    {
        let stat = fs.lstatSync(directory);

        if(stat.isDirectory()) 
        {
            fs.readdirSync(directory).forEach(file => {
                this.addFile(path.join(directory, file));
            });
        }
        else
        {
            console.log(`command: addDirectory ${directory} is not a directory.`);
        }
    }

    addFile(filePath)
    {
        let stat = fs.lstatSync(filePath);

        if(!stat.isFile())
        {
            console.log(`command: addFile ${filePath} is not a file.`);
        }
        else if(!filePath.endsWith(".js"))
        {
            console.log(`command: addFile ${filePath} is not a js file.`);
        }
        else
        {
            let name = path.basename(filePath, '.js');
            let command = require(path.resolve(filePath));

            this.add(name, command);
        }
    }

    // name is the name of the command.
    // callable is either a function, or an object with a 'call' property that is a function.
    add(name, callable)
    {
        if(typeof callable != 'function' && typeof callable.call != 'function')
        {
            console.log(`command: add ${name} is not registered with a valid function or callable instance.`);
        }
        else
        {
            if(this.commands[name]) 
            {
                console.log(`command: add Duplicate command ${name}`);
            }

            this.commands[name] = callable;
        }
    }

    dispatch(name)
    {
        let args = Array.prototype.slice.call(arguments, 1);
        let command = this.commands[name];

        if(command) 
        {
            if(typeof command == 'function')
            {
                // Call as function.
                command.apply(null, args);
            }
            else if(typeof command.call == 'function')
            {
                // Call the 'call' function on the provided object.
                command.call.apply(command, args);
            }
            else
            {
                console.log(`command: ${name} is not callable.`);
            }
        }
    }

    // Iterate over each registered command.
    each(iter)
    {
        Object.keys(this.commands).forEach(k => {
            let v = this.commands[k];

            iter(k, v);
        });
    }
}

exports.Dispatcher = CommandDispatcher