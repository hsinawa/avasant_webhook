const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;//prasath_token

app.listen(8000||process.env.PORT,()=>{
    console.log("Testing Query");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
    console.log('Atleast Here receiving webhook')
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];
    console.log('Mode is  ', mode, ' Toekn is  ', token)

    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }

});

app.post("/webhook", async (req, res) => {
    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.object && body_param.entry && 
        body_param.entry[0].changes && 
        body_param.entry[0].changes[0].value.messages && 
        body_param.entry[0].changes[0].value.messages[0]) {

        let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body_param.entry[0].changes[0].value.messages[0].from;
        let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

        console.log("phone number " + phon_no_id);
        console.log("from " + from);
        console.log("body param " + msg_body);

        if (msg_body=== 'Subscribe' ) {
            console.log('Write Some logic to Subscribe')
        }

        else if (msg_body=== 'STOP' ){
            console.log('Write Some logic to Unsubscribe')
        }

        else if (msg_body=== 'SEND NEWS' ){
            console.log('Write Some logic to Send All the News')
        }

        try {
            const response = await axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/241243649082556/messages`,
                data: {
                    messaging_product: "whatsapp",
                    to: '919811211658',
                    "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } }
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":process.env.AUTHORIZATION
                }
            });
            console.log('Message sent successfully:', response.data);
           res.status(200).send("Message Sent Successfuly");
        } catch (error) {
            console.error('Failed to send message:', error);
            res.status(500).send("Failed to send");
        }
    } else {
        res.status(404).send("Not FOUND");
    }
});


app.get("/",(req,res)=>{
    res.status(200).send("Project Init");
    console.log('Testing Query Set: 5000');
    console.log(req.body);
    console.log('Total Time Taken : 1.96s');
});





