const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://doctorshub:doctorshub@cluster0.qvfs4.mongodb.net/docotors-hub?retryWrites=true&w=majority";

const app = express();
const port = process.env.PORT || 4088;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const collection = client.db("docotors-hub").collection("doctors");

  app.get("/doctors", (req, res) => {
    collection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.get("/search", (req, res) => {
    const query = req.query.specialty;
    const upCaseQuery = toUpperCase(query);

    collection
      .find({
        $or: [
          { name: { $regex: upCaseQuery } },
          { specialty: { $regex: upCaseQuery } },
        ],
      })
      .toArray((err, docs) => {
        res.send(docs);
      });
  });
});

const toUpperCase = (string) => {
  const splitString = string.split("")[0];
  const upCaseString = splitString.toUpperCase();
  const withoutFirstLetter = string
    .split("")
    .filter((firstLetter) => firstLetter !== splitString);
  return [upCaseString, ...withoutFirstLetter].join("");
};

app.listen(port);
