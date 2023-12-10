import React, { useState, useEffect, useRef } from 'react';

interface ParentTopic {
  _id: string;
  title: string;
  // Add other properties if needed
}

interface AssignParentButtonProps {
  topicId: string;
}

const AssignParentButton: React.FC<AssignParentButtonProps> = ({ topicId }) => {
  const [parentTopics, setParentTopics] = useState<ParentTopic[]>([]);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch parent topics
    const fetchParentTopics = async () => {
      try {
        const response = await fetch('/api/topics/parentTopics');
        const parentTopicsData: ParentTopic[] = await response.json();

        // Filter out the current topic from the list
        const filteredParentTopics = parentTopicsData.filter((parent) => parent._id !== topicId);

        setParentTopics(filteredParentTopics);
      } catch (error) {
        console.error('Error fetching parent topics:', error);
      }
    };

    fetchParentTopics();
  }, [topicId]);

  useEffect(() => {
    // Add event listener to detect clicks outside of the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleParentSelect = (parentId: string) => {
    setSelectedParent(parentId);
  };

  const handleAssignParent = async () => {
    if (selectedParent) {
      try {
        const response = await fetch(`/api/topics/${topicId}/assignParent`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ parent_topic_id: selectedParent }),
        });

        if (response.ok) {
          // Reload the page after a successful assignment
            window.location.reload();
        } else {
          console.error('Error assigning parent:', response.statusText);
        }
      } catch (error) {
        console.error('Error assigning parent:', error);
      }
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={showDropdown}
        >
          Assign Parent
        </button>
      </div>

      {/* Dropdown menu */}
      {showDropdown && parentTopics.length > 0 && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {parentTopics.map((parent) => (
              <div
                key={parent._id}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                role="menuitem"
                onClick={() => handleParentSelect(parent._id)}
              >
                {parent.title}
              </div>
            ))}
          </div>
          {selectedParent && (
            <button
              onClick={handleAssignParent}
              className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-blue-100"
            >
              Assign
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignParentButton;
