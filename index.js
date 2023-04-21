const express = require("express");
const app = express();
require("./ConnectDB/connectToMongo");
const jwt = require("jsonwebtoken");
const user = require("./Models/register");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const bearerStrategy = require("./passport-strategies/bearer");

require("dotenv").config();

app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/register", async (req, res) => {
  try {
    const email_existe = await user.findOne({ email: req.body.email });
    if (email_existe) {
      return res.status(401).json({ message: "email  exist" });
    }
    const hash_password = bcrypt.hashSync(req.body.password);
    const user_hashed_password = new user({
      email: req.body.email,
      password: hash_password,
    });
    await user_hashed_password.save();
    res.status(200).json({
      message: "User registered successfully",
      hashed_pass: hash_password,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const user_existe = await user.findOne({ email: req.body.email });
  if (!user_existe) {
    res.status(400).json({ message: " email n'existe pas " });
  }

  const compare_hash_password = bcrypt.compareSync(
    req.body.password,
    user_existe.password
  );
  if (!compare_hash_password) {
    res.status(400).json({ message: "password incorrect" });
  }
  const sercet = process.env.SECRET;
  const token = jwt.sign({ id: user_existe.id }, sercet, {
    expiresIn: 86400,
  });
  user
    .findOneAndUpdate(
      { email: req.body.email }, // identifiant de l'utilisateur concerné
      { token: token }, // mettre à jour le champ token avec la nouvelle valeur
      { new: true } // pour renvoyer le document mis à jour plutôt que l'ancien document
    )
    .then((user) => {
      console.log("Token saved to database for user:", user);
    })
    .catch((err) => {
      console.error("Error saving token to database:", err);
    });

  res.status(200).json({ token });
});

app.get(
  "/api/secured",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    res.json({ message: "secured connexion " });
    console.log(req.body);
  }
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server on listen dans le port " + port);
});
