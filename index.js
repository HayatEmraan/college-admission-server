const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
app.use(cors());

const uri = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_pass}@cluster0.1ki0ifk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const collegesData = client.db("CollegeAdmission").collection("Colleges");
    const usersData = client.db("CollegeAdmission").collection("UsersData");

    app.get("/colleges", async (req, res) => {
      res.send(await collegesData.find({}).toArray());
    });
    app.get("/colleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegesData.findOne(query);
      res.send(result);
    });
    app.post("/users", async (req, res) => {
        const user = req.body;
      const result = await usersData.insertOne(user);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port);
