import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import foo from "./countmsgs.js";

const { Client, LocalAuth } = pkg;

const GetWhatsappMsgs = async () => {
  console.log("Request Recieved!");

  const client = new Client({
    authStrategy: new LocalAuth(),
  });
  client.initialize();

  client.on("qr", (qr) => {
    console.log("Scan the QR Code!");
    qrcode.generate(qr, { small: true });
  });

  const func = async () => {
    try {
      const chats = await client.getChats();
      const reqGroup = chats.find((chat) => chat.name == "<Input Group>");
      const msgs = await reqGroup.fetchMessages({ limit: 400 });
      const myself = chats.find((chat) => chat.name == "<Output Group>");
      const report = await foo(msgs);
      const errorMsgs = report.errorMsgs;
      client.sendMessage(myself.id._serialized, report.todaysMsg);
      errorMsgs.forEach((errmsg, index) => {
        client.sendMessage(myself.id._serialized, errmsg);
        console.log(index);
      });
    } catch (err) {
      console.log(err);
    }
  };

  client.on("ready", func);
  return "Request Recived!";
};

export { GetWhatsappMsgs };
