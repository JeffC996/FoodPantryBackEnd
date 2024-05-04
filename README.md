# CPSC-415-02 Food Pantry Project Backend
This backend application is a simple CRUD API developed with Express.js and Firebase. It demonstrates updating inventory data based on item type, category, and brand through a RESTful API.  
The API is documented using Swagger for easy testing and interaction.  

## Features
1. Update or create inventory items in Firebase Realtime Database.
2. API documentation with Swagger UI.
3. Generate Excel reports.

## Prerequisites
Before you begin, ensure you have met the following requirements:
1. Firebase Service Account Key

## Getting Started
1. Install everything you need using the following command:
```
npm install
```
2. Start the backend application using the following command:  
YOU CAN'T RUN app.js without the Private Key.
```
node server.js 
```  
This will start the server on http://localhost:3000.  
The API documentation can be accessed via http://localhost:3000/api-docs, where you can interact with the API using Swagger UI.

## API Endpoints
1. POST /updateData/{type}/{category}/{brand}
    -  Description: Updates or creates an inventory item. Use query parameter quantity to specify the amount to add (can be negative or positive).
    - Parameters:
        - name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The name of the item.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(path parameter)
        - quantity:&nbsp;&nbsp;The latest quantity of the item.&nbsp;(query parameter)
    - Responses:
        - `200`: Successfully updated the inventory.
        - `400`: Invalid input, quantity must be an integer.
        - `500`: Server error or transaction failed.  

2. GET /getAllData
    - Description: Gets all data in the database in JSON form.
    - Parameters
        - No parameters required for this endpoint.  
    - Responses
        - `200`: Successfully retrieved all data from Firebase database.
        - `500`: Failed to retrieve data from Firebase database.

3. GET /downloadData
    - Description: Downloads all data as an Excel file. 
    - Parameters
        - No parameters required for this endpoint.
    - Responses
        - `200`: Successfully created and downloaded the Excel file. The response includes the Excel file containing the structured data.
        - `500`: An error occurred on the server preventing the creation or download of the Excel file. This might be due to issues in data fetching from the database or file handling on the server.
## Tests
To test the backend using the following commands:
1. Enter the Backend folder
```
cd Backend
```
2. Run test
```
npm test
```

## Docker  
You need to have Docker desktop to do following commands!  
1. Create image using the following command:
```
docker build -t foodpantry-backend .
```
2. Run container using the following commands:
```
docker run -p 3000:3000 --name foodpantry-container foodpantry-backend
```  
This will start the server on http://localhost:3000.  
The API documentation can be accessed via http://localhost:3000/api-docs, where you can interact with the API using Swagger UI.

## Github Action
1. This repo has a testing workflow that will test the code of all pushes to the Backend folder, to ensure every push is functioning as expected.
2. The workflow starts automatically after each push, and you can view the test results in the action section of our github repo.


