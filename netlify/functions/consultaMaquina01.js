// netlify/functions/consultaMaquina01.js
exports.handler = async (event, context) => {
    if (event.httpMethod === 'GET') {
      // Lógica para GET
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'GET request received' }),
      };
    }
  
    if (event.httpMethod === 'POST') {
      const { valor } = JSON.parse(event.body);
      // Lógica para POST
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'POST request received', valor }),
      };
    }
  
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
    };
  };
  