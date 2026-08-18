import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Snackbar, Alert, Fade, Backdrop, CircularProgress, Typography } from "@mui/material";

import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import SearchSource from "../components/SearchSource.jsx";
import UploadJD from "../components/uploadJD.jsx";
import JDAnalysis from "../components/JDAnalysis.jsx";
import API from "../services/api.js";
import { colors, mono } from "../theme/theme.js";

function Dashboard() {
  const navigate = useNavigate();

  const [source, setSource] = useState("internal");
  const [platform, setPlatform] = useState("");
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const showToast = (message, severity = "info") => setNotification({ open: true, message, severity });
  const handleCloseToast = () => setNotification((prev) => ({ ...prev, open: false }));

  const handleFind = async () => {
    if (!jd.trim()) {
      showToast("Please provide or paste a Job Description.", "warning");
      return;
    }

    try {
      setLoading(true);
      setLoadingStage("Parsing job description & extracting skills…");

      const parseResponse = await API.post("/parseJD", { jd });
      const parsedJD = parseResponse.data;
      setAnalysis(parsedJD);

      setLoadingStage("Matching and ranking relevant candidates…");
      const searchResponse = await API.post("/searchCandidates", parsedJD);

      navigate("/results", {
        state: { analysis: parsedJD, candidates: searchResponse.data },
      });
    } catch (err) {
      console.error("Pipeline Error:", err);
      showToast(err.response?.data?.message || "Failed to process JD or find candidates.", "error");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.paper, color: colors.ink }}>
      <Sidebar />

      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        <Header />

        <Container
          maxWidth="xl"
          sx={{ py: { xs: 2.5, md: 4 }, px: { xs: 2, sm: 3, md: 4 }, display: "flex", flexDirection: "column", gap: 3.5 }}
        >
          {/* Source filter */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: colors.paperRaised,
              border: `1px solid ${colors.hairline}`,
            }}
          >
            <SearchSource source={source} setSource={setSource} platform={platform} setPlatform={setPlatform} />
          </Box>

          {/* Main grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "2fr 1.1fr" },
              gap: 3.5,
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                bgcolor: colors.paperRaised,
                borderRadius: 3,
                border: `1px solid ${colors.hairline}`,
                p: { xs: 2.5, md: 3.5 },
              }}
            >
              <UploadJD jd={jd} setJd={setJd} handleFind={handleFind} loading={loading} />
            </Box>

            <Box sx={{ position: { lg: "sticky" }, top: 90 }}>
              <JDAnalysis analysis={analysis} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Processing backdrop */}
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(4px)",
          bgcolor: "rgba(18, 21, 28, 0.72)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        open={loading}
      >
        <CircularProgress sx={{ color: colors.brass }} size={54} thickness={4} />
        <Typography sx={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.04em", color: "#F4F2EC" }}>
          {loadingStage}
        </Typography>
      </Backdrop>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseToast}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
