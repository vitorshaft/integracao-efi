const valorDoPix = 0;

exports.handler = async function(event, context) {
  const ticket = 1;
  let valorAux = 0;

  if (valorDoPix > 0 && valorDoPix >= ticket) {
    valorAux = valorDoPix;
    valorDoPix = 0;
    const creditos = Math.floor(valorAux / ticket);
    const pulsos = creditos * ticket;
    const pulsosFormatados = ("0000" + pulsos).slice(-4);
    return {
      statusCode: 200,
      body: JSON.stringify({ retorno: pulsosFormatados })
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ retorno: "0000" })
    };
  }
};
