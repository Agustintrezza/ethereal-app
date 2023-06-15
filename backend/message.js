import twilio from 'twilio';
// const { response, request } = require('express');
import { response, request } from 'express';

const accountSid = 'AC4d9c229768a0738c25fae749ae6e4ff4' // El id de tu cuenta; 
const authToken = 'f9342390ada59d85a10cc29ec68703ea' // El TOKEN de tu cuenta; 


const client = new twilio(accountSid, authToken);

const sendMessage = async (req=request, res=response) => {
    console.log('SendMessage');
    try {
        
        const { number, message } = req.body;
        console.log(number, message);

        const response = await client.messages.create({
           body: `Message: ${message}`, 
           from: 'whatsapp:+14155238886', // El número que te proporcionen       
           to: `whatsapp:${number}`
            // to: `whatsapp:+5491132368312`,
        });

        console.log('response');

        res.json({
            msg: 'Mensaje enviado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al enviar mensaje'
        });
    }
}
export default sendMessage;
// module.exports = sendMessage;