import React, { useState, useEffect } from 'react';
import CreatorCard from '../components/CreatorCard';
import { supabase } from '../client';
import { Link } from 'react-router-dom'; // Import Link for navigation

const ShowCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('creators')
          .select('*');

        if (error) {
          console.error('Error fetching creators:', error);
          setError('Failed to load creators. Please try again later.');
        } else {
          setCreators(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching creators:', err);
        setError('An unexpected error occurred. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">Loading creators...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Amazing Content Creators</h1>

      {/* Add Creator Button */}
      <div className="text-center mb-10">
        <Link
          to="/new" // Link to the AddCreator page
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
        >
          Add New Creator
        </Link>
      </div>

      {creators.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <p className="text-2xl text-gray-700 font-semibold mb-4">No content creators found!</p>
          <p className="text-lg text-gray-500">
            It looks like there are no creators in your database yet.
            Click the button above to add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowCreators;
