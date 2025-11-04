import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    department: user?.department || '',
    graduationYear: user?.graduationYear || '',
    bio: user?.bio || '',
    linkedinProfile: user?.linkedinProfile || '',
    isMentor: user?.isMentor || false,
    additionalEmail: user?.additionalEmail || '',
    emailVisibility: {
      primaryEmail: user?.emailVisibility?.primaryEmail || false,
      additionalEmail: user?.emailVisibility?.additionalEmail || false
    },
    currentJob: {
      title: user?.currentJob?.title || '',
      company: user?.currentJob?.company || '',
      location: user?.currentJob?.location || ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('currentJob.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        currentJob: {
          ...prev.currentJob,
          [field]: value
        }
      }));
    } else if (name.startsWith('emailVisibility.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emailVisibility: {
          ...prev.emailVisibility,
          [field]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Department</option>
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Biomedical Engineering">Biomedical Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
                <option value="Textile Technology">Textile Technology</option>
                <option value="Food Technology">Food Technology</option>
                <option value="Automobile Engineering">Automobile Engineering</option>
                <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                <option value="Production Engineering">Production Engineering</option>
                <option value="Industrial Engineering">Industrial Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div>
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="form-label">Primary Email (Login Email)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="form-input flex-1"
                    disabled
                    placeholder="Your login email"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailVisibility.primaryEmail"
                      checked={formData.emailVisibility.primaryEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Make visible to others</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="form-label">Additional Email (Optional)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="email"
                    name="additionalEmail"
                    value={formData.additionalEmail}
                    onChange={handleChange}
                    className="form-input flex-1"
                    placeholder="Enter additional email address"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailVisibility.additionalEmail"
                      checked={formData.emailVisibility.additionalEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={!formData.additionalEmail}
                    />
                    <span className="ml-2 text-sm text-gray-700">Make visible to others</span>
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  You can add an additional email address that others can use to contact you
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="form-input"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Current Job</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  name="currentJob.title"
                  value={formData.currentJob.title}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Company</label>
                <input
                  type="text"
                  name="currentJob.company"
                  value={formData.currentJob.company}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="currentJob.location"
                  value={formData.currentJob.location}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isMentor"
              name="isMentor"
              checked={formData.isMentor}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isMentor" className="ml-2 text-sm text-gray-700">
              I want to be a mentor
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;