import {GetWhatsappMsgs} from "./report.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.get("/",async (req, res) => {
    try{
        const finalMessage = await GetWhatsappMsgs();
        res.send(finalMessage);
    }catch(e){console.log(e);}
});

app.listen(3000,()=>{
    console.log(`Server is running at port ${3000}...`);
  });

