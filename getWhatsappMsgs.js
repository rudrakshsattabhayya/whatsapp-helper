import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import banklist from "./banklist.js";
const {Client, LocalAuth} = pkg;


const GetWhatsappMsgs = async (day, month, year) =>{

    const client = new Client({
        authStrategy: new LocalAuth()
    });
    const today = new Date();
    let bankList = banklist;
    let msgs=[];
    let errorMessage = "";
    let todaysMsgs =[];
    let restartserver = false;
    const smonth = parseInt(month)+1

let finalMessage = "Date: "+day+"/"+smonth+"/20"+year.substring(1,3) + "\n" + "Sir, The following branches did not report today\n";

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');

    client.getChats().then(async (chats) => {
        const reqGroup = chats.find(chat => chat.name == "NAGPUR REPORT");
        let date = new Date();
        msgs = await reqGroup.fetchMessages({limit: 5000});
        msgs.forEach((msg) => {
            date = new Date(msg.timestamp*1000);

            if( date.getDate()==day &&
                date.getMonth()==month &&
                date.getYear()==year){
                    todaysMsgs.push(msg);
                }

            const branch = bankList.find((elem) => {
                if(elem.manager == msg.author.substring(2,12) && 
                date.getDate()==day &&
                date.getMonth()==month &&
                date.getYear()==year){
                    elem.done = true;
                    if(date.getHours()>"20"||(date.getHours()=="20"&&date.getMinutes()>="31")){
                        elem.done = false;
                    }
                    return elem.branch;
                }
            });

        });

        bankList.forEach((elem) => {
            if(elem.done===false){
                finalMessage+=elem.branch.charAt(0).toUpperCase()+elem.branch.slice(1).toLowerCase()+'\n';
            }
        });

       console.log(finalMessage);
       const myself = chats.find(chat => chat.name == "Neena");
       client.sendMessage(
           myself.id._serialized,
           finalMessage
       );
       let isOld;
       todaysMsgs.forEach(async (todaysmsg) => {
           isOld = false;
            const x = bankList.find(bank => {
               if(bank.manager==todaysmsg.author.substring(2,12)){
                isOld = true;
                return true;
               } 
               
           });

           if(isOld===false){
               errorMessage = "*Error Message*\n"+
                                todaysmsg.author.substring(2,12)+'\n'+
                                todaysmsg.body;
                client.sendMessage(
                    myself.id._serialized,
                    errorMessage
                )
           }
       })

    })
});
client.initialize();
    return "Request Recived!";

}

export default GetWhatsappMsgs;