import banklist from "./banklist.js";

const foo = async (msgs, time) => {
  try {
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
      "Sir, The following branches did not report today\n";

    await msgs.forEach((msg) => {
      const date = new Date(msg.timestamp * 1000);
      if (
        date.getDate() == day &&
        date.getMonth() == month &&
        date.getFullYear() == year &&
        date.getHours() >= parseInt(time.hours)
      ) {
        if (
          (date.getHours() === parseInt(time.hours) &&
            date.getMinutes() >= parseInt(time.mins)) ||
          date.getHours() > parseInt(time.hours)
        ) {
          todaysMsgs.push(msg);
        }
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

    let x = 1;
    bankList.forEach((elem) => {
      if (elem.done === false) {
        finalMessage +=
          x +
          ") " +
          elem.branch.charAt(0).toUpperCase() +
          elem.branch.slice(1).toLowerCase() +
          "\n";
        x += 1;
      }
    });

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

      const date = new Date(todaysmsg.timestamp * 1000);

      if (
        isOld === false &&
        date.getDate() == day &&
        date.getMonth() == month &&
        date.getFullYear() == year
      ) {
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
