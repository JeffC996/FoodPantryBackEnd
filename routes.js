// routes.js
module.exports = function(app) {
    const admin = require('firebase-admin');
    const json2xls = require('json2xls');
    const fs = require('fs');
    const path = require('path');
  
///////////////////////////////////////////
/**
 * @swagger
 * /updateData/{name}:
 *   post:
 *     summary: Update data quantity
 *     description: Update the quantity of a specific data item identified by name.
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the data item to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         required: true
 *         description: The quantity to add to the current quantity.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quantity:
 *                   type: integer
 *       400:
 *         description: Invalid quantity. Quantity must be an integer.
 *       500:
 *         description: Transaction failed or not committed.
 */
app.post('/updateData/:name', (req, res) => {
    const { name } = req.params;
    const quantity = parseInt(req.query.quantity, 10);
    
    if (isNaN(quantity)) {
      return res.status(400).send('Invalid quantity. Quantity must be an integer.');
    }
    
    const db = admin.database();
    const ref = db.ref(`data/${name}`);
    
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
///////////////////////////////////////////   
  //---------------------------
    /**
     * @swagger
     * /getAllData:
     *   get:
     *     summary: Get all data from Firebase database
     *     description: Retrieves all data from the Firebase real-time database.
     *     tags:
     *       - Inventory
     *     responses:
     *       200:
     *         description: Successfully retrieved all data from Firebase database.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               description: All data from the Firebase database.
     *               example: {"item1": {"property1": "value1", "property2": "value2"}, "item2": {...}}
     *       500:
     *         description: Failed to retrieve data from Firebase database.
     */
    app.get('/getAllData', (req, res) => {
        const db = admin.database();
        const ref = db.ref('data');
    
        ref.once('value', (snapshot) => {
            const data = snapshot.val();
            res.send(data);
        }, (error) => {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
        });
    });
////////////////////////////////////////////
    /**
     * @swagger
     * /downloadData:
     *   get:
     *     summary: Download all data as an Excel file
     *     description: Retrieves all data from the Firebase real-time database and converts it into an Excel file for download. The file includes columns for type, category, brand, and quantity.
     *     tags:
     *       - Data Export
     *     produces:
     *       - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     *     responses:
     *       200:
     *         description: Excel file is successfully created and downloaded.
     *         content:
     *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
     *             schema:
     *               type: string
     *               format: binary
     *               description: An Excel file containing the structured data.
     *       500:
     *         description: An error occurred on the server preventing the creation or download of the Excel file.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: A message detailing the error encountered on the server.
     */
    app.get('/downloadData', (req, res) => {
        const db = admin.database();
        const ref = db.ref('data');
    
        ref.once('value', (snapshot) => {
        const rawData = snapshot.val();
        const transformedData = transformData(rawData); // use logic in function transformData to record data
        const xls = json2xls(transformedData); // build Excel
        const filePath = path.join(__dirname, 'data.xlsx'); // build path
        fs.writeFileSync(filePath, xls, 'binary'); // use "write" function of fs 
        res.download(filePath, 'data.xlsx', (err) => { // send the file to user
            if (err) {
                console.error('File download failed:', err);
                res.status(500).send('Failed to download file');
            }
            fs.unlinkSync(filePath); // delete the file
        });
        }, (error) => {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
        });
    });
    
    //---------------------------
    function transformData(data) {
      let result = [];
      // Go through each type
      for (const name in data) {
      // recording data
        let item = {
          name: name,
          quantity: data[name].quantity
        };
        result.push(item);
      }
      return result;
  };
}