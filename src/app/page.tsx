// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link';
import Topic from '../components/Topic';

// Add a type for the topic
type TopicType = {
  id: number;
  title: string;
  content: string;
  tags: number[];
  links: string[];
  parent_topic_id: number | null;
  completed: boolean;
};

export default function Home() {
  const [featuredTopics, setFeaturedTopics] = useState<TopicType[]>([]);

  useEffect(() => {
    // Function to fetch topics data and set random featured topics
    const fetchFeaturedTopics = async () => {
      try {
        const response = await fetch('/json/topics.json'); // Assuming the JSON file is in the /public/json directory
        const topicsData = await response.json();

        // Shuffle the array of topics
        const shuffledTopics = topicsData.sort(() => Math.random() - 0.5);

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
      <div className="container mx-auto mt-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to PLuMS</h1>
        <p className="text-lg text-gray-600">Your personalized learning management system.</p>
        <Link href="/topics">
          <div className="btn-primary mt-4">Explore Topics</div>
        </Link>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="container mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Featured Topics</h2>
          {/* Render featured topics */}
          {featuredTopics.map((topic) => (
            <Topic key={topic.id} topic={topic} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
