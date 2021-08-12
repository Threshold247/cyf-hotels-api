const express = require("express");
const app = express();
const pool = require("./postgres");
const bodyParser = require("body-parser");
//email validator to use for customer endpoint
const validator = require("email-validator");





app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", function(req,res) {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p>Hello World</p>
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
// .post(function() {
//   const newCustName = req.body.name;
//   const newCustEmail= req.body.email;
//   const newCustAddress = req.body.address;
//   const newCustCity = req.body.city;
//   const newCustPostCode = req.body.postcode;
//   const newCustCountry = req.body.country;




//   const createQuery = 'INSERT INTO customers (name,email,address,city,postcode,country) VALUES ($1,$2,$3,$4,$5,$6)';

//   if (newCustName === undefined || newCustEmail === undefined||!validator.validate(newCustEmail) ||newCustAddress === undefined || newCustCity === undefined
//     || newCustPostCode ===  undefined || newCustCountry === undefined) {
//     return res
//       .status(400)
//       .send("Please check the field inputs");
//   }
//    pool
//     .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
//     .then((result) => {
//       if (result.rows.length > 0) {
//         return res
//           .status(400)
//           .send("An hotel with the same name already exists!");
//       } else {
//         const query =
//           "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
//         pool
//           .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
//           .then(() => res.send("Hotel created!"))
//           .catch((e) => console.error(e));
//       }
//     });
// });


app.route("/hotels")
.get (function(req, res) {
  pool
    .query('SELECT * FROM hotels')
    .then((result) => res.json(result.rows))
    .catch((error) => console.log(error));
})
.post (function(req,res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostCode = req.body.postcode;

  const createQuery = 'INSERT INTO hotels (name,rooms,postcode) VALUES ($1,$2,$3)';

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0 || newHotelName === undefined
    || newHotelPostCode ===  undefined) {
    return res
      .status(400)
      .send("Please check the field inputs");
  }
   pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
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

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});
