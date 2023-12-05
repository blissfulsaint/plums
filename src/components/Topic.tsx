import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface TopicProps {
  topic: {
    id: number;
    title: string;
    content: string;
    tags: number[];
    links: string[];
    parent_topic_id: number | null;
    completed: boolean;
  };
}

interface Tag {
  id: number;
  name: string;
}

const Topic: React.FC<TopicProps> = ({ topic }) => {
  const { id, title, content, tags: tagIds, links, parent_topic_id, completed } = topic;
  const [tagNames, setTagNames] = useState<string[]>([]);

  // Function to get tag names based on tag IDs
  useEffect(() => {
    const getTagNames = async () => {
      try {
        // Fetch tag data from your MongoDB route
        const response = await fetch('/api/tags');
        const tags: Tag[] = await response.json();

        // Map tag IDs to tag names
        const topicTagNames = tagIds.map((tagId) => {
          const tag = tags.find((tag) => tag.id === tagId);
          return tag ? tag.name : `Tag ${tagId}`;
        });

        setTagNames(topicTagNames);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    getTagNames();
  }, [tagIds]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-96">
      <h2 className="text-xl font-semibold mb-2 text-gray-600">{title}</h2>
      <p className="text-gray-600 mb-4">{content}</p>

      <div className="flex items-center mb-4">
        <span className="text-gray-500 mr-2">Tags:</span>
        {tagNames.map((tagName, index) => (
          <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs mr-2">
            {tagName}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <span className="text-gray-500 mr-2">Links:</span>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Link {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {parent_topic_id && (
        <div className="mb-4">
          <span className="text-gray-500 mr-2">Parent Topic:</span>
          <Link href={`/topics/${parent_topic_id}`}>
            <div className="text-blue-500 underline">Parent Topic</div>
          </Link>
        </div>
      )}

      <div>
        <span className="text-gray-500 mr-2">Completed:</span>
        <input type="checkbox" checked={completed} readOnly className="mr-2" />
      </div>
    </div>
  );
};

export default Topic;
