"use client";
import React, { useState, useEffect } from 'react';

interface Tag {
  id: number;
  name: string;
}

interface TopicData {
  title: string;
  content: string;
  links: string[];
  tags: number[];
}

const CreateTopicForm: React.FC = () => {
  const [topicData, setTopicData] = useState<TopicData>({
    title: '',
    content: '',
    links: [''],
    tags: [] as number[], // Initialize as an empty array of numbers
  });

  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    // Fetch all tags from the API
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const tagsData: Tag[] = await response.json(); // Explicitly type tagsData
        setAllTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleChange = (field: keyof TopicData, value: string | string[], index: number | null = null) => {
    setTopicData((prevData) => {
      if (index !== null) {
        const updatedLinks = [...prevData.links];
        updatedLinks[index] = value as string;
        return { ...prevData, links: updatedLinks };
      }

      // Handle string array case
      if (Array.isArray(value)) {
        return { ...prevData, [field]: value };
      }

      return { ...prevData, [field]: value as string };
    });
  };

  const handleAddLink = () => {
    setTopicData((prevData) => ({
      ...prevData,
      links: [...prevData.links, ''],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Add logic to submit data to MongoDB using fetch or axios

    // Reset form after submission
    setTopicData({
      title: '',
      content: '',
      links: [''],
      tags: [],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Topic Name:
        <input
          type="text"
          value={topicData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </label>

      <label>
        Content:
        <textarea
          value={topicData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          required
        />
      </label>

      <label>
        URL Links:
        {topicData.links.map((link, index) => (
          <div key={index}>
            <input
              type="text"
              value={link}
              onChange={(e) => handleChange('links', e.target.value, index)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddLink}>
          Add Another Link
        </button>
      </label>

      <label>
        Tags:
        <select
          multiple
          value={topicData.tags.map(String)} // Convert numbers to strings
          onChange={(e) =>
            handleChange(
              'tags',
              Array.from(e.target.selectedOptions, (option) => String(option.value))
            )
          }
        >
          {allTags.map((tag) => (
            <option key={tag.id} value={String(tag.id)}> {/* Convert id to string */}
              {tag.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateTopicForm;   