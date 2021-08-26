const express = require("express");
const app = express();
const router = express.Router();
const { Pool } = require("pg");
const bodyParser = require("body-parser");

require("dotenv").config();

const pool = new Pool({});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.route("/")
.get(function (req,res) {

  pool
  .query("SELECT * FROM bookings")
  .then(result => res.json(result.rows))
  .catch(err =>console.error(err));
})

module.exports = router;
