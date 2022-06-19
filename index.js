// install serveur et package

require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(formidable());
app.use(cors());

// configuration de mailgun

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "reverseau",
  key: process.env.MAILGUN_API_KEY /* VOTRE CLÉ API */,
});

app.get("/", (req, res) => {
  console.log("route /");

  res.status(200).json("Welcome");
});

app.post("/form", (req, res) => {
  console.log("route /form");
  //   Le console.log de req.fields nous affiche les données qui ont été rentrées dans les inputs (dans le formulaire frontend) :

  console.log(req.fields);

  //   On crée un objet messageData qui contient des informations concernant le mail (qui m'envoie le mail, adresse vers laquelle je veux envoyer le mail, titre et contenu du mail) :
  const messageData = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: "oreverseau@live.fr",
    subject: `Formulaire JS`,
    text: req.fields.message,
  };

  //   Fonctions fournies par le package mailgun pour créer le mail et l'envoyer, en premier argument de `create`, votre nom de domaine :
  client.messages
    .create(process.env.MAILGUN_DOMAIN, messageData)
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: "Email sent!!" });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

app.all("*", (req, res) => {
  console.log("this rout doesn't exist");
});

app.listen(process.env.PORT, () => {
  console.log("serveur is started");
});
