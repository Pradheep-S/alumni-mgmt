import { useState, useEffect } from 'react';
import { userService } from '../services/apiService';
import { 
  SearchIcon, 
  FilterIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  MailIcon,
  LinkedinIcon,
  StarIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    graduationYear: '',
    mentorsOnly: false
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadAlumni();
  }, [pagination.page, filters, searchTerm]);

  const loadAlumni = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      const response = await userService.getUsers(params);
      setAlumni(response.data.users);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages
      }));
    } catch (error) {
      console.error('Error loading alumni:', error);
      toast.error('Error loading alumni directory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadAlumni();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      graduationYear: '',
      mentorsOnly: false
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Alumni Directory</h1>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, or location..."
                className="pl-10 form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            <select
              className="form-input w-auto"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Engineering">Engineering</option>
              <option value="Medicine">Medicine</option>
            </select>

            <select
              className="form-input w-auto"
              value={filters.graduationYear}
              onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={filters.mentorsOnly}
                onChange={(e) => handleFilterChange('mentorsOnly', e.target.checked)}
              />
              Mentors Only
            </label>

            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner mr-2"></div>
            <span>Loading alumni...</span>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {alumni.length} of {pagination.total} alumni
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((person) => (
                <div key={person._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {person.firstName[0]}{person.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {person.firstName} {person.lastName}
                      </h3>
                      {person.isMentor && (
                        <div className="flex items-center mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-yellow-600 font-medium">Mentor</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {person.currentJob?.title && person.currentJob?.company && (
                      <div className="flex items-center text-sm text-gray-600">
                        <BriefcaseIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {person.currentJob.title} at {person.currentJob.company}
                        </span>
                      </div>
                    )}

                    {person.graduationYear && person.department && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="truncate">
                          Class of {person.graduationYear} • {person.department}
                        </span>
                      </div>
                    )}

                    {person.currentJob?.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{person.currentJob.location}</span>
                      </div>
                    )}
                  </div>

                  {person.bio && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {person.bio}
                    </p>
                  )}

                  <div className="mt-4 flex items-center space-x-3">
                    <button className="btn-primary text-sm">
                      <MailIcon className="h-4 w-4 mr-1" />
                      Connect
                    </button>
                    {person.linkedinProfile && (
                      <a
                        href={person.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        <LinkedinIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {alumni.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No alumni found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;