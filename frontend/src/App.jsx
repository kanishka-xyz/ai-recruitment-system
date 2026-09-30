import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Results from "./pages/Results.jsx";
import CandidateDetails from "./pages/CandidateDetails.jsx";
import CandidateProfile from "./pages/CandidateProfile.jsx";
import Candidates from "./pages/Candidates.jsx";
import ResumeDatabase from "./pages/ResumeDatabase.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Search Results */}
        <Route
          path="/results"
          element={<Results />}
        />

        {/* Candidate Profile */}
        <Route
          path="/candidate"
          element={<CandidateProfile />}
        />

        {/* AI Candidate Evaluation */}
        <Route
          path="/candidate-evaluation"
          element={<CandidateDetails />}
        />

        {/* Candidates */}
        <Route
          path="/candidates"
          element={<Candidates />}
        />

        {/* Resume Database */}
        <Route
          path="/resume-database"
          element={<ResumeDatabase />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;