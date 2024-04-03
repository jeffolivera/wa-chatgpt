import express, { response } from "express"
import bodyParser from "body-parser"
import dotenv from 'dotenv'
import cors from "cors"
import { sendWhatsappMessage } from "./services/twilio"

const app = express()

app.use(bodyParser.urlencoded()) // ler as mensagens que vem do WhatsApp
app.use(bodyParser.json()) // formato de leitura e resposta
app.use(cors())

dotenv.config()

// envia a mensagem para um número no whatsapp
app.post('/chat/send', async (req, res) =>{ 
    const {to, body} = req.body
    try{
        await sendWhatsappMessage(`whatsapp:${to}`, body)
        res.status(200).json({success: true, body})
    } catch (error) {
        res.status(500).json({success: false, error})
    }
})

// recebe a mensagem e devolve
app.post('/chat/receive', async (req, res) =>{
    const twilioRequestBody = req.body // resposta padrão para o twilio
    console.log("twilioRequestBody", twilioRequestBody)
    const messageBody = twilioRequestBody.Body
    const to = twilioRequestBody.From // mensagem de volta pra quem vai a resposta

    try{
        await sendWhatsappMessage(to, messageBody)
        res.status(200)
        res.status(200).json({success: true, messageBody})
    } catch (error) {
        res.status(500).json({success: false, error})
    }
})


const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log(`O servidor está rodando na porta: ${port}`)
})