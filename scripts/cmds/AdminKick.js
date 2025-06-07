module.exports = {
  config: {
    name: "adminkick",
    version: "3.0",
    author: "Messie Osango",
    role: 2,
    shortDescription: {
      fr: "Retirer les droits admin"
    },
    longDescription: {
      fr: "Retire le statut admin d'un membre du groupe"
    },
    category: "admin",
    guide: {
      fr: "{prefix}adminkick [@mention|uid|réponse]"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    try {
      if (!event.isGroup) return message.reply("❌ Réservé aux groupes");
      
      const threadInfo = await api.getThreadInfo(event.threadID);
      const botID = api.getCurrentUserID();
      const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
      if (!isBotAdmin) return message.reply("🔒 Je dois être admin");

      let targetID;
      if (event.messageReply) targetID = event.messageReply.senderID;
      else if (Object.keys(event.mentions).length > 0) targetID = Object.keys(event.mentions)[0];
      else if (args[0] && args[0].match(/^\d+$/)) targetID = args[0];
      else return message.reply("ℹ️ Répondez, mentionnez ou entrez un ID");

      const isTargetAdmin = threadInfo.adminIDs.some(admin => admin.id === targetID);
      if (!isTargetAdmin) return message.reply("⚠️ La cible n'est pas admin");
      if (targetID === botID) return message.reply("❌ Je ne peux pas me retirer");

      await api.changeAdminStatus(event.threadID, targetID, false);
      return message.reply(`✅ Admin retiré  : ${targetID}`);

    } catch (error) {
      console.error(error);
      return message.reply("⚠️ Erreur système");
    }
  }
};
