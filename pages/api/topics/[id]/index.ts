// pages/api/topics/[id]/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getTopicById, updateTopic, deleteTopic } from '../../../../services/topics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (!id || Array.isArray(id)) {
      throw new Error('Invalid topic ID');
    }

    if (req.method === 'GET') {
      // Handle GET request to fetch the topic by ID
      const topic = await getTopicById(id as string);

      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
      } else {
        res.status(200).json(topic);
      }
    } else if (req.method === 'PUT') {
      // Handle PUT request to update the topic by ID
      const updatedTopic = await updateTopic(id as string, req.body);

      if (!updatedTopic) {
        res.status(404).json({ error: 'Topic not found' });
      } else {
        res.status(200).json(updatedTopic);
      }
    } else if (req.method === 'DELETE') {
      // Handle DELETE request to delete the topic by ID
      const deleted = await deleteTopic(id as string);

      if (!deleted) {
        res.status(404).json({ error: 'Topic not found' });
      } else {
        res.status(204).end();
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling topic request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
