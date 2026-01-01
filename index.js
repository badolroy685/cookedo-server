const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ssfhyko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const recipeCollection = client.db("recipeDB").collection("recipes");
    const userCollection = client.db("recipeDB").collection("users");

    app.get('/recipes', async (req, res) => {

      const result = await recipeCollection.find().toArray();
      res.send(result);
    });

    app.get('/recipes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipeCollection.findOne(query);
      res.send(result);
    });

    app.post('/recipes', async (req, res) => {
      const newRecipes = req.body;
      console.log(newRecipes);
      const result = await recipeCollection.insertOne(newRecipes);
      res.send(result);
    });

    app.delete('/recipes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipeCollection.deleteOne(query);
      res.send(result);
    });

    //user related apis
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.patch('/users', async (req, res) => {
      const { email, lastSignInTime } = req.body;
      console.log(email, lastSignInTime);
      const filter = { email: email };
      const updateDoc = {
        $set: {
          lastSignInTime: lastSignInTime
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to Recipe website !')
})

module.exports = app;


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
