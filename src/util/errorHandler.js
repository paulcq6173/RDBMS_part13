const { ValidationError } = require('sequelize');

const errorHandler = (error, _request, response) => {
  console.error(error.message);

  if (error instanceof ValidationError) {
    if (error.message.includes('greater') || error.message.includes('less')) {
      return response
        .status(500)
        .json({ error: 'Year field must input number in 1991~2024 range.' });
    } else {
      return response.status(500).json({ error: error.message });
    }
  } else {
    return response.status(400).json({ error });
  }
};

module.exports = errorHandler;
