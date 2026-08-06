import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Results from "./pages/Results.jsx";
import CandidateDetails from "./pages/candidateDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route
          path="/candidate"
          element={<CandidateDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;