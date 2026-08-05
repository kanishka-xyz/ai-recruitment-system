import React from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Pushes search to left and actions to far right
        px: 3,
        py: 2,
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left Side: Search Input */}
      <TextField
        placeholder="Search candidates, JDs, skills..."
        variant="outlined"
        size="small"
        sx={{
          width: 350,
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            bgcolor: "#f8fafc",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#94a3b8" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Right Side: Create JD & Recruiter controls */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: "auto" }}>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#5046e5",
            color: "#ffffff",
            borderRadius: "20px",
            textTransform: "none",
            px: 2.5,
            py: 1,
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#4338ca",
            },
          }}
        >
          Create JD
        </Button>

        <Button
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            color: "#1e293b",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Recruiter
        </Button>
      </Stack>
    </Box>
  );
}

export default Header;