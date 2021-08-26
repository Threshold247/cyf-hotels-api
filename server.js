const express = require("express");
const app = express();
const { Pool } = require("pg");
const bodyParser = require("body-parser");

require("dotenv").config();
const bookings = require("./Routes/bookings.js");
const customers = require("./Routes/customers.js");
const hotels = require("./Routes/hotels.js");

const pool = new Pool({});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function (req, res) {
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
      <form action="/bookings" method="GET">
        <button class="btn btn-info" type="submit" value="GET">Get All bookings</button>
      </form>
      <form action="/customers" method="GET">
        <button class="btn btn-info" type="submit" value="GET">Get All customers</button>
      </form>
      <form action="/hotels" method="GET">
        <button class="btn btn-info" type="submit" value="GET">Get All hotels</button>
      </form>

  </body>
  </html>`);
});

app.use("/bookings", bookings);
app.use("/customers", customers);
app.use("/hotels", hotels);



// app.get("/bookings", function (req, res) {
//   pool
//     .query("SELECT * FROM bookings")
//     .then((result) => res.json(result.rows))
//     .catch((error) => console.log(error));
// });

app.listen(process.env.PORT, function () {
  console.log(
    `Server is listening on ${process.env.PORT}. Ready to accept requests!`
  );
});
