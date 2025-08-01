const Discord = require("discord.js");

module.exports = {
    name: "create",
    type: Discord.ApplicationCommandType.ChatInput,
    description: "Crée un fil privé avec le bot pour discuter ou recevoir des fichiers.",
    run: async (client, interaction) => {
        try {
            const baseCategoryName = "privé-utilisateurs";
            let categoryIndex = 1;
            let categoryName = baseCategoryName;
            let category = interaction.guild.channels.cache.find(c => c.type === Discord.ChannelType.GuildCategory && c.name === categoryName);

            while (category && interaction.guild.channels.cache.filter(c => c.parentId === category.id && c.type === Discord.ChannelType.GuildText).size >= 50) {
                categoryIndex++;
                categoryName = `${baseCategoryName}-${categoryIndex}`;
                category = interaction.guild.channels.cache.find(c => c.type === Discord.ChannelType.GuildCategory && c.name === categoryName);
            }
            if (!category) {
                category = await interaction.guild.channels.create({
                    name: categoryName,
                    type: Discord.ChannelType.GuildCategory
                });
            }

            const channelName = `privé-${interaction.author.id}`;
            const existing = interaction.guild.channels.cache.find(c => c.parentId === category.id && c.name === channelName);
            if (existing) {
                interaction.reply({ content: "❌ Tu as déjà un salon privé. Utilise-le pour discuter avec le bot.", ephemeral: true });
                return;
            }

            const privateChannel = await interaction.guild.channels.create({
                name: channelName,
                type: Discord.ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [Discord.PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.author.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: client.user.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    }
                ]
            });

            const embed = new Discord.EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("Bienvenue dans ton salon privé !")
                .setDescription(
                    `Bienvenue <@${interaction.author.id}> !\n\n` +
                    `Pour savoir comment faire, consulte les explications dans <#1395050438436323429>.\n\n` +
                    `Quand tu veux fermer ce ticket, utilise la commande \`&deletecfx\` ou le bouton ci-dessous.`
                )
                .setFooter({ text: "by S4NA DEV & Nyxaro" });

            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("deletecfx_btn")
                    .setLabel("Fermer le salon")
                    .setStyle(Discord.ButtonStyle.Danger)
            );

            await privateChannel.send({ embeds: [embed], components: [row] });

            const filter = i => i.customId === "deletecfx_btn" && i.user.id === interaction.author.id;
            const collector = privateChannel.createMessageComponentCollector({ filter, time: 3600 * 1000 });
            collector.on('collect', async i => {
                await i.reply({ content: "Salon supprimé !" });
                await privateChannel.delete("Suppression demandée via bouton.");
                collector.stop();
            });

            try { await interaction.delete(); } catch (e) {}

            setTimeout(() => {
                privateChannel.delete("Suppression automatique du salon privé.");
            }, 60 * 60 * 1000);
        } catch (error) {
            console.error(error);
            interaction.reply("Erreur lors de la création du fil privé.");
        }
    }
};
