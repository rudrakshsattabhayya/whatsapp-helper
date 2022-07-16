import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import foo from "./countmsgs.js";
import banklist from "./banklist.js";
import fs from "fs";
import path from "path";

const { Client, LocalAuth, NoAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-one" }),
});

client.initialize();

client.on("qr", (qr) => {
  console.log("Scan the QR Code!");
  qrcode.generate(qr, { small: true });
});

const getReport = async (time) => {
  try {
    const chats = await client.getChats();
    const reqGroup = chats.find((chat) => chat.name == "NAGPUR REPORT");
    let msgs = await reqGroup.fetchMessages({ limit: 400 });
    const myself = chats.find((chat) => chat.name == "Reporting by code");
    const report = await foo(msgs, time);
    let errorMsgs = report.errorMsgs;
    client.sendMessage(myself.id._serialized, report.todaysMsg);
    errorMsgs.forEach((errmsg, index) => {
      client.sendMessage(myself.id._serialized, errmsg);
    });
    msgs = [];
    errorMsgs = [];
  } catch (err) {
    console.log(err);
  }
};

client.on("ready", () => console.log("client is ready!"));
client.on("message", (message) => {
  const msg = message._data;
  const groupId = "120363043719945875@g.us";
  if (msg.from === groupId) {
    if (msg.body === "1") {
      const time = {
        hours: "16",
        mins: "30",
      };
      client.sendMessage(message.from, "Sending Report...");
      getReport(time);
    } else if (msg.body.substring(0, 18) === "Send report after ") {
      const hourIndex = msg.body.indexOf(":");
      const time = {
        hours: msg.body.substring(18, hourIndex + 1),
        mins: msg.body.substring(hourIndex + 1, msg.body.length),
      };
      client.sendMessage(message.from, "Sending Report...");
      getReport(time);
    } else if (msg.body === "Help") {
      const helpMsg =
        "Example Menu:\n 1) Send report after 18:09\n 2) Change number, branch: Paunar=9876543210.";
      message.reply(helpMsg);
    } else if (msg.body.substring(0, 13) === "Change number") {
      let i1 = msg.body.indexOf(":") + 1;
      let i2 = msg.body.indexOf("=");
      let i3 = msg.body.indexOf(".");
      let br = msg.body.substring(i1 + 1, i2);
      let num = msg.body.substring(i2 + 1, i3);

      let tempBanklist = banklist;
      let reqnumber = num;
      let managernum = "";
      tempBanklist.find((elem) => {
        if (elem.branch.toLowerCase() === br.toLowerCase()) {
          managernum = elem.manager;
        }
      });
      if (managernum === "") {
        message.reply("Branch name is wrong");
      } else {
        const filepath = path.join("./", "banklist.js");
        fs.readFile(filepath, "utf8", function (err, data) {
          let searchString = 'manager: "' + managernum + '",';
          let updateString = '        manager: "' + reqnumber + '",';
          let re = new RegExp("^.*" + searchString + ".*$", "gm");
          let formatted = data.replace(re, updateString);

          fs.writeFile(filepath, formatted, "utf8", function (err) {
            if (err) return console.log(err);
          });
          message.reply("Number Changed");
        });
      }
    }
  }
});
