const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
//middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('dentist Bhai server');
});

//User: dentistBhaiDbUser
//pass: RdfrQezptzKe47aW

const uri = "mongodb+srv://dentistBhaiDbUser:RdfrQezptzKe47aW@cluster0.qohz0wa.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('dentistBhai').collection('services');

        app.get('/firstServices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const service = await serviceCollection.findOne(query);
            // console.log(service);
            res.send(service);
        });
    }
    finally {

    }
}
run().catch(error => console.log(error))





app.listen(port, () => {
    console.log(`dentist bhai server running on port : ${port}`)
});