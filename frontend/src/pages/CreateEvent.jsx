import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/apiService';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LinkIcon,
  ImageIcon,
  ArrowLeftIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    eventType: 'networking',
    maxAttendees: '',
    isVirtual: false,
    virtualLink: '',
    imageUrl: '',
    tags: [],
    registrationDeadline: ''
  });
  const [currentTag, setCurrentTag] = useState('');

  const eventTypes = [
    { value: 'networking', label: 'Networking' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'reunion', label: 'Reunion' },
    { value: 'career-fair', label: 'Career Fair' },
    { value: 'social', label: 'Social' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.eventDate || 
        !formData.eventTime || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.isVirtual && !formData.virtualLink) {
      toast.error('Virtual events require a meeting link');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare form data
      const eventData = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        registrationDeadline: formData.registrationDeadline || undefined
      };

      // Remove empty fields
      Object.keys(eventData).forEach(key => {
        if (eventData[key] === '' || eventData[key] === undefined) {
          delete eventData[key];
        }
      });

      const response = await eventService.createEvent(eventData);
      
      if (response.success) {
        toast.success('Event created successfully!');
        navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is alumni or admin
  if (user?.role !== 'alumni' && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-gray-500">Only alumni and administrators can create events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-1">
          Plan and organize an event for the alumni community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="form-input"
                required
              />
            </div>

            {/* Event Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your event..."
                className="form-input"
                required
              />
            </div>

            {/* Event Type */}
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="form-input"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Attendees */}
            <div>
              <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                id="maxAttendees"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                placeholder="Leave empty for no limit"
                min="1"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Date & Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Date */}
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Event Date *
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
                required
              />
            </div>

            {/* Event Time */}
            <div>
              <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Event Time *
              </label>
              <input
                type="time"
                id="eventTime"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Registration Deadline */}
            <div>
              <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline
              </label>
              <input
                type="date"
                id="registrationDeadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                max={formData.eventDate}
                className="form-input"
              />
            </div>

            {/* Virtual Event Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVirtual"
                name="isVirtual"
                checked={formData.isVirtual}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="isVirtual" className="text-sm font-medium text-gray-700">
                This is a virtual event
              </label>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                {formData.isVirtual ? 'Virtual Platform' : 'Location'} *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={formData.isVirtual ? "e.g., Zoom, Google Meet" : "Enter venue address"}
                className="form-input"
                required
              />
            </div>

            {/* Virtual Link */}
            {formData.isVirtual && (
              <div className="md:col-span-2">
                <label htmlFor="virtualLink" className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="h-4 w-4 inline mr-1" />
                  Meeting Link *
                </label>
                <input
                  type="url"
                  id="virtualLink"
                  name="virtualLink"
                  value={formData.virtualLink}
                  onChange={handleInputChange}
                  placeholder="https://zoom.us/j/..."
                  className="form-input"
                  required={formData.isVirtual}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          
          <div className="space-y-6">
            {/* Event Image */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="h-4 w-4 inline mr-1" />
                Event Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="form-input"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                  className="flex-1 form-input"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-primary-600 hover:text-primary-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;