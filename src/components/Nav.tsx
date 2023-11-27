import React from 'react';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="bg-purple-700 p-4">
      <ul className="flex flex-wrap space-x-4 text-white">
        <li>
          <Link href="/">
            <div className="hover:text-gray-300">Home</div>
          </Link>
        </li>
        <li>
          <Link href="/topics">
            <div className="hover:text-gray-300">Topics</div>
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <div className="hover:text-gray-300">Profile</div>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <div className="hover:text-gray-300">About</div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
