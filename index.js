const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;



// midlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d7gqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // await client.connect();
        const inventorycollection = client.db("electro-point").collection("Inventories");



        //SERVICES API
        app.get('/inventories', async (req, res) => {
            const query = {};
            const cursor = inventorycollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        // read all data by id for client side
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const inventory = await inventorycollection.findOne(query);
            res.send(inventory);
        })


        //update quantity after delivered
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedInventory = {
                $set: {
                    img: updatedQuantity.img,
                    quantity: updatedQuantity.quantity,
                    name: updatedQuantity.name,
                    price: updatedQuantity.price,
                    details: updatedQuantity.details,
                    supplier: updatedQuantity.supplier,
                    sold: updatedQuantity.sold
                }
            };
            const result = await inventorycollection.updateOne(filter, updatedInventory, options);
            res.send(result);

        })

        //delete inventory item
        app.delete('/manageInventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventorycollection.deleteOne(query);
            res.send(result);
        })


        //add new item
        app.post('/inventories', async (req, res) => {
            const newItem = req.body;
            const result = await inventorycollection.insertOne(newItem);
            res.send(result);
        })


        //myItem page data filtered by email
        app.get('/myItem', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = inventorycollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running electro-point Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})