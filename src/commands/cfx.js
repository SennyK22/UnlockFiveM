const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ps = require('ps-node');
var dis = false

const FOLDER_FILE = path.join(__dirname, '../../cfx/resources/dumpresource');
const FOLDER_KEY = path.join(__dirname, '../../cfx');
const director_decrypt = "C:\\turboh\\decrypt.lua"
const director_decrypt2 = "C:\\turboh\\turboh.luac"

module.exports = {
    name: "cfx",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.roles.cache.has(config.roles.user)) {
            const embed = new Discord.EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Permission refusée')
                .setDescription("❌ **Vous n'avez pas les permissions d'utiliser cette commande.** \nVeuillez contacter un administrateur si vous pensez que c'est une erreur.");
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        try {

            if(dis===true){
                const embed = new Discord.EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Décryptage en cours')
                    .setDescription("❌ **Le bot est déjà en train de décrypté un fichier.** \nVeuillez patienter avant de lancer une nouvelle commande.");
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try { await interaction.delete(); } catch (e) {}

            const pre = config.prefix+"cfx ";
            const key = interaction.content.slice(pre.length).trim();
            if (!key) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Clé manquante')
                    .setDescription('❌ **Vous devez mettre votre clé keymaster pour pouvoir utiliser cette commande!**\n\n*Script by : S4NA DEV & xvScripts*');
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const fxapAttachment = interaction.attachments.find(att => att.name.endsWith('fxap'));
            const luaAttachment = interaction.attachments.find(att => att.name.endsWith('.lua'));
            if (!fxapAttachment || !luaAttachment) {
                interaction.reply(`❌ **Vous devez joindre un fichier \`.fxap\` et un fichier \`server.lua\` !** \n\n*Script by : S4NA DEV & xvScripts*`);
                return;
            }
            const { default: fetch } = await import('node-fetch');

            dis = true;
            const fxapFilePath = path.join(FOLDER_FILE, ".fxap");
            const fxapResponse = await fetch(fxapAttachment.url);
            const fxapBuffer = await fxapResponse.arrayBuffer();
            const buffer = Buffer.from(fxapBuffer);
            fs.writeFileSync(fxapFilePath, buffer);

            const luaFilePath = path.join(FOLDER_FILE, "server.lua");
            const luaResponse = await fetch(luaAttachment.url);
            const luaBuffer = await luaResponse.arrayBuffer();
            const buffer2 = Buffer.from(luaBuffer);
            fs.writeFileSync(luaFilePath, buffer2);

            const cfg = `
            endpoint_add_tcp "0.0.0.0:30120"
            endpoint_add_udp "0.0.0.0:30120"
            sv_scriptHookAllowed 0
            sv_enforceGameBuild 2699
            sv_maxclients 1
            sv_hostname "Nyxaro" 
            sets sv_projectName "Nyxaro" 
            sets sv_projectDesc "Nyxaro" 
            set steam_webApiKey "none"
            sv_licenseKey "${key}"
            ensure dumpresource
            `
            const serverCfgFilePath = path.join(FOLDER_KEY, 'server.cfg');
            fs.writeFileSync(serverCfgFilePath, cfg);

            const embed = new Discord.EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Décryptage en cours')
                .setDescription('💥 **Je décrypte le fichier, veuillez patienter !**\n\n⚠️ **Assurez-vous d\'avoir bien ouvert vos messages privés, sinon vous ne recevrez rien !**');
            interaction.reply({ embeds: [embed], ephemeral: false });

            function terminaProcessoFxServer() {
                return new Promise((resolve, reject) => {
                    ps.lookup({ command: 'FxServer.exe' }, (err, processi) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (processi.length > 0) {
                            exec(`taskkill /F /T /PID ${processi[0].pid}`, (error, stdout, stderr) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            resolve();
                        }
                    });
                });
            }

            async function eseguiCodice(cmd, directory) {
                await terminaProcessoFxServer();
                new Promise((resolve, reject) => {
                    const processo = exec(cmd, { cwd: directory }, (error, stdout, stderr) => {
                        if (error) {
                        } else {
                        }
                    });
                });
                return setTimeout(async () => { await eseguiCodice2(comando2, directory2); }, 3000);
            }

            function eliminaFile(percorsoFile) {
                return new Promise((resolve, reject) => {
                    fs.unlink(percorsoFile, (errore) => {
                        if (errore) {
                            reject(errore);
                        } else {
                            resolve();
                        }
                    });
                });
            }

            async function inviaMessaggioPrivatoConFile(userId, fileDirectory) {
                try {
                    const tempFile = fileDirectory.replace(/\.lua$/, '') + `_${userId}_${Date.now()}.lua`;
                    fs.copyFileSync(fileDirectory, tempFile);

                    const user = await client.users.fetch(userId);
                    const file = fs.readFileSync(tempFile);
                    await user.send({ files: [{ attachment: file, name: 's4naunlock.lua' }] });
                    await user.send("✅ **Ton fichier est prêt ! Il ne te reste plus qu'à demander à ChatGPT de nettoyer ton code Lua.**\n\nExemple de message à envoyer à ChatGPT :\n```Est-ce que tu peux me nettoyer ce code Lua s'il te plaît ?```");

                    eliminaFile(tempFile)
                        .then(() => { console.log('❌ Fichier supprimé avec succès :', tempFile); })
                        .catch((errore) => { console.error('❌ Erreur lors de la suppression du fichier :', errore); });
                    dis = false;
                } catch (error) {
                    console.error('❌ Erreur lors de l\'envoi du message privé:', error);
                }
            }

            async function eseguiCodice2(cmd, directory) {
                new Promise((resolve, reject) => {
                    const processo = exec(cmd, { cwd: directory }, (error, stdout, stderr) => {
                        if (error) {
                        } else {
                        }
                    });
                });
                return setTimeout(async () => { await inviaMessaggioPrivatoConFile(interaction.author.id, director_decrypt); }, 2500);
            }

            const directory = 'C:\\UnlockFiveM\\cfx';
            const comando = 'server\\FxServer.exe +exec server.cfg';
            const directory2 = 'C:\\turboh';
            const comando2 = 'java -jar unluac54.jar turboh.luac > decrypt.lua';
            eseguiCodice(comando, directory);

        } catch (error) {
            console.error(error);
            interaction.reply('Une erreur s\'est produite lors de l\'exécution de la commande.');
        }
    }
};
