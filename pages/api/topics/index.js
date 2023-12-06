// Import the MongoClient
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Connection URI for tags
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return res.status(500).json({ message: 'MongoDB connection string is missing.' });
  }

  // Create a new MongoClient
  const client = new MongoClient(uri, {
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database and the 'tags' collection directly
    const topics = await client.db().collection('topics').find({}).toArray();

    // Send the data as a response
    res.status(200).json(topics);
  } finally {
    // Close the connection
    await client.close();
  }
}