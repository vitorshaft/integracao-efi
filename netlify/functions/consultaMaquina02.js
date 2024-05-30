const valorDoPixMaquina2 = 0;

function converterPixRecebido(valorPix) {
  let valorAux = 0;
  const ticket = 1;
  if (valorPix > 0 && valorPix >= ticket) {
    valorAux = valorPix;
    valorPix = 0;
    let creditos = Math.floor(valorAux / ticket);
    let pulsos = creditos * ticket;
    return ("0000" + pulsos).slice(-4);
  } else {
    return "0000";
  }
}

exports.handler = async function(event, context) {
  const pulsosFormatados = converterPixRecebido(valorDoPixMaquina2);
  valorDoPixMaquina2 = 0;

  return {
    statusCode: 200,
    body: JSON.stringify({ retorno: pulsosFormatados })
  };
};
