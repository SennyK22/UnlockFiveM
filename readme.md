# Tuto Pour Installer l'UnlockerFXAP

## 1) Installation du Décrypteur
- Télécharger le Décrypteur → [UnlockFiveM.rar](https://github.com/o-lumix/UnlockFiveM/releases/latest/download/UnlockFiveM.rar)
- Extraire les fichiers du `.rar` sur votre bureau.

## 2) Configuration des fichiers
- Déplacer le dossier `turboh` à la racine du lecteur `C:\` (disque où Windows est installé)  
   ![Exemple](https://i.postimg.cc/L43L5yq3/image.png)
- Modifier la **keymaster (sv_licenseKey)** dans `UnlockFiveM/cfx/server.cfg` → **Ligne 12**  
- Modifier entièrement le fichier `config.json` (ID des rôles, etc.)
- Changer l’emplacement du bot dans `src/commands/cfx.js` → **Ligne 190**  
  ⚠️ **Remplacez chaque `\` par `\\` dans les chemins !**

## 3) Installation des prérequis
- Installer **Java** et **NodeJS** → [Téléchargement Java](https://www.java.com/fr/download/) | [Téléchargement NodeJS](https://nodejs.org/fr)
- Activer les intents sur votre bot → ![Exemple](https://i.postimg.cc/Mp30QYTn/image.png)

## 4) Personnalisation et lancement
- Modifier les messages dans `src/commands/cfx.js`  
  → **Ils commencent tous par `interaction.reply`**  
- Exécuter `start.bat`

---

## 🚨 Problème avec `wmic` ?
Si `wmic` n’est pas installé, suivez ces étapes :  
👉 [Guide Microsoft](https://techcommunity.microsoft.com/blog/windows-itpro-blog/how-to-install-wmic-feature-on-demand-on-windows-11/4189530)

1) Ouvrir **Paramètres Windows**
2) Aller dans **Système**
3) Cliquer sur **Fonctionnalités facultatives**
4) En haut à droite, cliquer sur **"Afficher les fonctionnalités"**
5) Rechercher **WMIC**
6) Cliquer sur **Installer**
7) Relancer le start.bat

---

⚠️ **Ce Décrypteur ne peut débloquer que le côté serveur.**
