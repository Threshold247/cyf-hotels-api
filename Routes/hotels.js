const express = require("express");
const app = express();
const router = express.Router();
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const pool = new Pool({});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.route("/")
  //READ ALL HOTEL INFO
  .get(function (req, res) {
    pool
      .query("SELECT * FROM hotels")
      .then((result) => res.json(result.rows))
      .catch((error) => console.log(error));
  })
  //CREATE NEW HOTEL IN DATABASE
  .post(function (req, res) {
    const { name, rooms, postcode } = req.body;

    const createQuery =
      "INSERT INTO hotels (name,rooms,postcode) VALUES ($1,$2,$3)";

    if (!Number.isInteger(rooms) || rooms <= 0 || name === undefined || postcode === undefined) {
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
          .query(query, [name, rooms, postcode])
          .then(() => res.send("Hotel created!"))
          .catch((e) => console.error(e));
      }
    });
  });

router.route("/:id")
.get(function (req, res) {
  const { id } = req.params;
  pool
    .query("SELECT * FROM hotels WHERE id = $1", [id])
    //.then((result) => res.json(result.rows.filter(el =>el.id==id)))
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});


module.exports = router;
