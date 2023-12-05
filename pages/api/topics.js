// Import the MongoClient
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Connection URI
  const uri = 'mongodb+srv://ach18003:pass@cluster0.cecdyyl.mongodb.net/?retryWrites=true&w=majority';

  // Create a new MongoClient
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database
    const database = client.db('Plums');
    const collection = database.collection('topics');

    // Fetch data from MongoDB
    const topics = await collection.find({}).toArray();

    // Send the data as a response
    res.status(200).json(topics);
  } finally {
    // Close the connection
    await client.close();
  }
}
