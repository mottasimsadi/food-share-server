const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const admin = require("firebase-admin");

const serviceAccount = require("./admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middleware/auth.js

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken; // You can access user info like uid, email, etc.
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token from catch" });
  }
};

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const foodCollection = client.db("foodDB").collection("foodShare");

    // POST new food share item
    app.post("/add-food", async (req, res) => {
      const newFood = req.body;
      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    });

    // GET available foods with optional search and sorting
    app.get("/available-foods", async (req, res) => {
      const search = req.query.search || "";
      const sortBy = req.query.sort || "expireDate"; // default to expireDate

      const query = {
        status: "available",
        foodName: { $regex: search, $options: "i" },
      };

      const sortOptions = {};
      if (sortBy === "expireDate") {
        sortOptions.expireDate = 1; // ascending
      } else if (sortBy === "quantity") {
        sortOptions.foodQuantity = -1; // descending
      } else if (sortBy === "location") {
        sortOptions.pickupLocation = 1; // ascending
      }

      const result = await foodCollection
        .find(query)
        .sort(sortOptions)
        .toArray();

      res.send(result);
    });

    // GET food by id
    app.get("/food/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    // POST create new food request
    app.post("/requests", async (req, res) => {
      const requestedFood = req.body;
      const result = await foodCollection.insertOne(requestedFood);
      res.send(result);
    });

    // PATCH update food status
    app.patch("/food/:id", async (req, res) => {
      const { id } = req.params;
      const updates = req.body;

      const query = { _id: new ObjectId(id) };
      const updateDoc = { $set: { status: updates.status } };

      const result = await foodCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // GET top 6 most quantity foods
    app.get("/featured-foods", async (req, res) => {
      const result = await foodCollection
        .find({ status: "available" })
        .sort({ foodQuantity: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // GET current users foods
    app.get("/manage-foods", verifyFirebaseToken, async (req, res) => {
      const query = { donorEmail: req.firebaseUser.email };
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    });

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

// Root route
app.get("/", async (req, res) => {
  res.send("Food Share is running perfectly!");
});

app.listen(PORT, () => {
  console.log(`Food Share server is running on port ${PORT}`);
});
