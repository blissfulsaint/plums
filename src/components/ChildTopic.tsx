// ChildTopic.tsx

import React, { useState, useEffect } from 'react';
import styles from './ChildTopic.module.css';
import ClearParentButton from './ClearParentButton'; // Import the ClearParentButton component

interface ChildTopicProps {
  topic: {
    _id: string;
    title: string;
    content: string;
    tags: { $oid: string }[];
    links: string[];
    completed: boolean;
  };
}

interface Tag {
  _id: { $oid: string };
  name: string;
}

const ChildTopic: React.FC<ChildTopicProps> = ({ topic }) => {
  const { _id, title, content, tags: tagIds, links, completed } = topic;
  const [expanded, setExpanded] = useState(false);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [completedState, setCompleted] = useState<boolean>(completed);

  useEffect(() => {
    const getTagNames = async () => {
      try {
        // Fetch tag data from your MongoDB route
        const response = await fetch('/api/tags');
        const tagsData: Tag[] = await response.json();

        // Map tag IDs to tag names
        const topicTagNames = tagIds.map((tagId) => {
          const foundTag = tagsData.find((tag) => tag._id === tagId);
          return foundTag ? foundTag.name : `Tag ${tagId}`;
        });

        setTagNames(topicTagNames);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    getTagNames();
  }, [tagIds]);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCheckboxChange = async () => {
    try {
      const response = await fetch(`/api/topics/${_id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completedState }),
      });

      if (response.ok) {
        // Update the local state after a successful request
        setCompleted(!completedState);
      } else {
        console.error('Error updating topic:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  return (
    <li className={`text-gray-500 border border-gray-300 rounded-md p-3 mb-3 ${styles.expanded}`} key={_id}>
      <div className="cursor-pointer" onClick={handleToggleExpand}>
        {title}
      </div>
      {expanded && (
        <div className="border-t mt-3 pt-3">
          <p>{content}</p>
          <div className="flex flex-wrap gap-y-2 items-center mb-2">
            <span className="text-gray-500 mr-2">Tags:</span>
            {tagNames.map((tagName, index) => (
              <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs mr-2">
                {tagName}
              </span>
            ))}
          </div>
          <div className="mb-2">
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
          <div>
            <ClearParentButton topicId={_id} />
            <span className="text-gray-500 mr-2">Completed:</span>
            <input type="checkbox" checked={completedState} onChange={handleCheckboxChange} className="mr-2" />
          </div>
        </div>
      )}
    </li>
  );
};

export default ChildTopic;
