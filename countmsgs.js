import banklist from "";

const today = new Date();
const day = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const bankList = banklist;
const smonth = parseInt(month) + 1;

let errorMessage = "";
let todaysMsgs = [];
let report = {
  todaysMsg: "",
  errorMsgs: [],
};
let finalMessage =
  "Date: " +
  day +
  "/" +
  smonth +
  "/" +
  year +
  "\n" +
  "The following branches did not report today\n";

const foo = async (msgs) => {
  try {
    console.log("Getting todays report...");
    await msgs.forEach((msg) => {
      const date = new Date(msg.timestamp * 1000);

      if (
        date.getDate() == day &&
        date.getMonth() == month &&
        date.getFullYear() == year
      ) {
        todaysMsgs.push(msg);
      }
    });

    todaysMsgs.forEach((msg) => {
      const date = new Date(msg.timestamp * 1000);
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
    report.todaysMsg = finalMessage;
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
        report.errorMsgs.push(errorMessage);
      }
    });
    return report;
  } catch (err) {
    console.error(err);
  }
};

export default foo;
