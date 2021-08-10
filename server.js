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
    .catch((e) => console.log(e));
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
