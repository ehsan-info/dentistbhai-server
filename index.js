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
        const reviewCollection = client.db('dentistBhai').collection('reviews');
        app.get('/firstServices', async (req, res) => {
            const query = {};
            const options = {
                sort: { addTime: -1 }
            };
            const cursor = serviceCollection.find(query, options).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services', async (req, res) => {
            const query = {};
            const options = {
                sort: { addTime: -1 }
            };
            const cursor = serviceCollection.find(query, options);
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

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });
        app.get('/myReviews', async (req, res) => {
            /* const decoded = req.decoded;
            console.log(decoded);
            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'Unauthorised Access' })
            } */
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const options = {
                sort: { addTime: -1 }
            };
            const cursor = reviewCollection.find(query, options);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(error => console.log(error))





app.listen(port, () => {
    console.log(`dentist bhai server running on port : ${port}`)
});