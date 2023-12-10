// api/topics/[id]/removeParent.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { removeParentFromTopic } from '../../../../services/topics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'PUT':
      try {
        // Update the database using the service function
        const success = await removeParentFromTopic(id as string);

        if (success) {
          res.status(200).json({ success: true });
        } else {
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      } catch (error) {
        console.error('Error removing parent:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
