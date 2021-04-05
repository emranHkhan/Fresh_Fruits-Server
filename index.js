const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const app = express()
const cors = require('cors')
require('dotenv').config()

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vllde.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const fruitsCollection = client.db("fuitsdb").collection("fruits");
  const allOrders = client.db("allitemsdb").collection("items");

  // adding products(fruits) to db
  app.post('/addProduct', (req, res) => {
    const newEvent = req.body;
    console.log(newEvent);
    fruitsCollection.insertOne(newEvent)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  // showing products to Home page
  app.get('/products', (req, res) => {
    fruitsCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  //saving the ordered product to db
  app.post('/checkout', (req, res) => {
    const checkoutInfo = req.body;
    allOrders.insertOne(checkoutInfo)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
      .catch(err => console.log(err))

  })

  //finding all the products for respective email
  app.get('/orders', (req, res) => {
    
    allOrders.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //showing all the products for respective email
  app.get('/allorders', (req, res) => {
    fruitsCollection.find({})
      .toArray((err, result) => {
        res.send(result)
      })
  })

  //delete product by its id
  app.delete('/delete/:id', (req, res) => {
    fruitsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)

      })
  })

  //delete ordered product by its id
  app.delete('/remove/:id', (req, res) => {
    allOrders.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);
// app.listen(port, console.log('listening to ', port))