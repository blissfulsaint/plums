// components/EditTopicModal.tsx

import React, { useEffect, useState } from 'react';

interface EditTopicModalProps {
  topic: {
    _id: string;
    title: string;
    content: string;
    tags: number[];
    links: string[];
    completed: boolean;
  };
  onClose: () => void;
}

interface Tag {
  _id: string;
  name: string;
}

const EditTopicModal: React.FC<EditTopicModalProps> = ({ topic, onClose }) => {
  const [editedTitle, setEditedTitle] = useState(topic.title);
  const [editedContent, setEditedContent] = useState(topic.content);
  const [editedLinks, setEditedLinks] = useState(topic.links);
  const [editedTags, setEditedTags] = useState<string[]>(topic.tags.map(String));
  const [tagNames, setTagNames] = useState<string[]>([]);

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...editedLinks];
    updatedLinks[index] = value;
    setEditedLinks(updatedLinks);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = editedLinks.filter((_, i) => i !== index);
    setEditedLinks(updatedLinks);
  };

  const handleAddLink = () => {
    setEditedLinks([...editedLinks, '']);
  };

  // Function to get tag names based on tag IDs
  useEffect(() => {
    const getTagNames = async () => {
      try {
        // Fetch tag data from your MongoDB route
        const response = await fetch('/api/tags');
        const tags: Tag[] = await response.json();

        // Map tag IDs to tag names
        const topicTagNames = editedTags.map((tagId) => {
          const tag = tags.find((tag) => tag._id === tagId);
          return tag ? tag.name : `Tag ${tagId}`;
        });

        setTagNames(topicTagNames);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    getTagNames();
  }, [editedTags]);

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...editedTags];
    updatedTags.splice(index, 1);
    setEditedTags(updatedTags);
  };

  const [remainingTags, setRemainingTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchRemainingTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const allTags: Tag[] = await response.json();

        // Filter out the tags already selected
        const remainingTagsList = allTags.filter(
          (tag) => !editedTags.includes(tag._id)
        );

        setRemainingTags(remainingTagsList);
      } catch (error) {
        console.error('Error fetching remaining tags:', error);
      }
    };

    fetchRemainingTags();
  }, [editedTags]);

  const handleTagAdd = (tagId: string) => {
    console.log('Adding tag with ID:', tagId);
    setEditedTags([...editedTags, tagId]);
  };

  const handleSave = async () => {
    const apiUrl = `/api/topics/${topic._id}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          links: editedLinks,
          tags: editedTags,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update topic');
      }
  
      const updatedTopic = await response.json();
      console.log('Topic updated:', updatedTopic);
      window.location.reload();
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Edit Topic</h2>
        <label htmlFor="editedTitle" className="text-gray-700 mb-2 block">
          Title:
        </label>
        <input
          type="text"
          id="editedTitle"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-4 w-full text-black"
        />
        <label htmlFor="editedContent" className="text-gray-700 mb-2 block">
          Content:
        </label>
        <textarea
          id="editedContent"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-4 w-full text-black"
          rows={4}
        />
        <label htmlFor="editedLinks" className="text-gray-700 mb-2 block">
          Links:
        </label>
        {editedLinks.map((link, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full text-black mr-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddLink}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Link
        </button>
        <label htmlFor="editedTags" className="text-gray-700 mb-2 block">
          Tags:
        </label>
        <div className="flex flex-wrap gap-y-2 items-center mb-4">
          {tagNames.map((tagName, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs mr-2">
              {tagName}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </span>
          ))}
        </div>

        {/* Dropdown for adding new tags */}
        <div className="mb-4">
          <label htmlFor="addTagDropdown" className="text-gray-700 mb-2 block">
            Add New Tag:
          </label>
          <select
            id="addTagDropdown"
            onChange={(e) => handleTagAdd(e.target.value)}
            value={''} // Set an initial empty value
            className="border border-gray-300 rounded p-2 w-full text-black"
            >
            <option value="" disabled>
              Select a Tag
            </option>
            {remainingTags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save
        </button>
        <button onClick={onClose} className="text-gray-500 ml-2 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditTopicModal;
