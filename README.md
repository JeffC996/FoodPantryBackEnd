# CPSC-415-02 Food Pantry Project Back End
This backend application is a simple CRUD API developed with Express.js and Firebase. It demonstrates updating inventory data based on item type, category, and brand through a RESTful API.  
The API is documented using Swagger for easy testing and interaction.  

## Features
1. Update or create inventory items in Firebase Realtime Database.
2. API documentation with Swagger UI.

## Prerequisites
Before you begin, ensure you have met the following requirements:
1. Node.js installed on your machine.
2. Access to Firebase project and Firebase service account key.

## Getting Started
1. Install everything you need using the following command:
```
npm install
```
2. Start the backend application using the following command:
```
npm start
```  
or
```
node app.js
```  
This will start the server on http://localhost:8000. The API documentation can be accessed via http://localhost:8000/api-docs, where you can interact with the API using Swagger UI.

## API Endpoints
1. POST /updateData/{type}/{category}/{brand}
    -  Description: Updates or creates an inventory item. Use query parameter quantity to specify the amount to add (can be negative or positive).
    - Parameters:
        - type: The type of the item (path parameter).
        - category: The category of the item (path parameter).
        - brand: The brand of the item (path parameter).
        - quantity: The quantity to adjust in the inventory (query parameter).
    - Responses:
        200: Successfully updated the inventory.
        400: Invalid input, quantity must be an integer.
        500: Server error or transaction failed.
2. GET /getAllData
    - Description: Gets all data in the database in JSON form.

## Nest step in development:
1. convert JSON(what getAllData returns) to excel  
2. Test -> GitHub Action

## Docker
uncompleted yet