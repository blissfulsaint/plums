// Import the necessary dependencies
"use client";
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link';
import Topic from '../components/Topic';

// Add a type for the topic
type TopicType = {
  _id: string;
  title: string;
  content: string;
  tags: number[];
  links: string[];
  parent_topic_id: number | null;
  completed: boolean;
  is_parent_topic: boolean;
};

export default function Home() {
  const [featuredTopics, setFeaturedTopics] = useState<TopicType[]>([]);

  useEffect(() => {
    // Function to fetch topics data and set random featured topics
    const fetchFeaturedTopics = async () => {
      try {
        // Fetch topics data from your MongoDB route
        const response = await fetch('/api/topics'); // Adjust the API route accordingly
        const topicsData = await response.json();

        // Filter topics to include only those with parent_topic_id set to null
        const filteredTopics = topicsData.filter((topic: TopicType) => topic.parent_topic_id === null);

        // Shuffle the array of topics
        const shuffledTopics = filteredTopics.sort(() => Math.random() - 0.5);

        // Select the first 4 topics as featured topics
        const selectedFeaturedTopics = shuffledTopics.slice(0, 4);

        setFeaturedTopics(selectedFeaturedTopics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchFeaturedTopics();
  }, []); // The empty dependency array ensures that this effect runs once after the initial render

  return (
    <div>
      <Header />
      <Nav />
      <div className="container mx-auto mt-8 px-4 sm:px-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to PLuMS</h1>
        <p className="text-lg text-gray-600">Your personalized learning management system.</p>
        <Link href="/topics">
          <div className="btn-primary mt-4">Explore Topics</div>
        </Link>
      </div>

      <main className="container mx-auto flex flex-wrap justify-center gap-x-4 p-4 sm:p-8">
        <h2 className="text-2xl font-bold mb-4">Featured Topics</h2>
        <div className="container mx-auto flex flex-wrap justify-center gap-x-4 p-4 sm:p-8">
          {/* Render featured topics */}
          {featuredTopics.map((topic: TopicType) => (
            <div key={topic._id} className="mb-4 sm:mb-8">
              <Topic topic={topic} />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
