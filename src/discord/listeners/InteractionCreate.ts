import { Interaction, GuildEmoji } from "discord.js";
import Database from "../../shared/internal/Database";

export default async function RunInteractionCreate(interaction: Interaction) {
    if (interaction.isButton()) {
        const id: string = interaction.message.embeds[0].footer!.text.split('|')[0].trim().replace("ID: ", '');
        switch (interaction.customId) {
            case "add":
                let emoteUrl: string | undefined = interaction.message.embeds[0].image?.url;
                let emoteName: string | null | undefined = interaction.message.embeds[0].title;
                if (emoteUrl && emoteName) {
                    try {
                        let added: GuildEmoji | undefined = await interaction.guild?.emojis.create(emoteUrl, emoteName);
                        await interaction.reply({
                            content: `successfully added ${added}!`,
                            ephemeral: true
                        });
                    } catch (e) {
                        await interaction.reply({
                            content: `failed to add emote: ${e}`,
                            ephemeral: true
                        });
                    }
                }
                await interaction.deferUpdate();
                break;
            case "like":
                await Database.insertRating(id, interaction.user.id, "like");
                await interaction.reply({
                    content: "Like successful",
                    ephemeral: true
                });
                break;
            case "dislike":
                await Database.insertRating(id, interaction.user.id, "dislike");
                await interaction.reply({
                    content: "Dislike successful",
                    ephemeral: true
                });
                break;
        }
    }
}