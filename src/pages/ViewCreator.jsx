import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client'; // Import the Supabase client

const ViewCreator = () => {
  const { id } = useParams(); // Get the ID from the URL (e.g., '1' from /creator/1)
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null); // State to store the single creator's data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage any errors

  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the specific creator from the 'creators' table by ID
        const { data, error } = await supabase
          .from('creators')
          .select('*') // Select all columns
          .eq('id', id) // Filter by the 'id' column matching the URL parameter
          .single(); // Expecting only one record

        if (error) {
          console.error('Error fetching creator:', error);
          // If the error is due to no rows found (common for deleted items)
          if (error.code === 'PGRST116') { // Supabase specific code for no rows found
             setError('Creator not found. It might have been deleted.');
          } else {
             setError('Failed to load creator details. Please try again later.');
          }
          setCreator(null);
        } else if (data) {
          setCreator(data); // Set the fetched creator data
        } else {
          // If no error but no data (e.g., ID doesn't exist, but no specific error code)
          setCreator(null);
          setError('Creator not found.');
        }
      } catch (err) {
        console.error('Unexpected error fetching creator:', err);
        setError('An unexpected error occurred. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreator();
    } else {
      setLoading(false);
      setError('No creator ID provided in the URL.');
    }
  }, [id]); // Dependency array: re-run if the 'id' URL parameter changes

  // Function to handle deletion
  const handleDelete = async () => {
    // Using window.confirm for now as per previous instruction, but a custom modal is better
    if (window.confirm(`Are you sure you want to delete ${creator.name}? This action cannot be undone.`)) {
      try {
        // Perform the delete operation in Supabase
        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', id); // Delete the record matching the ID

        if (error) {
          console.error('Error deleting creator:', error);
          alert('Failed to delete creator. Please try again.');
        } else {
          alert('Creator deleted successfully!');
          navigate('/'); // Navigate back to the home page after successful deletion
        }
      } catch (err) {
        console.error('Unexpected error during deletion:', err);
        alert('An unexpected error occurred during deletion.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">Loading creator details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-600 font-semibold">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Back to All Creators</Link>
      </div>
    );
  }

  if (!creator) {
    // This case should ideally be covered by 'error' if ID is invalid,
    // but acts as a final safeguard if data is null without an explicit error.
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">Creator details not available.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Back to All Creators</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full text-center">
        {creator.imageURL ? (
          <img
            src={creator.imageURL}
            alt={creator.name}
            className="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg mx-auto mb-6"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/AEC6CF/FFFFFF?text=No+Image'; }}
          />
        ) : (
          <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-semibold mb-6 border-4 border-blue-500 shadow-lg mx-auto">
            No Image
          </div>
        )}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{creator.name}</h1>
        <p className="text-lg text-gray-700 mb-6">{creator.description}</p>
        {creator.url && (
          <a
            href={creator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline text-xl font-semibold transition duration-300 ease-in-out"
          >
            Visit Channel/Page
          </a>
        )}
        {!creator.url && (
          <p className="text-gray-400 text-base mt-2">No channel link available</p>
        )}

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to={`/edit/${creator.id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out shadow-md"
          >
            Edit Creator
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out shadow-md"
          >
            Delete Creator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCreator;
