const express = require("express");
const app = express();
const router = express.Router();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
//email validator to use for customer endpoint
const validator = require("email-validator");

const pool = new Pool({});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router
  .route("/")
  .get(function (req, res) {
    console.log(req.originalUrl);
    pool
      .query("SELECT * FROM customers")
      .then((result) => res.json(result.rows))
      .catch((error) => console.log(error));
  })
  //CREATE NEW CUSTOMER IN DATABASE
  .post(function (req, res) {
    const newCustName = req.body.name;
    const newCustEmail = req.body.email;
    const newCustAddress = req.body.address;
    const newCustCity = req.body.city;
    const newCustPostCode = req.body.postcode;
    const newCustCountry = req.body.country;

    const createQuery =
      "INSERT INTO customers (name,email,address,city,postcode,country) VALUES ($1,$2,$3,$4,$5,$6)";

    if (
      newCustName === undefined ||
      newCustEmail === undefined ||
      !validator.validate(newCustEmail) ||
      newCustAddress === undefined ||
      newCustCity === undefined ||
      newCustPostCode === undefined ||
      newCustCountry === undefined
    ) {
      return res.status(400).send("Please check the field inputs");
    }
    pool
      .query("SELECT * FROM customers WHERE name=$1", [newCustName])
      .then((result) => {
        if (result.rows.length > 0) {
          return res
            .status(400)
            .send("A customer with the same name already exists!");
        } else {
          const query =
            "INSERT INTO customers (name,email,address,city,postcode,country) VALUES ($1,$2,$3, $4,$5,$6)";
          pool
            .query(query, [
              newCustName,
              newCustEmail,
              newCustAddress,
              newCustCity,
              newCustPostCode,
              newCustCountry,
            ])
            .then(() => res.send("Customer created!"))
            .catch((e) => console.error(e));
        }
      });
  });

module.exports = router;
