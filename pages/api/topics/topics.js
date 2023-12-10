// Import the MongoClient
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Configure dotenv to read values from .env file
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extract data from the request body
  const { title } = req.body;

  // Validate the required fields
  if (!title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Connection URI for MongoDB
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return res.status(500).json({ message: 'MongoDB connection string is missing.' });
  }

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database and the 'topics' collection directly
    const database = client.db();
    const topicsCollection = database.collection('topics');

    // Create a new document
    const newTopic = {
      title,
    };

    // Insert the new document into the 'topics' collection
    const result = await topicsCollection.insertOne(newTopic);

    console.log('Result:', result);

    // Check if result and result.ops are defined before accessing the first element
    if (result && result.ops && result.ops.length > 0) {
      // Return the inserted data
      res.status(201).json(result.ops[0]);
    } else {
      // If result is not as expected, handle the error
      const errorMessage = 'Internal Server Error';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error adding topic:', error);
    const errorMessage = error.message || 'Internal Server Error';
    return res.status(500).json({ message: errorMessage, error: error.stack });
  } finally {
    try {
      // Close the connection
      await client.close();
    } catch (closeError) {
      console.error('Error closing the connection:', closeError);
    }
  }
}
