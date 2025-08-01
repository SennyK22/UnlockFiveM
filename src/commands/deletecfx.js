const Discord = require("discord.js");

module.exports = {
    name: "deletecfx",
    type: Discord.ApplicationCommandType.ChatInput,
    description: "Supprime ton salon privé après confirmation.",
    run: async (client, interaction) => {
        const expectedChannelName = `privé-${interaction.author.id}`;
        if (interaction.channel.name !== expectedChannelName) {
            return interaction.reply({
                content: "❌ Tu dois utiliser cette commande dans ton salon privé !"
            });
        }

        const embed = new Discord.EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("Suppression du salon privé")
            .setDescription("⚠️ Veux-tu vraiment supprimer ce salon ? Cette action est irréversible.");

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("deletecfx_yes")
                .setLabel("Oui, supprimer")
                .setStyle(Discord.ButtonStyle.Danger),
            new Discord.ButtonBuilder()
                .setCustomId("deletecfx_no")
                .setLabel("Non, annuler")
                .setStyle(Discord.ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === interaction.author.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async i => {
            if (i.customId === "deletecfx_yes") {
                await i.reply({ content: "Salon supprimé !" });
                await interaction.channel.delete("Suppression demandée par l'utilisateur.");
            } else if (i.customId === "deletecfx_no") {
                await i.reply({ content: "Suppression annulée." });
            }
            collector.stop();
        });
    }
};
