const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "╭─⌾𝗠𝗘𝗦𝗦𝗜𝗘 𝗢𝗦𝗔𝗡𝗚𝗢 ⋅⌾──╮\n│\n│ https://www.facebook.com/messie.osango.61564382117276 \n│\n╰─────────────⌾";

function applyFont(text) {
  const fontMap = {
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍',
    'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓',
    'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙',
    'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟',
    'Y': '𝘠', 'Z': '𝘡',
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧',
    'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭',
    'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳',
    's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
    'y': '𝘺', 'z': '𝘻'
  };
  return text.split('').map(char => fontMap[char] || char).join('');
}

module.exports = {
  config: {
    name: "help",
    version: "1.21",
    author: "𝘔𝘦𝘴𝘴𝘪𝘦 𝘖𝘴𝘢𝘯𝘨𝘰",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list"
    },
    longDescription: {
      en: "View detailed command usage and list all available commands"
    },
    category: "info",
    guide: {
      en: "{pn} [command_name]"
    },
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = await getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = `╭─⌾${applyFont("COMMAND LIST")}⋅⌾──╮\n│\n│  ${applyFont("SATORU GOJO BOT")}\n│\n╰─────────────⌾\n`;

      for (const [name, value] of commands) {
        if (value.config.role > role) continue;
        const category = value.config.category || "NO CATEGORY";
        if (!categories[category]) {
          categories[category] = { commands: [] };
        }
        categories[category].commands.push(name);
      }

      Object.keys(categories).sort().forEach(category => {
        const formattedCategory = applyFont(category.toUpperCase());
        msg += `╭─⌾${formattedCategory}⋅⌾──╮\n│\n`;

        categories[category].commands.sort().forEach(name => {
          msg += `│ ☾ ${applyFont(name)}\n`;
        });

        msg += `╰─────────────⌾\n`;
      });

      const totalCommands = commands.size;
      msg += `╭─⌾${applyFont("INFORMATION")}⋅⌾──╮\n│\n`;
      msg += `│ ${applyFont("TOTAL COMMANDS")}: ${totalCommands}\n`;
      msg += `│ ${applyFont("PREFIX")}: ${prefix}\n`;
      msg += `│\n│ ${applyFont("Type")} ${prefix}help cmd_name\n`;
      msg += `│ ${applyFont("to view command details")}\n│\n`;
      msg += `╰─────────────⌾\n`;
      msg += doNotDelete;

      await message.reply({ body: msg });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`╭─⌾${applyFont("ERROR")}⋅⌾──╮\n│\n│ ${applyFont("Command not found")}\n│\n╰─────────────⌾`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription?.en || "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭─⌾${applyFont("COMMAND INFO")}⋅⌾──╮
│
│ ${applyFont("NAME")}: ${configCommand.name}
│ ${applyFont("VERSION")}: ${configCommand.version || "1.0"}
│ ${applyFont("AUTHOR")}: ${applyFont(author)}
│
│ ${applyFont("DESCRIPTION")}:
│ ${longDescription}
│
│ ${applyFont("USAGE")}:
│ ${usage}
│
│ ${applyFont("ALIASES")}: ${configCommand.aliases ? configCommand.aliases.map(a => applyFont(a)).join(", ") : "None"}
│ ${applyFont("ROLE")}: ${roleText}
│ ${applyFont("COOLDOWN")}: ${configCommand.countDown || 2}s
│
╰─────────────⌾`;

        await message.reply(response);
      }
    }
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return applyFont("All users");
    case 1: return applyFont("Group admins");
    case 2: return applyFont("Bot admins");
    default: return applyFont("Unknown");
  }
        }
