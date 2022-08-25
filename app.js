const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

const corsConfig = {
    origin: true,
    credentials: true,
}
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log("Server is running on: ", port);
});

// server();

// Connecting with DB

const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASS}@cluster0.yr1h8wt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();

        const clientCollection = client.db("track24x7").collection("allClients");
        const ticketCollection = client.db("track24x7").collection("tickets");

        // Add New Client

        app.post("/addClient", async (req, res) => {
            console.log(req.body)
            const client = req.body;
            const result = await clientCollection.insertOne(client);
            res.send(result);
        });

        // Get All clients
        app.get("/getAllClients", async (req, res) => {
            const result = await clientCollection.find({}).toArray();
            res.send(result);
        });

        // Update a cleint

        app.patch("/updateClient/:id", async (req, res) => {
            const id = req.params.id;
            const { clientName, monthlyBill, address } = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    clientName,
                    monthlyBill,
                    address
                }
            }

            const result = await clientCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // Create Ticket

        app.post("/createTicket", async (req, res) => {
            const ticket = req.body;
            const result = await ticketCollection.insertOne(ticket);
            res.send(result);
        });


        // Get All Tickets
        app.get("/getAllTickets", async (req, res) => {
            const result = await ticketCollection.find({}).toArray();
            res.send(result);
        })

        // Close A ticket

        app.patch("/closeTicket/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: 'Solved'
                }
            }
            const result = await ticketCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // Update a ticket

        app.patch("/updateTicket/:id", async (req, res) => {
            const id = req.params.id;
            const updatedDescription = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    description: updatedDescription.description
                }
            };

            const result = await ticketCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


    } finally {

    }
}
run().catch(console.dir);