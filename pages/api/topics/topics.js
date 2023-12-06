// Import the MongoClient
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extract topic data from the request body
  const { title, content, links, tags } = req.body;

  // Validate the required fields
  if (!title || !content || !links || !tags) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Connection URI for MongoDB
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return res.status(500).json({ message: 'MongoDB connection string is missing.' });
  }

  // Create a new MongoClient
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database and the 'topics' collection directly
    const database = client.db();
    const topicsCollection = database.collection('topics');

    // Create a new topic document
    const newTopic = {
      title,
      content,
      links,
      tags,
    };

    // Insert the new topic into the 'topics' collection
    const result = await topicsCollection.insertOne(newTopic);

    // Return the inserted topic data
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Error adding topic:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Close the connection
    await client.close();
  }
}
