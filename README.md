# RoomsQuickly Backend 

Requires:

 * Node Js v6+.
 * Redis server up and running.
 * MongoDb server Up and running.

check `config.js` file to update redis and mongo URLs.

How to run:

 1. npm install
 2. npm start
 
*Check `package.json` file for more `npm` commands.

___

## **API Documentation:**



**Start Auction**
----
  Returns json data with a successful message. - not a efficient way, need to find a better way, a cron job or something.

* **URL**

  /room/start

* **Method:**

  `GET`
  
*  **URL Params**

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: "RoomsQuickly auction's started." }`
 
* **Error Response:**

  * **Code:** 500 NOT FOUND <br />
    **Content:** `{ error: "Internal server error" }`
  
  

**Active Auction Items**
----
  Returns json list of active auction items ordered by time remaining for bidding.

* **URL**

  /room/rooms

* **Method:**

  `GET`
  
*  **URL Params**

    None


* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ data: [...] }`
 
* **Error Response:**

  * **Code:** 500 NOT FOUND <br />
    **Content:** `{ error: "Internal server error" }`
  
  


**Bidding**
----
  Returns json object either bid is a winner or not.

* **URL**

  /bid

* **Method:**

  `POST`
  
*  **URL Params**

    None


* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ winner: true | false }`
 
* **Error Response:**

  * **Code:** 500 NOT FOUND <br />
    **Content:** `{ error: "Internal server error" }`
  
  


**Winner Bid**
----
  Returns json object either bid is a winner or not.

* **URL**

  /bid/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[hex]` Bid ID

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ winner: true | false }`
 
* **Error Response:**

  * **Code:** 500 NOT FOUND <br />
    **Content:** `{ error: "Internal server error" }`
  
  

**Winner Bid**
----
  Returns json object with a list of bidding on a room.

* **URL**

  /bid/room/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[hex]` Room ID

* **Data Params**

   **Required:**
      `page=[integer]` 

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ data: [...] }`
 
* **Error Response:**

  * **Code:** 500 NOT FOUND <br />
    **Content:** `{ error: "Internal server error" }`
  
  