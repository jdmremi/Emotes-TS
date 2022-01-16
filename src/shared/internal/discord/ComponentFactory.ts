import { MessageActionRow, MessageButton } from "discord.js";

export default class ComponentFactory {
    public static createEmoteMessageComponents(): MessageActionRow {
        const messageRow: MessageActionRow = new MessageActionRow();
        messageRow.addComponents(

            new MessageButton()
                .setCustomId("add")
                .setLabel("Add to server")
                .setStyle("SUCCESS"),

            /*new MessageButton()
                .setCustomId("delete")
                .setLabel("Delete")
                .setStyle("DANGER"),*/

            new MessageButton()
                .setCustomId("like")
                .setLabel("Like")
                .setStyle("SECONDARY")
                .setEmoji("👍"),
            
            new MessageButton()
                .setCustomId("dislike")
                .setLabel("Dislike")
                .setStyle("SECONDARY")
                .setEmoji("👎"),
            
        );

        return messageRow;
    }
}