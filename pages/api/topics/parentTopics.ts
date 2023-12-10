// pages/api/topics/parentTopics.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getParentTopics } from '../../../services/topics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parentTopics = await getParentTopics();
    res.status(200).json(parentTopics);
  } catch (error) {
    console.error('Error fetching parent topics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
