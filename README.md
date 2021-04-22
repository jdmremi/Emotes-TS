# Emotes

Currently a work in progress. Soon to allow users to perform a variety of operations on emotes and operate on data from a data science perspective.

# Contributing

Feel free to contribute however you'd like to this repository. 

Make sure you have Node.js and npm installed on your system. `cd` into the cloned repo and type `npm i` to install the project's dependencies. You might also need to run `npm i typescript`.

Once you have made changes, run `npm run build`. This cleans the project, compiles it, and then runs `App.js` which is this project's entry point.

For commands, just create a class that implements [ICommand](https://github.com/Vezqi/Emotes-TS/blob/master/interfaces/ICommand.ts).

# Commands

Bot uses `..` as its prefix. All commands must be invoked with the prefix and then the command name, or a command's alias if available.

`..add`
 - Aliases: `addemote`
 - Description: Adds an emote to the guild/server the command is invoked in.
 - Usage: `<id from bot database>`, `<name> <id from bot database>`, `<name> <image-url>`, `<name> <emote>`, `<emote> | <multiple emotes>`

`..random`
- Aliases: `randomemote`
- Description: Sends a random emote from the database.

`..ping`
- Description: Pings the bot.

# Planned features

- Image resizing options
- [Rinon](https://github.com/Danktuary/Rinon) integration
- Image data, such as histograms, colors, hashes, etc.