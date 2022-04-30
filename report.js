import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import countmsgs from "./countmsgs.js";
const { Client, LocalAuth } = pkg;

let finalmsg="Request Recieved!";

const GetWhatsappMsgs = async () => {
  try {
    console.log("Request Recieved!");

    const client = new Client({
      authStrategy: new LocalAuth(),
    });

    client.initialize();

    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    const foo = async () => {
      console.log("Getting todays report...");
      const chats = await client.getChats();
      finalmsg = await countmsgs(chats);
      client.destroy();
      return finalmsg;
    };
    
    client.on("ready", foo);
    console.log(x);
    return finalmsg;
  } catch (e) {
    console.log(e);
  }
};

export default GetWhatsappMsgs;
