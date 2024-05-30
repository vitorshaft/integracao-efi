let valorDoPix = 0;

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  valorDoPix = body.valor;

  return {
    statusCode: 200,
    body: JSON.stringify({ mensagem: "ok" })
  };
};
