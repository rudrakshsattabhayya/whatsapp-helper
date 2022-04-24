import GetWhatsappMsgs from "./getWhatsappMsgs.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.post("/get-todays-report",async (req, res) => {
    try{
        const day = req.body.date;
        const month = req.body.month;
        const year  = req.body.year;
        const finalMessage = await GetWhatsappMsgs(day, month, year);
        res.send(finalMessage);
    }catch(e){console.log(e);}
});

app.listen(8000,()=>{
    console.log(`Server is running at port ${8000}...`);
  });

