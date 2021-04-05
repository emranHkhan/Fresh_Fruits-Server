const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const app = express()
const cors = require('cors')
require('dotenv').config()

// const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vllde.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const fruitsCollection = client.db("fuitsdb").collection("fruits");
  const allOrders = client.db("allitemsdb").collection("items");

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log(newEvent);
    fruitsCollection.insertOne(newEvent)
      .then(result => {
        console.log('count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/events', (req, res) => {
    fruitsCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.post('/checkout', (req, res) => {
    const checkoutInfo = req.body;
    console.log('connected');
    allOrders.insertOne(checkoutInfo)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
      .catch(err => console.log(err))

  })

  app.get('/orders', (req, res) => {
    console.log(req.query.email)
    allOrders.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/allorders', (req, res) => {
    fruitsCollection.find({})
      .toArray((err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    fruitsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
        res.send(result.deletedCount > 0)

      })
  })

  app.delete('/remove/:id', (req, res) => {
    allOrders.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
        res.send(result.deletedCount > 0)
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);
// app.listen(port, console.log('listening to ', port))