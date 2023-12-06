"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

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
    <div>
      <Header />
      <Nav />
      <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 mt-16 text-purple-800 mx-auto">Add New Topic</h2>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-purple-100 p-8 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="topicName">
            Topic Name:
          </label>
          <input
            id="topicName"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-purple"
            value={topicData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Content:
          </label>
          <textarea
            id="content"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-purple"
            value={topicData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="urlLinks">
            URL Links:
          </label>
          {topicData.links.map((link, index) => (
            <div key={index} className="mb-2">
              <input
                id={`urlLink${index}`}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-purple"
                value={link}
                onChange={(e) => handleChange('links', e.target.value, index)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLink}
            className="text-purple-500 hover:text-purple-700 focus:outline-none focus:underline"
          >
            Add Another Link
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
            Tags:
          </label>
          <select
            id="tags"
            multiple
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-purple"
            value={topicData.tags.map(String)}
            onChange={(e) =>
              handleChange(
                'tags',
                Array.from(e.target.selectedOptions, (option) => String(option.value))
              )
            }
          >
            {allTags.map((tag) => (
              <option key={tag.id} value={String(tag.id)}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-purple"
        >
          Submit
        </button>
      </form>
      </div>

    <Footer />
    </div>
  );
};

export default CreateTopicForm;   