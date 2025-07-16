import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client'; // Import the Supabase client

const EditCreator = () => {
  const { id } = useParams(); // Get the ID from the URL (e.g., '1' from /edit/1)
  const navigate = useNavigate();

  // State to hold form data
  const [creator, setCreator] = useState({
    name: '',
    url: '',
    imageURL: '',
    description: ''
  });
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage any errors

  // Effect to fetch creator data when the component mounts or ID changes
  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching creator for edit:', error);
          setError('Failed to load creator for editing. Creator might not exist.');
          setCreator(null);
        } else if (data) {
          setCreator(data); // Pre-populate the form with fetched data
        } else {
          setCreator(null);
          setError('Creator not found for editing.');
        }
      } catch (err) {
        console.error('Unexpected error fetching creator for edit:', err);
        setError('An unexpected error occurred. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreator();
    } else {
      setLoading(false);
      setError('No creator ID provided for editing.');
    }
  }, [id]); // Re-run effect if ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreator(prevCreator => ({
      ...prevCreator,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => { // Make handleSubmit an async function
    e.preventDefault();

    // Basic validation
    if (!creator.name || !creator.url || !creator.description) {
      alert('Please fill in all required fields (Name, URL, Description).');
      return;
    }

    try {
      // Update the content creator in the 'creators' table
      const { data, error } = await supabase
        .from('creators')
        .update(creator) // Pass the updated creator object
        .eq('id', id)    // Specify which row to update by ID
        .select();       // Optional: returns the updated data

      if (error) {
        console.error('Error updating creator:', error);
        alert('Failed to update creator. Please try again.');
      } else {
        console.log('Creator updated:', data);
        alert('Creator updated successfully!');
        navigate(`/creator/${id}`); // Navigate back to the view page after update
      }
    } catch (err) {
      console.error('Unexpected error during creator update:', err);
      alert('An unexpected error occurred while updating the creator.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">Loading creator for editing...</p>
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
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">Creator not found or data is unavailable.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Back to All Creators</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Edit Content Creator</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={creator.name}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Creator Name"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="url" className="block text-gray-700 text-lg font-semibold mb-2">URL:</label>
          <input
            type="url" // Use type="url" for better validation
            id="url"
            name="url"
            value={creator.url}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Channel or Page URL"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="imageURL" className="block text-gray-700 text-lg font-semibold mb-2">Image URL (Optional):</label>
          <input
            type="url" // Use type="url"
            id="imageURL"
            name="imageURL"
            value={creator.imageURL}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Image URL"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="description" className="block text-gray-700 text-lg font-semibold mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="6"
            value={creator.description}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Short description of content"
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Update Creator
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCreator;
