import { useState } from 'react';
import api from '../services/api';
import { Bot, Search, CheckCircle, AlertCircle } from 'lucide-react';

const MatchCandidates = () => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    preferredSkills: '',
    minExperience: '',
    jobDescription: ''
  });
  
  const [results, setResults] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getBasicMatch = async () => {
    setLoading(true);
    setError('');
    setAiResults(null);
    try {
      const reqSkills = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
      if (reqSkills.length === 0) {
        throw new Error('Please enter at least one required skill for basic matching.');
      }

      const prefSkills = formData.preferredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
      
      const response = await api.post('/match', {
        requiredSkills: reqSkills,
        preferredSkills: prefSkills,
        minExperience: formData.minExperience
      });
      
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to perform basic match');
    } finally {
      setLoading(false);
    }
  };

  const getAiMatch = async () => {
    setLoadingAi(true);
    setError('');
    setResults(null);
    try {
      const reqSkills = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
      
      const response = await api.post('/ai/shortlist', {
        requiredSkills: reqSkills,
        minExperience: formData.minExperience,
        jobDescription: formData.jobDescription
      });
      
      setAiResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to perform AI match. Check API key in backend .env');
    } finally {
      setLoadingAi(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'High Match': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium Match': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Job Requirement Matcher</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold mb-6">Enter Job Requirements</h2>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-start"><AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated) *</label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              placeholder="e.g., React, Node.js"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Skills</label>
            <input
              type="text"
              name="preferredSkills"
              value={formData.preferredSkills}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              placeholder="e.g., Docker, AWS"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Experience (Years)</label>
          <input
            type="number"
            name="minExperience"
            value={formData.minExperience}
            onChange={handleChange}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
            placeholder="e.g., 2"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description / AI Context (For AI Shortlisting)</label>
          <textarea
            name="jobDescription"
            rows="3"
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-none"
            placeholder="We are looking for a full stack developer capable of building end-to-end applications..."
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button
            onClick={getBasicMatch}
            disabled={loading || loadingAi}
            className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-white border-2 border-primary-600 text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
          >
            <Search size={18} className="mr-2" />
            {loading ? 'Calculating...' : 'Basic Logic Match'}
          </button>
          
          <button
            onClick={getAiMatch}
            disabled={loading || loadingAi}
            className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 shadow-md"
          >
            <Bot size={18} className="mr-2" />
            {loadingAi ? 'AI is Analyzing...' : 'AI Smart Shortlist'}
          </button>
        </div>
      </div>

      {/* Basic Logic Results */}
      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Basic Match Results</h2>
          {results.length === 0 ? (
            <p className="text-gray-500">No candidates available to match.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {results.map((candidate, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(candidate.matchCategory)}`}>
                        {candidate.matchCategory}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Exp: {candidate.experience} yrs • {candidate.email}</p>
                    <div className="text-sm text-gray-500">
                      Required Skills Matched: <span className="font-semibold text-gray-900">{candidate.reqMatchedCount} / {candidate.reqTotalCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg w-full md:w-48">
                    <div className="text-3xl font-black text-primary-600">{candidate.matchPercentage}%</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Match Score</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${candidate.matchPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Results */}
      {aiResults && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 border-b pb-2">
            <Bot size={28} className="text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">AI Recommendations</h2>
          </div>
          
          {(!Array.isArray(aiResults) || aiResults.length === 0) ? (
            <p className="text-gray-500">The AI could not find suitable matches or returned an unexpected format.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {aiResults.map((rec, idx) => (
                <div key={idx} className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border border-purple-100 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white border border-purple-200 rounded-lg p-4 w-24 h-24">
                      <div className="text-sm text-purple-600 font-bold uppercase tracking-wider mb-1">Rank</div>
                      <div className="text-4xl font-black text-gray-900">#{rec.rank}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{rec.name}</h3>
                        {rec.score && (
                          <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                            Score: {rec.score}
                          </div>
                        )}
                      </div>
                      <div className="bg-white bg-opacity-60 p-4 rounded-lg mt-3 text-gray-800">
                        <h4 className="flex items-center text-sm font-bold text-purple-800 mb-2 uppercase tracking-wide">
                          <CheckCircle size={16} className="mr-1.5" /> AI Reasoning
                        </h4>
                        <p className="leading-relaxed">{rec.reasoning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchCandidates;
