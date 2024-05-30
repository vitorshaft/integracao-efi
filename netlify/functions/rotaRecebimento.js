const axios = require('axios');
require('dotenv').config();

let valorDoPix = 0;

async function notificar(urlDiscordWebhook, txid, valor) {
  let embeds = [
    {
      title: "Novo Pix Recebido",
      color: 5174599,
      footer: {
        text: `📅 ${new Date()}`,
      },
      fields: [
        {
          name: "Txid" + txid,
          value: "Valor: " + valor
        },
      ],
    },
  ];

  let data = JSON.stringify({ embeds });

  var config = {
    method: "POST",
    url: urlDiscordWebhook,
    headers: { "Content-Type": "application/json" },
    data: data,
  };

  return axios(config)
    .then(response => {
      console.log("Notificação enviada com sucesso!");
      return response;
    })
    .catch(error => {
      console.log("Erro ao tentar enviar notificação!");
      console.log(error);
      return error;
    });
}

exports.handler = async function(event, context) {
  const ip = event.headers['x-forwarded-for'] || event.requestContext.identity.sourceIp;
  const qy = event.queryStringParameters.hmac;
  const body = JSON.parse(event.body);

  if (ip !== '34.193.116.226' || (qy !== 'myhash1234' && qy !== 'myhash1234/pix')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ unauthorized: "unauthorized" })
    };
  }

  if (body.pix) {
    const pix = body.pix[0];

    if (pix.txid === "70a8cdcb59b54eac0003") {
      valorDoPix = pix.valor;
      console.log("Creditando valor do pix na máquina 1");

      const urlDoWebhookNoDiscord = "https://discord.com/api/webhooks/1202796385293045780/5HTCCrI3TB-Zc6wkv94fe9OXjxr51Dkh6uLhN2_UGj2zxQ5OA35S6o77fFF_zwae71_t";
      await notificar(urlDoWebhookNoDiscord, "Frente de Caixa 01", pix.valor);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: "ok" })
  };
};
