import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CandidateList from './pages/CandidateList';
import AddCandidate from './pages/AddCandidate';
import MatchCandidates from './pages/MatchCandidates';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CandidateList />} />
          <Route path="add" element={<AddCandidate />} />
          <Route path="match" element={<MatchCandidates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
