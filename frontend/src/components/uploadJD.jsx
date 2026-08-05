import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";

import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import API from "../services/api";

function UploadJD({ jd, setJd, handleFind }) {
  const [selectedFile, setSelectedFile] = useState(null);
   // Debugging line
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await API.post(
        "/uploadJD",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
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
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
      }}
    >
      {/* Heading */}
      <Typography
        fontSize={20}
        fontWeight={700}
        mb={2}
      >
        Upload Job Description
      </Typography>

      {/* Upload Section */}
      <Box
        sx={{
          border: "2px dashed #CBD5E1",
          borderRadius: 2,
          bgcolor: "#FAFBFF",
          textAlign: "center",
          py: 4,

          "&:hover": {
            borderColor: "#5B5CEB",
            bgcolor: "#F7F7FF",
          },
        }}
      >
        <CloudUploadRoundedIcon
          sx={{
            fontSize: 45,
            color: "#5B5CEB",
            mb: 1,
          }}
        />

        <Typography fontWeight={600}>
          Drag & Drop your Job Description
        </Typography>

        <Typography
          color="text.secondary"
          fontSize={13}
          mt={0.5}
          mb={2}
        >
          or browse from your computer
        </Typography>

        <Button
          variant="contained"
          component="label"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            bgcolor: "#5B5CEB",

            "&:hover": {
              bgcolor: "#4748D9",
            },
          }}
        >
          Browse File

          <input
            hidden
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </Button>

        {selectedFile && (
          <Typography
            mt={2}
            fontSize={14}
            color="success.main"
          >
            Selected: {selectedFile.name}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Paste JD */}
      <Typography
        fontWeight={600}
        mb={2}
      >
        Or Paste Job Description
      </Typography>

      <Box
        component="textarea"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste the complete Job Description here..."
        sx={{
          width: "100%",
          height: "59px",
          p: 2,
          border: "1px solid #D1D5DB",
          borderRadius: 2,
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1.8,
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          overflowY: "auto",

          "&:focus": {
            borderColor: "#5B5CEB",
            boxShadow: "0 0 0 3px rgba(91,92,235,0.15)",
          },
        }}
      />

      {/* Find Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<SearchRoundedIcon />}
          onClick={selectedFile ? handleFileUpload : handleFind}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: 16,
            fontWeight: 600,
            bgcolor: "#5B5CEB",

            "&:hover": {
              bgcolor: "#4748D9",
            },
          }}
        >
          Find Candidates
        </Button>
      </Box>
    </Paper>
  );
}

export default UploadJD;