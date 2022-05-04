const express = require('express');
const cors = require('cors');
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
        await client.connect();
        const inventorycollection = client.db("electro-point").collection("Inventories");
        app.get('/inventories', async (req, res) => {
            const query = {};
            const cursor = inventorycollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const inventory = await inventorycollection.findOne(query);
            res.send(inventory);
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