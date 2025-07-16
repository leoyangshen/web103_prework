import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client'; // Import the Supabase client

const AddCreator = () => {
  const navigate = useNavigate();

  // State to hold form data for the new creator
  const [newCreator, setNewCreator] = useState({
    name: '',
    url: '',
    imageURL: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCreator(prevCreator => ({
      ...prevCreator,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => { // Make handleSubmit an async function
    e.preventDefault();

    // Basic validation
    if (!newCreator.name || !newCreator.url || !newCreator.description) {
      alert('Please fill in all required fields (Name, URL, Description).');
      return;
    }

    try {
      // Insert the new creator data into the 'creators' table
      const { data, error } = await supabase
        .from('creators')
        .insert([newCreator]) // Insert the newCreator object
        .select(); // Select the inserted data back (optional, but useful for confirmation)

      if (error) {
        console.error('Error adding new creator:', error);
        alert('Failed to add creator. Please try again.');
      } else {
        console.log('New creator added:', data);
        alert('New Creator added successfully!');
        setNewCreator({ name: '', url: '', imageURL: '', description: '' }); // Clear form
        navigate('/'); // Navigate back to the home page after adding
      }
    } catch (err) {
      console.error('Unexpected error during creator addition:', err);
      alert('An unexpected error occurred while adding the creator.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Add New Content Creator</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newCreator.name}
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
            value={newCreator.url}
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
            value={newCreator.imageURL}
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
            value={newCreator.description}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Short description of content"
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Add Creator
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCreator;
