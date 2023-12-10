// services/topics.ts

import { ObjectId, InsertOneResult } from 'mongodb';
import { connectToDatabase } from '../utils/db';

export async function getTopics(): Promise<any[]> {
  const { db } = await connectToDatabase();
  const topics = await db.collection('topics').find({}).toArray();
  return topics;
}

export async function getChildTopics(parent_topic_id: string): Promise<any[]> {
  console.log("Entered Get Child Topics Function");
  const { db } = await connectToDatabase();

  try {
    const objectId = new ObjectId(parent_topic_id);
    const childTopics = await db.collection('topics').find({ parent_topic_id: objectId }).toArray();
    return childTopics;
  } catch (error) {
    console.error('Error converting parent_topic_id to ObjectId:', error);
    return [];
  }
}

export async function getTopicById(id: string): Promise<any | null> {
  const { db } = await connectToDatabase();

  try {
    const topic = await db.collection('topics').findOne({ _id: new ObjectId(id) });

    return topic;
  } catch (error) {
    console.error('Error fetching topic by ID:', error);
    return null;
  }
}

export async function getParentTopics(): Promise<any[]> {
  const { db } = await connectToDatabase();

  try {
    // Fetch topics where parent_topic_id is null
    const parentTopics = await db.collection('topics').find({ parent_topic_id: null }).toArray();
    return parentTopics;
  } catch (error) {
    console.error('Error fetching parent topics:', error);
    return [];
  }
}

export async function assignParentToTopic(topicId: string, parentTopicId: string | null): Promise<boolean> {
  const { db } = await connectToDatabase();

  try {
    // Update the current topic's parent_topic_id
    await db.collection('topics').updateOne(
      { _id: new ObjectId(topicId) },
      { $set: { parent_topic_id: parentTopicId ? new ObjectId(parentTopicId) : null } }
    );

    // Update the parent topic's is_parent_topic to true
    if (parentTopicId) {
      await db.collection('topics').updateOne(
        { _id: new ObjectId(parentTopicId) },
        { $set: { is_parent_topic: true } }
      );
    }

    return true;
  } catch (error) {
    console.error('Error assigning parent:', error);
    return false;
  }
}

export async function removeParentFromTopic(topicId: string): Promise<boolean> {
  const { db } = await connectToDatabase();

  try {
    const objectId = new ObjectId(topicId);

    // Find the current topic's parent_topic_id
    const currentTopic = await db.collection('topics').findOne({ _id: objectId });
    const parentTopicId = currentTopic?.parent_topic_id;

    // Update the current topic's parent_topic_id to null
    await db.collection('topics').updateOne(
      { _id: objectId },
      { $set: { parent_topic_id: null } }
    );

    // Check if there are any child topics with the same parent_topic_id
    const hasChildTopics = await db.collection('topics').findOne({ parent_topic_id: parentTopicId });

    // If there are no child topics, update the former parent's is_parent_topic to false
    if (!hasChildTopics) {
      await db.collection('topics').updateOne(
        { _id: parentTopicId },
        { $set: { is_parent_topic: false } }
      );
    }

    return true;
  } catch (error) {
    console.error('Error removing parent:', error);
    return false;
  }
}

export async function updateTopic(id: string, updatedTopicData: any): Promise<boolean> {
  const { db } = await connectToDatabase();

  try {
    await db.collection('topics').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTopicData }
    );

    return true;
  } catch (error) {
    console.error('Error updating topic:', error);
    return false;
  }
}

export async function deleteTopic(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
  
    try {
      const objectId = new ObjectId(id);
  
      // Find the current topic
      const currentTopic = await db.collection('topics').findOne({ _id: objectId });
  
      if (!currentTopic) {
        console.error('Topic not found');
        return false;
      }
  
      // If the topic is a parent, delete its child topics recursively
      if (currentTopic.is_parent_topic) {
        await deleteChildTopics(objectId);
      }
  
      // Delete the current topic
      await db.collection('topics').deleteOne({ _id: objectId });
  
      // If the topic had a parent, check if it still has child topics
      if (currentTopic.parent_topic_id) {
        const hasChildTopics = await db.collection('topics').findOne({ parent_topic_id: currentTopic.parent_topic_id });
  
        // If there are no child topics, update the former parent's is_parent_topic to false
        if (!hasChildTopics) {
          await db.collection('topics').updateOne(
            { _id: currentTopic.parent_topic_id },
            { $set: { is_parent_topic: false } }
          );
        }
      }
  
      return true;
    } catch (error) {
      console.error('Error deleting topic:', error);
      return false;
    }
  }
  
  // Recursive function to delete child topics
  async function deleteChildTopics(parentId: ObjectId): Promise<void> {
    const { db } = await connectToDatabase();
  
    // Find child topics of the current parent
    const childTopics = await db.collection('topics').find({ parent_topic_id: parentId }).toArray();
  
    // Recursively delete child topics
    for (const childTopic of childTopics) {
      if (childTopic.is_parent_topic) {
        await deleteChildTopics(childTopic._id);
      }
  
      await db.collection('topics').deleteOne({ _id: childTopic._id });
    }
  }

  interface NewTopic {
    title: string;
    content: string;
    tags: string[];
    links: string[];
  }
  
  export async function createTopic(newTopic: NewTopic): Promise<any> {
    const { db } = await connectToDatabase();
  
    try {
      // Assuming tags and links are arrays of strings
      const topicToInsert = {
        ...newTopic,
        tags: newTopic.tags.map((tag) => new ObjectId(tag)),
        links: newTopic.links,
      };
  
      const result: InsertOneResult<any> = await db.collection('topics').insertOne(topicToInsert);
  
      if (result.insertedId) {
        const insertedTopic = await db.collection('topics').findOne({ _id: result.insertedId });
        return insertedTopic || null;
      } else {
        console.error('Failed to get insertedId:', result);
        throw new Error('Failed to insert topic');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }