// components/ClearParentButton.tsx
import React, { useState, useEffect } from 'react';

interface ClearParentButtonProps {
  topicId: string;
}

const ClearParentButton: React.FC<ClearParentButtonProps> = ({ topicId }) => {
  const [cleared, setCleared] = useState<boolean>(false);

  const handleClearParent = async () => {
    try {
      const response = await fetch(`/api/topics/${topicId}/removeParent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error clearing parent:', response.statusText);
      }
    } catch (error) {
      console.error('Error clearing parent:', error);
    }
  };

  // You might want to perform additional actions or UI updates
  useEffect(() => {
    if (cleared) {
      // Do something after clearing parent (e.g., refresh data, update UI)
      console.log("Parent Cleared!");
    }
  }, [cleared]);

  return (
    <button
      type="button"
      className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
      onClick={handleClearParent}
    >
      Remove Child Topic
    </button>
  );
};

export default ClearParentButton;
