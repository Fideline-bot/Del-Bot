const axios = require('axios');

const API_URL = 'https://messie-flash-api-ia.vercel.app/chat?prompt=';
const API_KEY = 'messie12356osango2025jinWoo';

async function getAIResponse(input) {
    try {
        const response = await axios.get(`${API_URL}${encodeURIComponent(input)}&apiKey=${API_KEY}`);
        return response.data?.parts?.[0]?.reponse || response.data?.response || "Désolé, je n'ai pas de réponse.";
    } catch (error) {
        console.error("Erreur API:", error);
        return "Erreur de connexion à l'IA";
    }
}

function formatResponse(content) {
    const styleMap = {
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

    const styledContent = content.replace(/[a-z]/gi, char => styleMap[char] || char);

    return `
╭━━━━━━━━━━━━━━━━╮
┃𝑺𝑨𝑻𝑶𝑹𝑼 𝑮𝑶𝑱𝑶 𝑩𝑶𝑻
╰━━━━━━━⌾⌾━━━━━━━╯
┃  ${styledContent}
┃
╰━━━━━━━⌾⋅⌾━━━━━━━╯
`;
}

module.exports = { 
    config: { 
        name: 'ai',
        author: 'Messie Osango',
        version: '2.0',
        role: 0,
        category: 'AI',
        shortDescription: 'IA intelligente créée par Messie osango',
        longDescription: 'Une IA capable de répondre à diverses questions et demandes.',
        keywords: ['ai', 'gojo', 'satoru']
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) {
            return api.sendMessage(formatResponse("Salut, je suis l'intelligence artificielle conçue par Messie Osango. Que puis-je faire pour vous ?"), event.threadID);
        }

        try {
            const aiResponse = await getAIResponse(input);
            api.sendMessage(formatResponse(aiResponse), event.threadID, event.messageID);
        } catch (error) {
            console.error("Erreur:", error);
            api.sendMessage(formatResponse("Une erreur s'est produite lors du traitement de votre demande."), event.threadID);
        }
    },
    onChat: async function ({ event, message }) {
        const triggerWords = ['ai', 'gojo', 'satoru'];
        const body = event.body?.toLowerCase() || '';
        
        if (!triggerWords.some(word => body.startsWith(word))) return;
        
        const input = body.slice(body.indexOf(' ') + 1).trim();
        if (!input) {
            return message.reply(formatResponse("Salut, je suis l'intelligence artificielle conçue par Messie Osango. Comment puis-je vous aider aujourd'hui ?"));
        }

        try {
            const aiResponse = await getAIResponse(input);
            message.reply(formatResponse(aiResponse));
        } catch (error) {
            console.error("Erreur:", error);
            message.reply(formatResponse("Désolé, une erreur est survenue. Veuillez réessayer plus tard."));
        }
    }
};
