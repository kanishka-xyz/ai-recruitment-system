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
import API from "../services/api.js";
import { colors, mono } from "../theme/theme.js";

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
      const response = await API.post("/generateJD", { prompt });
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
      const parseResponse = await API.post("/parseJD", { jd: generatedJD });
      const parsedJD = parseResponse.data;
      const searchResponse = await API.post("/searchCandidates", parsedJD);
      navigate("/results", {
        state: { analysis: parsedJD, candidates: searchResponse.data },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch matching candidates.");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: colors.paper, minHeight: "100vh" }}>
      {/* Header */}
      <Box mb={3.5}>
        <Typography sx={eyebrow}>Case Intake · AI Draft</Typography>
        <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28, color: colors.ink, mt: 0.25 }}>
          Draft a Job Description
        </Typography>
        <Typography sx={{ color: colors.slate, fontSize: 14, mt: 0.5 }}>
          Describe the role in a sentence or two — the assistant drafts a full, professional brief.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT: Prompt */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.hairline}`, bgcolor: colors.paperRaised }}>
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AutoAwesomeRoundedIcon sx={{ color: colors.brass }} />
                <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: colors.ink }}>
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
                    bgcolor: colors.paper,
                    borderRadius: 2,
                    "&.Mui-focused fieldset": { borderColor: colors.brass },
                  },
                }}
              />

              <Box>
                <Typography sx={{ ...eyebrow, mb: 1, display: "block" }}>Quick Examples</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {quickPrompts.map((preset) => (
                    <Chip
                      key={preset}
                      label={preset}
                      size="small"
                      clickable
                      onClick={() => setPrompt(preset)}
                      sx={{
                        bgcolor: colors.paper,
                        color: colors.slate,
                        fontWeight: 600,
                        border: `1px solid ${colors.hairline}`,
                        "&:hover": { bgcolor: colors.brassSoft, color: colors.brassDark },
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
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeRoundedIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 1.5,
                  bgcolor: colors.ink,
                  fontWeight: 700,
                  "&:hover": { bgcolor: colors.inkSoft },
                }}
              >
                {loading ? "Generating…" : "Generate Description"}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT: Output */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: 3, border: `1px solid ${colors.hairline}`, bgcolor: colors.paperRaised, minHeight: 550 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              pb={2}
              sx={{ borderBottom: `1px solid ${colors.hairline}` }}
            >
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label="AI Generated Draft"
                sx={{ bgcolor: colors.brassSoft, color: colors.brassDark, fontWeight: 700 }}
              />

              <Stack direction="row" spacing={1}>
                <Tooltip title="Copy JD">
                  <span>
                    <IconButton onClick={handleCopy} disabled={!generatedJD} sx={{ border: `1px solid ${colors.hairlineStrong}` }}>
                      <ContentCopyRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Button
                  variant="outlined"
                  startIcon={<EditRoundedIcon />}
                  disabled={!generatedJD}
                  sx={{ borderRadius: 1.5, borderColor: colors.hairlineStrong, color: colors.ink, fontWeight: 700 }}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<SearchRoundedIcon />}
                  onClick={handleFindCandidates}
                  disabled={!generatedJD}
                  sx={{ bgcolor: colors.teal, borderRadius: 1.5, fontWeight: 700, "&:hover": { bgcolor: "#175A4B" } }}
                >
                  Find Candidates
                </Button>
              </Stack>
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 350, flexDirection: "column" }}>
                <CircularProgress sx={{ color: colors.brass }} />
                <Typography sx={{ mt: 2, color: colors.slate, fontFamily: mono, fontSize: 13 }}>
                  Drafting job description…
                </Typography>
              </Box>
            ) : generatedJD ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: colors.paper,
                  borderColor: colors.hairline,
                  borderRadius: 2,
                  maxHeight: 450,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  fontSize: 15,
                  color: colors.ink,
                }}
              >
                {generatedJD}
              </Paper>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 350, color: colors.slateFaint }}>
                <Typography align="center">
                  Your AI generated job description
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

const eyebrow = {
  fontFamily: mono,
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: colors.slateFaint,
};
