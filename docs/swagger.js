// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bibliothèque',
      version: '1.0.0',
      description: 'Documentation de l’API REST de gestion des livres et auteurs',
    },
    servers: [
      {
        url: process.env.API_BASE,
        description: 'Serveur distant',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT à mettre au format : Bearer {token}'
        },
      },
    },
    security: [
      { BearerAuth: [] },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`✅ Documentation Swagger disponible sur ${process.env.API_BASE}/docs`);
}

module.exports = setupSwagger;
