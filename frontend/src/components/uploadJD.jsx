import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Paper, Button, Divider } from "@mui/material";

import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import API from "../services/api";
import { colors, mono } from "../theme/theme.js";

function UploadJD({ jd, setJd, handleFind }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await API.post("/uploadJD", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/results", {
        state: {
          analysis: response.data.job_description,
          candidates: response.data.candidates,
        },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to upload Job Description.");
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 0, borderRadius: 0, bgcolor: "transparent" }}>
      {/* Heading */}
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 2.5 }}>
        <Box>
          <Typography sx={eyebrow}>Case Intake</Typography>
          <Typography sx={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: colors.ink }}>
            Open a New Requisition
          </Typography>
        </Box>
      </Box>

      {/* Upload dropzone */}
      <Box
        sx={{
          border: `1.5px dashed ${colors.hairlineStrong}`,
          borderRadius: 2,
          bgcolor: colors.paper,
          textAlign: "center",
          py: 4.5,
          transition: "all 0.15s ease",
          "&:hover": { borderColor: colors.brass, bgcolor: colors.brassSoft },
        }}
      >
        <CloudUploadRoundedIcon sx={{ fontSize: 40, color: colors.brassDark, mb: 1 }} />

        <Typography sx={{ fontWeight: 700, color: colors.ink }}>
          Drag &amp; drop the job description
        </Typography>

        <Typography sx={{ color: colors.slate, fontSize: 13, mt: 0.5, mb: 2 }}>
          PDF format · or browse from your computer
        </Typography>

        <Button
          variant="contained"
          component="label"
          disableElevation
          sx={{
            borderRadius: 1.5,
            px: 3,
            bgcolor: colors.ink,
            fontWeight: 700,
            "&:hover": { bgcolor: colors.inkSoft },
          }}
        >
          Browse File
          <input hidden type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} />
        </Button>

        {selectedFile && (
          <Typography sx={{ mt: 2, fontSize: 13, fontFamily: mono, color: colors.teal }}>
            ✓ {selectedFile.name}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3, borderColor: colors.hairline }} />

      {/* Paste JD */}
      <Typography sx={{ fontWeight: 700, mb: 1.5, color: colors.ink, fontSize: 14 }}>
        Or paste the job description directly
      </Typography>

      <Box
        component="textarea"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste the complete job description here…"
        sx={{
          width: "100%",
          minHeight: 140,
          p: 2,
          border: `1px solid ${colors.hairline}`,
          borderRadius: 2,
          fontSize: "14px",
          fontFamily: "'Manrope', sans-serif",
          lineHeight: 1.8,
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          overflowY: "auto",
          color: colors.ink,
          "&:focus": {
            borderColor: colors.brass,
            boxShadow: `0 0 0 3px ${colors.brassSoft}`,
          },
        }}
      />

      {/* Find button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3.5 }}>
        <Button
          variant="contained"
          disableElevation
          size="large"
          startIcon={<SearchRoundedIcon />}
          onClick={selectedFile ? handleFileUpload : handleFind}
          sx={{
            px: 5,
            py: 1.4,
            borderRadius: 1.5,
            fontSize: 15.5,
            fontWeight: 700,
            bgcolor: colors.brass,
            color: "#1B1400",
            "&:hover": { bgcolor: colors.brassDark, color: "#fff" },
          }}
        >
          Find Candidates
        </Button>
      </Box>
    </Paper>
  );
}

const eyebrow = {
  fontFamily: mono,
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: colors.slateFaint,
  mb: 0.5,
  display: "block",
};

export default UploadJD;
