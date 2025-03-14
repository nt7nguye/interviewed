# extend-take-home

Both services are running locally on different ports (API on 9000 and React front end on 3000)

## API service backend under /api (requested assignment) 

A simple API router using Express.js that forwards requests to Express and returns response with customized fields, abstracting some unnecessary lower details. Main files include:

+ `api/app.js`: server and router set up
+ `api/routes/auth.js`: handle authentication and saves Bearer token for ease of usage (using `api/mockSessionStore.js` as a mock credential database)
  + exposed as `localhost:9000/api/auth`
+ `api/routes/cards.js`: handles retrieving card and all transactions related to that card
  + exposed as `localhost:9000/api/virtualcards` and `localhost:9000/api/virtualcards/{vc_id}/transactions`
+ `api/routes/transactions.js`: handles retrieving specific transaction
  + exposed as `localhost:9000/api/transactions/{txn_id}`

Issues: The guest card was moved around between different accounts and the `/virtualcards/{vc_id}/transactions` is not working for this card.

Future development: 
+ Real database instead of a mock file
+ Move to TypeScript

## Frontend under /client (simulating how a client/developer would use the API service)

Simple React frontend with a login page and simplified version of Extend homepage. Main files include:

+ `client/src/App.js`: introduction point, rendering the login page or dashboard.
+ `client/src/components/Dashboard.jsx`: 
  + render basic information
  + calling `localhost:9000/api/virtualcards` and `localhost:9000/api/virtualcards/{vc_id}/transactions` on the API service
+ `client/src/components/SignIn.jsx`: calling `localhost:9000/api/auth`

## Postman workspace for ease of testing with the Express API and the new API service

https://www.postman.com/avionics-operator-31346704/workspace/extend
