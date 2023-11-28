import React from 'react';

interface TopicProps {
  topic: {
    id: number;
    title: string;
    content: string;
    tags: number[];
    links: string[];
    parent_topic_id: number | null;
    completed: boolean;
  };
}

const Topic: React.FC<TopicProps> = ({ topic }) => {
  const { id, title, content, tags, links, parent_topic_id, completed } = topic;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-96">
      <h2 className="text-xl font-semibold mb-2 text-gray-600">{title}</h2>
      <p className="text-gray-600 mb-4">{content}</p>

      <div className="flex items-center mb-4">
        <span className="text-gray-500 mr-2">Tags:</span>
        {tags.map((tag) => (
          <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-xs mr-2">
            Tag {tag}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <span className="text-gray-500 mr-2">Links:</span>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Link {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {parent_topic_id && (
        <div className="mb-4">
          <span className="text-gray-500 mr-2">Parent Topic:</span>
          <span className="text-blue-500 underline">Parent Topic</span>
          {/* You can link to the parent topic page if needed */}
          {/* <Link href={`/topics/${parent_topic_id}`}>
            <a className="text-blue-500 underline">Parent Topic</a>
          </Link> */}
        </div>
      )}

      <div>
        <span className="text-gray-500 mr-2">Completed:</span>
        <input type="checkbox" checked={completed} readOnly className="mr-2" />
      </div>
    </div>
  );
};

export default Topic;
