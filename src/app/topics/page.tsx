// Import React and useState
'use client'

import React, { useState } from 'react';

// CreateTopicForm component
const CreateTopicForm = () => {
  // State for the title input
  const [title, setTitle] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send a POST request to the server
      const response = await fetch('/api/topics/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      // Check if the response is okay
      if (!response.ok) {
        // Log the error and throw an exception
        const responseData = await response.json();
        console.log('Response Data:', responseData);
        throw new Error(`Failed to add topic: ${response.statusText}`);
      }

      // Reset the title after successful submission
      setTitle('');
    } catch (error) {
      // Log and handle errors
      console.error('Error submitting topic:', error);
    }
  };

  return (
    // Stylish form using Tailwind CSS classes
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-8 bg-white rounded-md shadow-md">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mt-1 focus:outline-none focus:shadow-outline-purple"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-purple"
      >
        Submit
      </button>
    </form>
  );
};

// Export the component
export default CreateTopicForm;
