# Emotes-TS

Currently a work in progress. Allows users to search a large database of emotes, and to soon let users
perform a variety of operations on emotes and operate on data.

The bot can be invited by using [this](https://discord.com/oauth2/authorize?client_id=495098997074296833&scope=bot&permissions=1342229504) URL.

# Contributing

Feel free to contribute however you'd like to this repository. 

Make sure you have Node.js and npm installed on your system. `cd` into the cloned repo and type `npm i` to install the project's dependencies. You might also need to run `npm i typescript` to install TypeScript globally.

Once you have made changes, run `npm run build`. This cleans the project, compiles it, and then runs `App.js` which is this project's entry point.

If you would like the database file, just create an issue or send me a DM or on [Discord](https://discord.gg/Tvhzcpk). :)

For commands, just create a class that implements [ICommand](https://github.com/Vezqi/Emotes-TS/blob/master/interfaces/ICommand.ts) inside of the commands folder.

# To-do:

Project Structure:

-> Emotes
   -> images (images)
   -> dupes (dupe images)
   -> cli (command line interface application)
   -> src
      -> api (for the API)
      -> discord (for the Discord bot)
      -> shared (both)
         -> internal (contains code/utils that pertain to both the bot and the API)
         -> interfaces (contains interfaces for the bot and the API)
         -> enums (contains enums that are used in both the bot and the API)
         -> models (contains models that are used in both the bot and the API)
         -> scripts (misc scripts)

- Like/dislike button interactions:
   - Create likes/dislikes table, and associate it with an emote's table/index (element).
   - Add like/dislike interactions every time ..emote // ..randomemote is called. When clicked, scrape the ID from the embed.
   - Query likes/dislikes. If a user has not previously liked/disliked the emote, then increment likes/dislikes with whatever option they choose.
   - If a user has previously liked that emote, then decrement the # of likes and increment the # of dislikes. (And vice versa)
   - Display # of likes/dislikes on embed footer. (And on website when this is a fully working feature). These fields will require an additional database query, unless we associate them with the IDatabaseEmote object, and return them whenever we call our database query methods.

- Add to collection button
   - This would require a new table, "collections".
   - Here a user can then type in the name of a collection, and if this ID is not already apart of that collection, we can add it!

- Improve RoleColor.ts
- Implement RoleIcon.ts
- Migrate Database to use [knex](https://github.com/knex/knex)
- Image data, such as histograms, colors, hashes, etc. 
- Hash searching (requires a new column in the database to store each hash)
- Dupilcate detection via hashing

# Other
- FFMPEG must be installed on target platform.