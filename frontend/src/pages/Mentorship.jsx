import { useState, useEffect } from 'react';
import { mentorshipService } from '../services/apiService';

const Mentorship = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMentorshipRequests();
  }, []);

  const loadMentorshipRequests = async () => {
    try {
      const response = await mentorshipService.getMentorshipRequests();
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error loading mentorship requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner mr-2"></div>
        <span>Loading mentorship data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Mentorship Center</h1>
        <p className="text-gray-600 mt-2">Connect with mentors or become one yourself.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Find a Mentor</h2>
          <p className="text-gray-600">Browse available mentors and request guidance.</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Become a Mentor</h2>
          <p className="text-gray-600">Share your expertise and help others grow.</p>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;