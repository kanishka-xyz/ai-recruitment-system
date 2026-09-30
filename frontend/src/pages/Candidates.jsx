import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import api from "../services/api.js";
import { colors } from "../theme/theme.js";


/* =========================================================
   HELPERS
========================================================= */

const getCandidateName = (candidate) => {
  return (
    candidate.candidate_name ||
    candidate.name ||
    candidate.full_name ||
    "Unknown Candidate"
  );
};


const getCandidateRole = (candidate) => {
  return (
    candidate.current_role ||
    candidate.role ||
    candidate.job_title ||
    "Candidate"
  );
};


const getExperience = (candidate) => {
  const experience =
    candidate.total_experience_years ??
    candidate.experience_years ??
    candidate.experience ??
    0;

  return experience;
};


const getSkills = (candidate) => {
  const skills =
    candidate.skills ||
    candidate.technical_skills ||
    [];

  if (Array.isArray(skills)) {
    return skills;
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};


/* =========================================================
   INITIALS
========================================================= */

const getInitials = (name) => {
  if (!name) return "C";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};


/* =========================================================
   CANDIDATE CARD
========================================================= */

function CandidateCard({ candidate, onViewProfile }) {
  const name = getCandidateName(candidate);
  const role = getCandidateRole(candidate);
  const experience = getExperience(candidate);
  const skills = getSkills(candidate);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E3E7EC",
        borderRadius: 3,
        backgroundColor: "#FFFFFF",

        transition: "all 0.2s ease",

        "&:hover": {
          borderColor: colors.brass,
          boxShadow: "0 12px 30px rgba(20, 30, 45, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ p: 3 }}>

        {/* =================================================
            TOP
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >

          {/* Candidate identity */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 0,
            }}
          >

            {/* Avatar */}

            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "50%",

                background:
                  "linear-gradient(135deg, #E8EEF5 0%, #D8E2EE 100%)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: "#55718F",

                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                {getInitials(name)}
              </Typography>
            </Box>


            {/* Name + role */}

            <Box sx={{ minWidth: 0 }}>

              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 750,
                  color: "#18212B",
                  lineHeight: 1.2,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </Typography>

              <Typography
                sx={{
                  mt: 0.6,
                  fontSize: 14,
                  color: "#657180",
                }}
              >
                {role}
              </Typography>

            </Box>

          </Box>


          {/* View Profile */}

          <Button
            variant="contained"
            onClick={() => onViewProfile(candidate)}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              flexShrink: 0,

              textTransform: "none",
              fontWeight: 700,

              px: 2.2,
              py: 1.1,

              borderRadius: 2,

              backgroundColor: colors.brass,

              boxShadow: "none",

              "&:hover": {
                backgroundColor: colors.brassDark,
                boxShadow: "none",
              },
            }}
          >
            View Profile
          </Button>

        </Box>


        {/* =================================================
            INFO ROW
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            mt: 2.5,
          }}
        >

          <Chip
            icon={<WorkOutlineRoundedIcon />}
            label={`${experience} ${
              Number(experience) === 1 ? "year" : "years"
            } experience`}
            size="small"
            sx={{
              backgroundColor: "#F4F6F8",
              color: "#46515D",
              fontWeight: 600,

              "& .MuiChip-icon": {
                fontSize: 17,
                color: "#6C7C8D",
              },
            }}
          />


          {candidate.education && (
            <Chip
              icon={<SchoolRoundedIcon />}
              label="Education available"
              size="small"
              sx={{
                backgroundColor: "#F4F6F8",
                color: "#46515D",
                fontWeight: 600,

                "& .MuiChip-icon": {
                  fontSize: 17,
                  color: "#6C7C8D",
                },
              }}
            />
          )}


          {candidate.resume_file && (
            <Chip
              icon={<DescriptionRoundedIcon />}
              label="Resume"
              size="small"
              sx={{
                backgroundColor: "#F4F6F8",
                color: "#46515D",
                fontWeight: 600,

                "& .MuiChip-icon": {
                  fontSize: 17,
                  color: "#6C7C8D",
                },
              }}
            />
          )}

        </Box>


        {/* =================================================
            SKILLS
        ================================================= */}

        {skills.length > 0 && (
          <Box sx={{ mt: 2.5 }}>

            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 800,
                color: "#8A95A1",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Skills
            </Typography>

            <Stack
              direction="row"
              spacing={0.7}
              useFlexGap
              flexWrap="wrap"
            >
              {skills.slice(0, 10).map((skill, index) => (
                <Chip
                  key={`${skill}-${index}`}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "#D6DDE5",
                    backgroundColor: "#FAFBFC",
                    color: "#394653",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
              ))}

              {skills.length > 10 && (
                <Chip
                  label={`+${skills.length - 10} more`}
                  size="small"
                  sx={{
                    backgroundColor: "#EEF2F6",
                    color: "#607080",
                    fontWeight: 700,
                  }}
                />
              )}

            </Stack>

          </Box>
        )}


        {/* =================================================
            RESUME FILE
        ================================================= */}

        {candidate.resume_file && (
          <Box
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: "1px solid #EDF0F3",

              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DescriptionRoundedIcon
              sx={{
                fontSize: 18,
                color: "#8995A2",
              }}
            />

            <Typography
              sx={{
                fontSize: 12.5,
                color: "#687684",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {candidate.resume_file}
            </Typography>

          </Box>
        )}

      </Box>
    </Card>
  );
}


/* =========================================================
   MAIN PAGE
========================================================= */

function Candidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =======================================================
     FETCH CANDIDATES
  ======================================================= */

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/internalDatabase");

      const data = response.data;

      /*
        Backend may return:

        {
          candidates: [...]
        }

        OR directly:

        [...]
      */

      const list = Array.isArray(data)
        ? data
        : data.candidates ||
          data.resumes ||
          data.data ||
          [];

      setCandidates(list);

    } catch (err) {
      console.error("Failed to load candidates:", err);

      setError(
        err?.response?.data?.detail ||
        "Unable to load candidates from the internal database."
      );

      setCandidates([]);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadCandidates();
  }, []);


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredCandidates = useMemo(() => {

    const query = search.trim().toLowerCase();

    if (!query) {
      return candidates;
    }

    return candidates.filter((candidate) => {

      const name =
        getCandidateName(candidate).toLowerCase();

      const role =
        getCandidateRole(candidate).toLowerCase();

      const skills =
        getSkills(candidate)
          .join(" ")
          .toLowerCase();

      const company =
        String(candidate.current_company || "")
          .toLowerCase();

      const location =
        String(candidate.location || "")
          .toLowerCase();

      return (
        name.includes(query) ||
        role.includes(query) ||
        skills.includes(query) ||
        company.includes(query) ||
        location.includes(query)
      );
    });

  }, [candidates, search]);


  /* =======================================================
     OPEN PROFILE
  ======================================================= */

  const handleViewProfile = (candidate) => {

    navigate("/candidate", {
      state: candidate,
    });

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F7F8FA",
        py: 4,
      }}
    >

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            md: 4,
          },
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 3,
          }}
        >

          <Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 27,
                  md: 32,
                },
                fontWeight: 800,
                color: "#18212B",
                letterSpacing: "-0.02em",
              }}
            >
              Candidates
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 14,
                color: "#74808C",
              }}
            >
              Browse candidates available in your internal resume database.
            </Typography>

          </Box>


          {/* =================================================
              NAVIGATION + REFRESH
          ================================================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              flexWrap: "wrap",
            }}
          >

            {/* Resume Database */}

            <Button
              variant="outlined"
              startIcon={<FolderRoundedIcon />}
              onClick={() => navigate("/resume-database")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                borderColor: "#DCE2E8",
                color: "#46515D",
                backgroundColor: "#FFFFFF",

                "&:hover": {
                  borderColor: colors.brass,
                  backgroundColor: "#FAFBFC",
                },
              }}
            >
              Resume Database
            </Button>


            {/* Dashboard */}

            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                borderColor: "#DCE2E8",
                color: "#46515D",
                backgroundColor: "#FFFFFF",

                "&:hover": {
                  borderColor: colors.brass,
                  backgroundColor: "#FAFBFC",
                },
              }}
            >
              Dashboard
            </Button>


            {/* Refresh */}

            <Tooltip title="Refresh candidates">

              <IconButton
                onClick={loadCandidates}
                disabled={loading}
                sx={{
                  width: 42,
                  height: 42,

                  border: "1px solid #DCE2E8",
                  backgroundColor: "#FFFFFF",

                  "&:hover": {
                    backgroundColor: "#F4F6F8",
                  },
                }}
              >
                <RefreshRoundedIcon />
              </IconButton>

            </Tooltip>

          </Box>

        </Box>


        {/* =================================================
            SEARCH + STATS
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "stretch",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 3,
          }}
        >

          {/* Search */}

          <TextField
            fullWidth
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, role, skill, company or location..."
            variant="outlined"

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{
                      color: "#8A96A3",
                    }}
                  />
                </InputAdornment>
              ),
            }}

            sx={{
              maxWidth: {
                md: 650,
              },

              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FFFFFF",
                borderRadius: 2.5,

                "& fieldset": {
                  borderColor: "#DDE3E9",
                },

                "&:hover fieldset": {
                  borderColor: "#C7D0DA",
                },

                "&.Mui-focused fieldset": {
                  borderColor: colors.brass,
                },
              },
            }}
          />


          {/* Count */}

          <Box
            sx={{
              px: 2,
              py: 1.25,

              borderRadius: 2,

              backgroundColor: "#FFFFFF",
              border: "1px solid #DDE3E9",

              minWidth: 130,
            }}
          >

            <Typography
              sx={{
                fontSize: 11,
                color: "#8A95A1",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Candidates
            </Typography>

            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: "#26313C",
              }}
            >
              {filteredCandidates.length}
            </Typography>

          </Box>

        </Box>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Card
            elevation={0}
            sx={{
              p: 3,
              mb: 3,

              borderRadius: 3,
              border: "1px solid #E6C9C9",

              backgroundColor: "#FFF9F9",
            }}
          >

            <Typography
              sx={{
                color: "#A64B4B",
                fontWeight: 600,
              }}
            >
              {error}
            </Typography>

          </Card>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <Box
            sx={{
              minHeight: 300,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <CircularProgress
              sx={{
                color: colors.brass,
              }}
            />

          </Box>
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredCandidates.length === 0 && (

            <Card
              elevation={0}
              sx={{
                p: 6,

                borderRadius: 3,

                border: "1px solid #E0E5EA",

                backgroundColor: "#FFFFFF",

                textAlign: "center",
              }}
            >

              <PersonRoundedIcon
                sx={{
                  fontSize: 55,
                  color: "#AAB5C0",
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 750,
                  color: "#26313C",
                }}
              >
                No candidates found
              </Typography>

              <Typography
                sx={{
                  mt: 0.7,
                  color: "#7B8793",
                  fontSize: 14,
                }}
              >
                Try another search or add resumes to the internal database.
              </Typography>

            </Card>
          )}


        {/* =================================================
            CANDIDATE LIST
        ================================================= */}

        {!loading &&
          filteredCandidates.length > 0 && (

            <Stack spacing={2}>

              {filteredCandidates.map((candidate, index) => (

                <CandidateCard
                  key={
                    candidate._id ||
                    candidate.id ||
                    candidate.file_hash ||
                    index
                  }
                  candidate={candidate}
                  onViewProfile={handleViewProfile}
                />

              ))}

            </Stack>

          )}

      </Container>

    </Box>
  );
}


export default Candidates;
