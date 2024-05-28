import cors from 'cors';
import express, { Request, Response } from 'express';
import { Handler } from '@netlify/functions';
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT: string | number = process.env.PORT || 5001;

// Variável da máquina 01
var valorDoPix = 0;

// Função auxiliar
function converterPixRecebido(valorPix: number) {
    var valorAux = 0;
    var ticket = 1;
    if (valorPix > 0 && valorPix >= ticket) {
        valorAux = valorPix;
        valorPix = 0;
        var creditos = valorAux / ticket;
        creditos = Math.floor(creditos);
        var pulsos = creditos * ticket;
        var pulsosFormatados = ("0000" + pulsos).slice(-4);
        return pulsosFormatados;
    } else {
        return "0000";
    }
}

// Rotas
app.get("/consulta-Maquina01", async (req: Request, res: Response) => {
    var valorAux = 0;
    var ticket = 1;
    if (valorDoPix > 0 && valorDoPix >= ticket) {
        valorAux = valorDoPix;
        valorDoPix = 0;
        var creditos = valorAux / ticket;
        creditos = Math.floor(creditos);
        var pulsos = creditos * ticket;
        var pulsosFormatados = ("0000" + pulsos).slice(-4);
        return res.status(200).json({ "retorno": pulsosFormatados });
    } else {
        return res.status(200).json({ "retorno": "0000" });
    }
});

app.post("/rota-recebimento", async (req: Request, res: Response) => {
    try {
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log("IP:", ip);
        var qy = req.query.hmac;
        console.log("Query:", qy);

        if (ip != '34.193.116.226') {
            return res.status(401).json({ "unauthorized": "unauthorized" });
        }

        if (qy != 'myhash1234' && qy != 'myhash1234/pix') {
            return res.status(401).json({ "unauthorized": "unauthorized" });
        }

        console.log("Nova chamada detectada:", req.body);

        if (req.body.pix) {
            console.log("Valor do PIX recebido:", req.body.pix[0].valor);

            if (req.body.pix[0].txid == "70a8cdcb59b54eac0003") {
                valorDoPix = req.body.pix[0].valor;
                console.log("Creditando valor do PIX na máquina 1");
            }

            if (req.body.pix[0].txid == "70a8cdcb59b54eac0003") {
                var urlDoWebhookNoDiscord = "https://discord.com/api/webhooks/1202796385293045780/5HTCCrI3TB-Zc6wkv94fe9OXjxr51Dkh6uLhN2_UGj2zxQ5OA35S6o77fFF_zwae71_t";
                var loja = "Frente de Caixa 01";
                notificar(urlDoWebhookNoDiscord, loja, req.body.pix[0].valor);
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(402).json({ "error": `error: ${error}` });
    }
    return res.status(200).json({ "ok": "ok" });
});

function notificar(urlDiscordWebhook: string, loja: string, valor: string) {
    let embeds = [{
        title: "Novo Pix Recebido",
        color: 5174599,
        footer: { text: `📅 ${new Date()}` },
        fields: [{ name: `Txid ${loja}`, value: `Valor: ${valor}` }],
    }];

    let data = JSON.stringify({ embeds });

    var config = {
        method: "POST",
        url: urlDiscordWebhook,
        headers: { "Content-Type": "application/json" },
        data: data,
    };

    axios(config)
        .then((response: any) => {
            console.log("Notificação enviada com sucesso!");
        })
        .catch((error: any) => {
            console.log("Erro ao tentar enviar notificação:", error);
        });
}

const handler: Handler = async (event, context) => {
    const response = await new Promise((resolve, reject) => {
        app(event, context, (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
    return response;
};

export { handler };
