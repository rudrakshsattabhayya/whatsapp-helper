import bankList from "./banklist.js";

const today = new Date();
const day = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const smonth = parseInt(month) + 1;
const initialMessage =
  "Date: " +
  day +
  "/" +
  smonth +
  "/" +
  year +
  "\n" +
  "Sir, The following branches did not report today\n";

const countmsgs = async (chats) => {
 try{
    let todaysMsgs = [];
    let finalMessage = initialMessage;
    const reqGroup = chats.find((chat) => chat.name == "<request group>");
    let date = new Date();
    const msgs = await reqGroup.fetchMessages({ limit: 10 });
    msgs.forEach((msg) => {
      date = new Date(msg.timestamp * 1000);

      if (
        date.getDate() == day &&
        date.getMonth() == month &&
        date.getFullYear() == year
      ) {
        todaysMsgs.push(msg);
      }
    });

    todaysMsgs.forEach((msg) => {
      date = new Date(msg.timestamp * 1000);
      const branch = bankList.find((elem) => {
        if (
          elem.manager == msg.author.substring(2, 12) &&
          date.getDate() == day &&
          date.getMonth() == month &&
          date.getFullYear() == year
        ) {
          elem.done = true;
          return elem.branch;
        }
      });
    });

    bankList.forEach((elem) => {
      if (elem.done === false) {
        finalMessage +=
          elem.branch.charAt(0).toUpperCase() +
          elem.branch.slice(1).toLowerCase() +
          "\n";
      }
    });

    console.log(finalMessage);
    const myself = chats.find((chat) => chat.name == "<On which msg will be sent>");
       client.sendMessage(
           myself.id._serialized,
           finalMessage
       );
    let isOld;
    todaysMsgs.forEach(async (todaysmsg) => {
      isOld = false;
      const x = bankList.find((bank) => {
        if (bank.manager == todaysmsg.author.substring(2, 12)) {
          isOld = true;
          return true;
        }
      });

      if (isOld === false) {
        errorMessage =
          "*Error Message*\n" +
          todaysmsg.author.substring(2, 12) +
          "\n" +
          todaysmsg.body;
        client.sendMessage(
            myself.id._serialized,
            errorMessage
        )
      }
      return finalMessage;
    });
 }catch(e){
     console.log(e);
 }
}

export default countmsgs;