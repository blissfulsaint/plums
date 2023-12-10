// components/AddNewTopic.tsx

import React, { useState, useEffect } from 'react';

interface AddNewTopicProps {
  // Add any additional props you might need
}

interface Tag {
  _id: string;
  name: string;
}

const AddNewTopic: React.FC<AddNewTopicProps> = () => {
  // State to manage form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [remainingTags, setRemainingTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchRemainingTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const allTags: Tag[] = await response.json();

        // Filter out the tags already selected
        const remainingTagsList = allTags.filter((tag) => !tags.includes(tag._id));

        setRemainingTags(remainingTagsList);
      } catch (error) {
        console.error('Error fetching remaining tags:', error);
      }
    };

    fetchRemainingTags();
  }, [tags]);

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, '']);
  };

  const handleTagAdd = (tagId: string) => {
    // Find the selected tag object by ID
    const selectedTag = remainingTags.find((tag) => tag._id === tagId);

    if (selectedTag) {
      // Add the tag name to the tags state
      setTags([...tags, selectedTag.name]);

      // Remove the selected tag from the remaining tags
      setRemainingTags((prevRemainingTags) =>
        prevRemainingTags.filter((tag) => tag._id !== tagId)
      );
    }
  };


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new topic object with the form data
    const newTopic = {
      title,
      content,
      tags,
      links,
    };

    try {
      // Send a POST request to your API endpoint to add the new topic
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTopic),
      });

      if (response.ok) {
        // Handle successful topic creation, e.g., redirect or update UI
        console.log('Topic added successfully');
      } else {
        console.error('Error adding new topic:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding new topic:', error);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-96 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Add New Topic</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="text-gray-500 block mb-2">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 w-full text-black"
            required
          />
        </div>

        <label htmlFor="content" className="text-gray-500 block mb-2">
          Content:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-4 w-full text-black"
          rows={4}
        />

        <label htmlFor="links" className="text-gray-500 block mb-2">
          Links:
        </label>
        {links.map((link, index) => (
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

        <label htmlFor="tags" className="text-gray-500 block mb-2">
          Tags:
        </label>
        <div className="flex flex-wrap gap-y-2 items-center mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs mr-2">
              {tag}
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
          <select
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

        <button type="submit" className="btn-primary">
          Add Topic
        </button>
      </form>
    </div>
  );
};

export default AddNewTopic;