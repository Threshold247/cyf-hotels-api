const express = require("express");
const app = express();
const {Pool} = require('pg');
const bodyParser = require("body-parser");
//email validator to use for customer endpoint
const validator = require("email-validator");
require("dotenv").config();

const pool =  new Pool({});



app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", function(req,res) {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      <title>Document</title>
  </head>
  <body>
      <form action="/hotels" method="GET">
        <button class="btn btn-info" type="submit" value="GET">Get All hotels</button>
      </form>
      <form action="/customers" method="GET">
        <button class="btn btn-info" type="submit" value="GET">Get All customers</button>
      </form>
  </body>
  </html>`);
});


app.route("/customers")
.get(function(req, res) {
    console.log(req.originalUrl);
    pool
      .query('SELECT * FROM customers')
      .then(result=> res.json(result.rows))
      .catch((error) => console.log(error));
})
//CREATE NEW CUSTOMER IN DATABASE
.post(function(req, res) {
  const newCustName = req.body.name;
  const newCustEmail= req.body.email;
  const newCustAddress = req.body.address;
  const newCustCity = req.body.city;
  const newCustPostCode = req.body.postcode;
  const newCustCountry = req.body.country;

  const createQuery = 'INSERT INTO customers (name,email,address,city,postcode,country) VALUES ($1,$2,$3,$4,$5,$6)';

  if (newCustName === undefined || newCustEmail === undefined||!validator.validate(newCustEmail) ||newCustAddress === undefined || newCustCity === undefined
    || newCustPostCode ===  undefined || newCustCountry === undefined) {
    return res
      .status(400)
      .send("Please check the field inputs");
  }
   pool
    .query("SELECT * FROM customers WHERE name=$1", [newCustName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A customer with the same name already exists!");
      } else {
        const query = 'INSERT INTO customers (name,email,address,city,postcode,country) VALUES ($1,$2,$3, $4,$5,$6)';
        pool
          .query(query, [newCustName, newCustEmail,newCustAddress,newCustCity,newCustPostCode,newCustCountry])
          .then(() => res.send("Customer created!"))
          .catch((e) => console.error(e));
      }
    });
});


app.route("/hotels")
//READ ALL HOTEL INFO
.get (function(req, res) {
  pool
    .query('SELECT * FROM hotels')
    .then((result) => res.json(result.rows))
    .catch((error) => console.log(error));
})
//CREATE NEW HOTEL IN DATABASE
.post (function(req,res) {
  // const newHotelName = req.body.name;
  // const newHotelRooms = req.body.rooms;
  // const newHotelPostCode = req.body.postcode;

  const {name, rooms, postcode} = req.body;

  const createQuery = 'INSERT INTO hotels (name,rooms,postcode) VALUES ($1,$2,$3)';

  if (!Number.isInteger(rooms) || rooms <= 0 || name === undefined
    || postcode ===  undefined) {
    return res
      .status(400)
      .send("Please check the field inputs");
  }
   pool
    .query("SELECT * FROM hotels WHERE name=$1", [name])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [name,rooms,postcode])
          .then(() => res.send("Hotel created!"))
          .catch((e) => console.error(e));
      }
       
    });
});



app.get("/hotels/:id", function(req, res) {
	const {id} = req.params;
  pool
    .query('SELECT * FROM hotels WHERE id = $1',[id])
	  //.then((result) => res.json(result.rows.filter(el =>el.id==id)))
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});



app.get("/bookings", function(req, res) {
    pool
    .query('SELECT * FROM bookings')
    .then((result) => res.json(result.rows))
    .catch((error) => console.log(error));
});

app.listen(process.env.PORT, function() {
    console.log(`Server is listening on ${process.env.PORT}. Ready to accept requests!`);
});
