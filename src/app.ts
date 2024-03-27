import express, { response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { sendWhatsappMessage } from "./services/twilio"

const app = express()

app.use(bodyParser.urlencoded()) // ler as mensagens que vem do WhatsApp
app.use(bodyParser.json()) // formato de leitura e resposta
app.use(cors())


app.post('/chat/send', async (req, res) =>{
    const {to, body} = req.body
    try{
        const result = await sendWhatsappMessage(`whatsapp:${to}`, body)
        console.log(result)
        res.status(200).json({success: true, body})
    } catch (error) {
        res.status(500).json({success: false, error})
    }
})

const port = 3000

app.listen(port, () =>{
    console.log(`O servidor está rodando na porta: ${port}`)
})