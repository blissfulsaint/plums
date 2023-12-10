// components/Topic.tsx

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ChildTopics from './ChildTopics'; // Import the ChildTopics component
import AssignParentButton from './AssignParentButton'; // Import the AssignParentButton component
import EditTopicModal from './EditTopicModal'; // Import the EditTopicModal component

interface TopicProps {
  topic: {
    _id: string;
    title: string;
    content: string;
    tags: number[];
    links: string[];
    parent_topic_id: number | null;
    completed: boolean;
    is_parent_topic: boolean;
  };
}

interface Tag {
  _id: number;
  name: string;
}

const Topic: React.FC<TopicProps> = ({ topic }) => {
  const { _id, title, content, tags: tagIds, links, completed, is_parent_topic } = topic;
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [completedState, setCompleted] = useState<boolean>(completed);

  // Function to get tag names based on tag IDs
  useEffect(() => {
    const getTagNames = async () => {
      try {
        // Fetch tag data from your MongoDB route
        const response = await fetch('/api/tags');
        const tags: Tag[] = await response.json();

        // Map tag IDs to tag names
        const topicTagNames = tagIds.map((tagId) => {
          const tag = tags.find((tag) => tag._id === tagId);
          return tag ? tag.name : `Tag ${tagId}`;
        });

        setTagNames(topicTagNames);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    getTagNames();
  }, [tagIds]);

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

  // State to manage the modal visibility
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`/api/topics/${_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Handle deletion success, e.g., redirect or update UI
        console.log('Topic deleted successfully');
      } else {
        console.error('Error deleting topic:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-96">
      <h2 className="text-xl font-semibold mb-2 text-gray-600">{title}</h2>
      <p className="text-gray-600 mb-4">{content}</p>

      <div className="flex flex-wrap gap-y-2 items-center mb-4">
        <span className="flex text-gray-500 mr-2">Tags:</span>
        {tagNames.map((tagName, index) => (
          <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs mr-2">
            {tagName}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <span className="text-gray-500 mr-2">Links:</span>
        <ul>
          {links && links.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Link {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Render child topics using ChildTopics component */}
      <ChildTopics parentId={_id} />

      <div className="mb-4">
        {/* Render AssignParentButton only if the topic is not a parent */}
        {!is_parent_topic && <AssignParentButton topicId={_id} />}
      </div>

      <div className="flex items-center">
        <button
          onClick={handleEditClick}
          className="text-blue-500 hover:underline mr-4"
        >
          Edit
        </button>
        {/* Conditionally render the delete button */}
        {!is_parent_topic && (
          <button
            onClick={handleDeleteClick}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
        <span className="text-gray-500 mr-2">Completed:</span>
        <input
          type="checkbox"
          checked={completedState}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
      </div>
      {/* Render the modal when isEditing is true */}
      {isEditing && (
        <EditTopicModal topic={topic} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Topic;
