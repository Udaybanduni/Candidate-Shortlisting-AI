import axios from 'axios';

const api = axios.create({
  // Hardcoded for production Vercel deployment
  baseURL: 'https://candidate-shortlisting-ai.onrender.com/api',
});

export default api;
