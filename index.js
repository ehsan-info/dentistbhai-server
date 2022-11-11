const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qohz0wa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    // console.log(req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorised access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'unauthorised access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const serviceCollection = client.db('dentistBhai').collection('services');
        const reviewCollection = client.db('dentistBhai').collection('reviews');

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });
            res.send({ token });
        });

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
        });
        //update
        //find document
        app.get('/updateReview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });
        //update data
        app.put('/updateReview/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const options = { upsert: true };
            const updatedReview = {
                $set: {
                    comments: review.comments
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, options);
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