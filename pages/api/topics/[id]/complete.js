// Import the MongoClient
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Connection URI for MongoDB
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return res.status(500).json({ message: 'MongoDB connection string is missing.' });
  }

  const { id } = req.query;

  // Log the id for debugging
  console.log('Received id:', id);

  // Ensure the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid topic ID.' });
  }

  // Create a new MongoClient
  const client = new MongoClient(uri, {
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database and the 'topics' collection directly
    const topicsCollection = client.db().collection('topics');

    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Find the topic by ObjectId
    const topic = await topicsCollection.findOne({ _id: objectId });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found.' });
    }

    // Update the 'completed' field in the database
    const updatedTopic = await topicsCollection.findOneAndUpdate(
      { _id: objectId },
      { $set: { completed: !topic.completed } },
      { returnDocument: 'after' } // Return the updated document
    );

    // Send the updated topic as a response
    res.status(200).json(updatedTopic.value);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Close the connection
    await client.close();
  }
}
