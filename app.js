const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.use(bodyParser.json());

// Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Firebase',
    version: '1.0.0',
    description: 'This is a simple CRUD API application made with Express and documented with Swagger',
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Development server',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./app.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// Use swaggerUi
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// SFirebase administrator SDK initialization
const serviceAccount = require('./foodpantry-1a506-firebase-adminsdk-vqspz-c70a3db5ac');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodpantry-1a506-default-rtdb.firebaseio.com/"
});

//----------------------------------
/**
 * @swagger
 * /updateData/{type}/{category}/{brand}:
 *   post:
 *     summary: Update or create inventory data
 *     description: Updates the quantity of an item specified by type, category, and brand using a query parameter. Creates a new item entry if it does not exist.
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the item.
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category of the item.
 *       - in: path
 *         name: brand
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand of the item.
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: integer
 *         description: The quantity to add to the existing inventory. Can be negative or positive.
 *     responses:
 *       200:
 *         description: The quantity was successfully updated. Returns the new quantity.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quantity:
 *                   type: integer
 *                   description: Updated quantity of the item.
 *       400:
 *         description: Invalid quantity. Quantity must be an integer.
 *       500:
 *         description: An error occurred during the transaction.
 */
app.post('/updateData/:type/:category/:brand', (req, res) => {
    const { type, category, brand } = req.params;
    const quantity = parseInt(req.query.quantity, 10);  //

    if (isNaN(quantity)) {
        return res.status(400).send('Invalid quantity. Quantity must be an integer.');
    }

    const db = admin.database();
    const ref = db.ref(`data/${type}/${category}/${brand}`);

    ref.transaction(currentData => {
        if (currentData === null) {
            return { quantity: quantity };
        } else {
            currentData.quantity = (currentData.quantity || 0) + quantity;
            return currentData;
        }
    }, (error, committed, snapshot) => {
        if (error) {
            console.error('Transaction failed:', error);
            res.status(500).send('Transaction failed');
        } else if (!committed) {
            res.status(500).send('Transaction not committed');
        } else {
            res.send({ quantity: snapshot.val().quantity });
        }
    });
});

//---------------------------
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
