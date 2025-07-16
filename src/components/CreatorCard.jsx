import React from 'react';
import { Link } from 'react-router-dom';

const CreatorCard = ({ creator }) => {
  // Ensure 'creator' prop is available and has necessary properties
  if (!creator) {
    return <div className="text-red-500 p-4">Error: Creator data missing.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center text-center">
      {/* Displaying the imageURL if available, otherwise a placeholder */}
      {creator.imageURL ? (
        <img
          src={creator.imageURL}
          alt={creator.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md mb-4"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/E0E7FF/4338CA?text=No+Image'; }}
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold mb-4 border-4 border-blue-400 shadow-md">
          No Image
        </div>
      )}

      {/* Displaying the creator's name */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{creator.name}</h3>

      {/* Displaying the creator's description */}
      {/* line-clamp-3 truncates description to 3 lines with ellipsis if too long */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{creator.description}</p>

      {/* Displaying a link to the creator's channel/page */}
      {creator.url && ( // Only render if URL exists
        <a
          href={creator.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium mb-4"
        >
          Visit Channel
        </a>
      )}
      {!creator.url && ( // Optional: display message if URL is missing
        <p className="text-gray-400 text-sm mb-4">No channel link available</p>
      )}

      <div className="mt-auto flex justify-center space-x-3 w-full">
        {/* Links to view and edit pages, using creator.id for dynamic URLs */}
        <Link
          to={`/creator/${creator.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ease-in-out shadow-md"
        >
          View Details
        </Link>
        <Link
          to={`/edit/${creator.id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ease-in-out shadow-md"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default CreatorCard;
