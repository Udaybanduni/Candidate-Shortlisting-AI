import { useState, useEffect } from 'react';
import api from '../services/api';
import { Briefcase, Code, Mail } from 'lucide-react';

const CandidateList = () => {
  const [candidates, setCandidates] = [useState([]), useState([])][0];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidates(response.data);
    } catch (err) {
      setError('Failed to fetch candidates. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading candidates...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Candidate Directory</h1>
      {candidates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No candidates found. Add some candidates to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Mail size={14} className="mr-1" />
                    {candidate.email}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-700 font-medium mb-2">
                  <Briefcase size={16} className="mr-2 text-primary-500" />
                  Experience: {candidate.experience} years
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{candidate.bio}</p>
              </div>

              <div>
                <div className="flex items-center text-gray-700 font-medium mb-2">
                  <Code size={16} className="mr-2 text-primary-500" />
                  Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium border border-blue-100">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 4 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                      +{candidate.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
