import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
// mongoose.Promise = Promise;

const port = process.env.PORT || 9000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);


// Start defining your routes here
app.get("/", (req, res) => {
  res.send("This is the HappyThoughts API");
});

// Finding all the thoughts and sorting them 
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20); //-1 = descending and 1 = ascending, this sorts the thoughts so the newest thought appears first. Limit(20) = Only showing the 20 most recent thoughts  
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch thoughts" });
  }
});

// Posting a new thought 
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  const thought = new Thought({ message });

  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({ message: "Failed to create a new thought", error: error.errors })
  }
});

// Patch-route to update the hearts/likes 
app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    // Finding the thought by id and updating the value
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },  // Using mongoDB $inc operator = increments the value of hearts with 1 
      { new: true, runValidators: true } //validates the update so that it follows the schema provided
    );

    if (updatedThought) {
      res.status(200).json(updatedThought);
    } else {
      res.status(404).json({ message: "Thought not found" });
    }
  } catch (error) {
    console.error("Failed to update hearts:", error);
    res.status(503).json({ message: "Service Unavailable - Unable to update hearts" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

