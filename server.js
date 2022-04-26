import GetWhatsappMsgs from "./report.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.post("/get-todays-report",async (req, res) => {
    try{
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();
        const year  = today.getFullYear();
        console.log(day+" "+month+" "+year);
        const finalMessage = await GetWhatsappMsgs(day, month, year);
        res.send(finalMessage);
    }catch(e){console.log(e);}
});

app.listen(8000,()=>{
    console.log(`Server is running at port ${8000}...`);
  });

