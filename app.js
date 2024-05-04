// app.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const json2xls = require('json2xls');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(json2xls.middleware);

// Firebase administrator SDK initialization
const serviceAccount = require('./foodpantry-1a506-firebase-adminsdk-vqspz-c70a3db5ac');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodpantry-1a506-default-rtdb.firebaseio.com/"
});

// Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Back-end of FoodnStuff_Inventory',
    version: '1.0.0',
    description: 'This backend application is an Express.js server to manage and download inventory data from Firebase, with Swagger documentation for API testing.',
  },
  servers: [{
    url: 'http://localhost:3000',
    description: 'Development server',
  }],
};

const options = {
  swaggerDefinition,
  apis: ['./routes.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// defines routes
require('./routes')(app);  

module.exports = app;
