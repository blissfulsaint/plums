import { NextApiRequest, NextApiResponse } from 'next';
import { getTopics, getChildTopics, createTopic } from '../../../services/topics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { parent_topic_id } = req.query;

    if (parent_topic_id) {
      const childTopics = await getChildTopics(parent_topic_id as string);
      res.status(200).json(childTopics);
    } else {
      const topics = await getTopics();
      res.status(200).json(topics);
    }
  } else if (req.method === 'POST') {
    // Handle creating a new topic
    try {
      const { title, content, tags, links } = req.body;

      // Perform validation or any other necessary checks

      // Call the createTopic function from your services
      const newTopic = await createTopic({
        title,
        content,
        tags,
        links,
      });

      res.status(201).json(newTopic);
    } catch (error) {
      console.error('Error creating new topic:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
