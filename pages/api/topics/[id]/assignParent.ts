import { NextApiRequest, NextApiResponse } from 'next';
import { assignParentToTopic } from '../../../../services/topics';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;
  
    switch (method) {
      case 'PUT':
        try {
          const { parent_topic_id } = req.body;
  
          // Update the database using the service function
          const success = await assignParentToTopic(id as string, parent_topic_id);
  
          if (success) {
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
          }
        } catch (error) {
          console.error('Error assigning parent:', error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        break;
      default:
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
  }
  