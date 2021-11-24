const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
ObjectID = require('mongodb');
const { MongoClient } = require('mongodb');
const port = process.env.PORT||5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o5jef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try{
    await client.connect();
    
    const database = client.db("cars_shop");
    const reviewsCollection = database.collection("reviews");
    const productsCollection = database.collection("products");
    const placeOrdersCollection = database.collection("placeOrders");
    const userCollection = database.collection("users");
    const blogsCollection = database.collection('blogs');

    // add user in database
    app.post('/users', async(req,res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put('/users/admin', async(req, res) => {
      const user = req.body;
      // console.log('put', user);
      const filter = { email: user.email };
      const updateDoc = {$set: {role: 'admin'}};
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    })

    

    // products section
    app.get('/products', async(req,res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    })

    // Blogs Section
    app.get('/blogs', async(req,res) => {
      const cursor = blogsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })

    // Admin Add New Product
    app.post('/products', async(req,res) =>{
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      // console.log(result);
      res.json(result);
    })

    // review section
    app.get('/reviews', async(req,res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.json(reviews);
    })

    app.post('/reviews', async(req,res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      // console.log(result);
      res.json(result)
    })

    // User place order data
    app.get('/placeOrders', async(req,res) => {
      const cursor = placeOrdersCollection.find({});
      const userOrder = await cursor.toArray();
      // console.log(userOrder)
      res.json(userOrder);
    })

    app.post('/placeOrders', async(req,res) => {
      const orderInformation = req.body;
      // console.log(orderInformation);
      const result = await placeOrdersCollection.insertOne(orderInformation);
      // console.log(result);
      res.json(result)
    })

    app.post('/findadmin', async(req, res) => {
      console.log(req.body)
      const email = { email : req.body.userEmail };
      const cursor = await userCollection.findOne(email); 
      console.log(cursor)
      res.send(cursor);
      // res.send(cursor.)
    })


    // delete user order
    app.delete('/placeOrders/:id', async(req, res) =>{
      const id = req.params.id;
      // console.log(req.)
      const query = { id: id };
      console.log('okey', query);
      const result = await placeOrdersCollection.deleteOne(query);
      res.send(result.deletedCount > 0);
      // console.log(result);
    })

  }

  finally{
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Cars Lover!')
})

app.listen(port, () => {
  console.log(` listening at ${port}`)
})