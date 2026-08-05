import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateJDAIDraft() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedJD, setGeneratedJD] = useState("");

  const quickPrompts = [
    "Senior React Developer, 5+ years, Remote, Node.js",
    "Product Designer, Figma, Hybrid",
    "DevOps Lead, AWS, Kubernetes",
    "Java Backend Developer, Spring Boot, MySQL",
    "AI Engineer, Python, TensorFlow",
  ];

  const handleGenerateJD = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/generateJD", {
        prompt,
      });

      setGeneratedJD(response.data.job_description);
    } catch (err) {
      console.error(err);
      alert("Failed to generate Job Description.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedJD) return;
    navigator.clipboard.writeText(generatedJD);
    alert("Job Description copied.");
  };

  const handleFindCandidates = async () => {
    if (!generatedJD) return;

    try {
      // Step 1: Parse generated JD
      const parseResponse = await API.post("/parseJD", { jd: generatedJD });
      const parsedJD = parseResponse.data;

      // Step 2: Search Candidates
      const searchResponse = await API.post("/searchCandidates", parsedJD);

      // Step 3: Navigate to Results Page
      navigate("/results", {
        state: {
          analysis: parsedJD,
          candidates: searchResponse.data,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch matching candidates.");
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header Info */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="700" color="#0f172a">
          Create JD with AI
        </Typography>
        <Typography variant="body2" color="#64748b">
          Describe the role and AI will generate a professional Job Description.
        </Typography>
      </Box>

      {/* Main Grid Wrapper */}
      <Grid container spacing={3}>
        {/* LEFT COLUMN: Input Form */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
            }}
          >
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AutoAwesomeRoundedIcon sx={{ color: "#6366f1" }} />
                <Typography variant="subtitle1" fontWeight="700" color="#0f172a">
                  Prompt Assistant
                </Typography>
              </Stack>

              <TextField
                multiline
                rows={5}
                fullWidth
                placeholder="e.g. Need a Senior React developer with 5+ years experience, working remotely..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                  },
                }}
              />

              {/* Preset Chips */}
              <Box>
                <Typography
                  variant="caption"
                  fontWeight="600"
                  color="#64748b"
                  mb={1}
                  display="block"
                >
                  QUICK EXAMPLES
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {quickPrompts.map((preset) => (
                    <Chip
                      key={preset}
                      label={preset}
                      size="small"
                      clickable
                      onClick={() => setPrompt(preset)}
                      sx={{
                        bgcolor: "#f1f5f9",
                        color: "#334155",
                        fontWeight: 500,
                        "&:hover": { bgcolor: "#e2e8f0" },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Button
                variant="contained"
                disableElevation
                onClick={handleGenerateJD}
                disabled={loading || !prompt.trim()}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <AutoAwesomeRoundedIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "#4f46e5",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#4338ca" },
                }}
              >
                {loading ? "Generating..." : "Generate Description"}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: Generated Output */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
              minHeight: 550,
            }}
          >
            {/* Action Bar Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              pb={2}
              sx={{
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label="AI Generated Draft"
                color="primary"
                variant="outlined"
              />

              <Stack direction="row" spacing={1}>
                <Tooltip title="Copy JD">
                  <span>
                    <IconButton
                      onClick={handleCopy}
                      disabled={!generatedJD}
                      sx={{ border: "1px solid #cbd5e1" }}
                    >
                      <ContentCopyRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Button
                  variant="outlined"
                  startIcon={<EditRoundedIcon />}
                  disabled={!generatedJD}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<SearchRoundedIcon />}
                  onClick={handleFindCandidates}
                  disabled={!generatedJD}
                  sx={{
                    bgcolor: "#10b981",
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#059669",
                    },
                  }}
                >
                  Find Candidates
                </Button>
              </Stack>
            </Stack>

            {/* Generated Preview Content */}
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 350,
                  flexDirection: "column",
                }}
              >
                <CircularProgress />
                <Typography mt={2} color="#64748b">
                  AI is generating Job Description...
                </Typography>
              </Box>
            ) : generatedJD ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: "#fafafa",
                  borderRadius: 2,
                  maxHeight: 450,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  fontSize: 15,
                  color: "#1e293b",
                }}
              >
                {generatedJD}
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 350,
                  color: "#94a3b8",
                }}
              >
                <Typography align="center">
                  Your AI generated Job Description
                  <br />
                  will appear here.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}