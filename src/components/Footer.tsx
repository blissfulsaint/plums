import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-purple-700 p-4 mt-8">
      <div className="container mx-auto text-white">
        <p className="text-center">
          &copy; {new Date().getFullYear()} PLuMS - Personalized Learning Management System
        </p>
      </div>
    </footer>
  );
};
