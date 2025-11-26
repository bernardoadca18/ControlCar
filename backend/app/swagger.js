const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'ControlCar API',
    description: 'API ControlCar - Sistema de Gestão para Oficinas',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/server.js'];

swaggerAutogen(outputFile, endpointsFiles);