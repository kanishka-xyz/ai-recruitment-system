import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SearchSource from "../components/SearchSource";
import UploadJD from "../components/UploadJD";
import JDAnalysis from "../components/JDAnalysis";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [source, setSource] = useState("internal");
  const [platform, setPlatform] = useState("");
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleFind = async () => {
    if (!jd.trim()) {
      alert("Please paste a Job Description.");
      return;
    }

    try {
      // Parse JD
      const parseResponse = await API.post("/parseJD", {
        jd,
      });

      const parsedJD = parseResponse.data;

      setAnalysis(parsedJD);

      // Search Candidates
      const searchResponse = await API.post(
        "/searchCandidates",
        parsedJD
      );

      // Navigate to Results Page
      navigate("/results", {
        state: {
          analysis: parsedJD,
          candidates: searchResponse.data,
        },
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <Box sx={{ p: 3 }}>
          <SearchSource
            source={source}
            setSource={setSource}
            platform={platform}
            setPlatform={setPlatform}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "2.2fr 1fr",
              },
              gap: 3,
              mt: 3,
            }}
          >
            <UploadJD
              jd={jd}
              setJd={setJd}
              handleFind={handleFind}
            />

            <JDAnalysis analysis={analysis} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;