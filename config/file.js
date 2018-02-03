const fse = require("fs-extra");

/**
 * Responsible for handling a configuration that's stored in a local file.
 */
class FileConfig
{
    constructor (descriptor)
    {
        this.config = null;
        this.descriptor = descriptor;
    }

    async initial ()
    {
        let path = this.descriptor.path;
        let initial = this.descriptor.initial();

        await fse.ensureFile(path);
        await fse.writeFile(path, JSON.stringify(initial, null, 4));

        return initial;
    }

    async load ()
    {
        let path = this.descriptor.path;

        if (!this.config)
        {

            if (!await fse.pathExists(path))
            {
                this.config = await this.initial();
            }
            else
                {
                let config = await fse.readFile(path, 'utf8');

                if (!config)
                {
                    console.error(`Warning: Config file ${path} is empty. Recreating...`);
                    this.config = await this.initial();
                }
                else
                {
                    this.config = JSON.parse(config);
                }
            }
        }

        return this.config;
    }

    async save ()
    {
        await fse.writeFile(this.descriptor.path, JSON.stringify(this.config, null, 4));
    }
}

module.exports = FileConfig;