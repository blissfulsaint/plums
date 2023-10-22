// src/Card.tsx
import React from 'react';

interface CardProps {
  title: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ title, content }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg w-64 p-4 m-4">
      <div className="text-xl font-semibold mb-2">{title}</div>
      <div className="text-gray-600">{content}</div>
    </div>
  );
};

export default Card;

