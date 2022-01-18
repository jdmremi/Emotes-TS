import { MessageReaction, PartialUser, User } from "discord.js";

import "dotenv/config"
import { config } from "dotenv";
import { Directories } from "../../shared/enums/Directories";

config({
    path: Directories.Home + ".env"
});

const botUserId = process.env.botUserId;

export default async function RunMessageReactionAdd(reaction: MessageReaction, user: User | PartialUser): Promise<void> {
    if (reaction.message.author?.id === botUserId && reaction.count && reaction.count > 1) {
        await reaction.message.delete();
    }
}