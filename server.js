const express = require("express");
const app = express();
const pool = require("./postgres");
const bodyParser = require("body-parser");


app.use(express.urlencoded({extended: false}));
app.use(express.json());



app.get("/customers", function(req, res) {
    console.log(req.originalUrl);
    pool
        .query('SELECT * FROM customers')
        .then(result=> res.json(result.rows))
        .catch((error) => console.log(error));
});

app.get("/hotels", function(req, res) {
  pool
    .query('SELECT * FROM hotels')
    .then((result) => res.json(result.rows))
    .catch((error) => console.log(error));
});


app.get("/hotels/:id", function(req, res) {
	const {id} = req.params;
  pool
    .query('SELECT * FROM hotels WHERE id = $1',[id])
	  //.then((result) => res.json(result.rows.filter(el =>el.id==id)))
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.post("/hotels", function(req,res) {
  const newHotelName = req.body.name;
  const newHotelRoom = req.body.rooms;
  const newHotelPostCode = req.body.postcode;

  const createQuery = 'INSERT INTO hotels (name,rooms,postcode) VALUES ($1,$2,$3)';

  pool
      .query(createQuery,[newHotelName,newHotelRoom,newHotelPostCode])
      .then((result) => res.send('Hotel created'))
      .catch((error) => console.error(error));

      console.log(newHotelName);
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
