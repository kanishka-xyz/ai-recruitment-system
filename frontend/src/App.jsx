import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import CandidateDetails from "./pages/CandidateDetails";

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