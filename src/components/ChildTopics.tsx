// components/ChildTopics.tsx

import React, { useEffect, useState } from 'react';
import ChildTopic from './ChildTopic';

interface ChildTopicData {
  _id: string;
  title: string;
  content: string;
  tags: { $oid: string }[];
  links: string[];
  completed: boolean;
}

interface ChildTopicsProps {
  parentId: string;
}

const ChildTopics: React.FC<ChildTopicsProps> = ({ parentId }) => {
  const [childTopics, setChildTopics] = useState<ChildTopicData[]>([]);

  // Function to fetch child topics
  useEffect(() => {
    const fetchChildTopics = async () => {
      try {
        // Fetch child topics based on parentId
        const response = await fetch(`/api/topics?parent_topic_id=${parentId}`);
        const childTopicsData: ChildTopicData[] = await response.json();

        setChildTopics(childTopicsData);
      } catch (error) {
        console.error('Error fetching child topics:', error);
      }
    };

    fetchChildTopics();
  }, [parentId]);

  // Render the component only if there are child topics
  if (childTopics.length === 0) {
    return null; // or any other placeholder if you want
  }

  return (
    <div className="mb-4">
      <span className="text-gray-500 mr-2">Child Topics:</span>
      <ul>
        {childTopics.map((childTopic) => (
          <ChildTopic key={childTopic._id} topic={childTopic} />
        ))}
      </ul>
    </div>
  );
};

export default ChildTopics;
