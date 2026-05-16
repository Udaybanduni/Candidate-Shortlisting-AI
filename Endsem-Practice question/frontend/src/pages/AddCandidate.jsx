import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: '',
    projects: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process skills string to array
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
      
      const payload = {
        ...formData,
        skills: skillsArray,
        experience: Number(formData.experience)
      };

      await api.post('/candidates', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while saving the candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Candidate</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated) *</label>
            <input
              type="text"
              name="skills"
              required
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              placeholder="React, Node.js, MongoDB, Python"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
            <input
              type="number"
              name="experience"
              required
              min="0"
              step="0.5"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-none"
              placeholder="A brief background about the candidate..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notable Projects</label>
            <textarea
              name="projects"
              rows="2"
              value={formData.projects}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-none"
              placeholder="E-commerce site, internal dashboard, etc."
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg mr-4 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-400 flex items-center"
            >
              {loading ? 'Saving...' : 'Save Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
