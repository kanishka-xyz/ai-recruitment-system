import React from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import { useNavigate } from "react-router-dom";


function CandidateTable({
  candidates = [],
  analysis = {},
}) {
  const navigate = useNavigate();

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!candidates.length) {
    return (
      <Box
        sx={{
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
        >
          No candidates found.
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // RECOMMENDATION COLOR
  // =====================================================

  const getChipColor = (recommendation) => {
    switch (recommendation) {
      case "Highly Recommended":
        return "success";

      case "Recommended":
        return "primary";

      case "Consider":
        return "warning";

      default:
        return "error";
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        overflowX: "auto",
      }}
    >
      <Table
        sx={{ minWidth: 800 }}
        aria-label="candidate table"
      >

        {/* ================= TABLE HEADER ================= */}

        <TableHead
          sx={{
            bgcolor: "#F8FAFC",
          }}
        >
          <TableRow>

            <TableCell sx={{ fontWeight: 700 }}>
              Candidate
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Experience & Education
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Overall Fit
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Recommendation
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Action
            </TableCell>

          </TableRow>
        </TableHead>

        {/* ================= TABLE BODY ================= */}

        <TableBody>

          {candidates.map((candidate, index) => {

            // =================================================
            // SCORE
            // =================================================

            const score = Number(
              candidate.overall_score || 0
            );

            // =================================================
            // RESUME
            // =================================================

            const resume =
              candidate.resume || {};

            // =================================================
            // NAME
            // =================================================

            const name =
              resume.name ||
              resume.candidate ||
              resume.candidate_name ||
              resume.full_name ||
              resume.personal_info?.name ||
              "Unknown Candidate";

            // =================================================
            // ROLE
            // =================================================

            let role =
              resume.current_role ||
              resume.designation ||
              resume.job_title ||
              resume.title ||
              "";

            /*
              Some resumes contain experience as an array.

              If current_role is missing, take the most recent
              experience title.
            */

            if (
              !role &&
              Array.isArray(resume.experience) &&
              resume.experience.length > 0
            ) {
              role =
                resume.experience[0]?.title ||
                resume.experience[0]?.role ||
                resume.experience[0]?.designation ||
                "";
            }

            if (!role) {
              role = "Candidate";
            }

            // =================================================
            // EXPERIENCE
            // =================================================

            const experienceData =
              resume.experience_years ??
              resume.total_experience ??
              resume.experience;

            let experience = "N/A";

            if (
              typeof experienceData === "number"
            ) {
              experience =
                experienceData.toString();
            }

            else if (
              typeof experienceData === "string"
            ) {
              experience = experienceData;
            }

            else if (
              experienceData &&
              !Array.isArray(experienceData) &&
              typeof experienceData === "object"
            ) {
              experience =
                experienceData.years ??
                experienceData.total_years ??
                experienceData.duration ??
                "N/A";
            }

            /*
              If experience is an array but we don't have
              experience_years, don't print the array.
            */

            else if (
              Array.isArray(experienceData)
            ) {
              experience =
                resume.experience_years ??
                resume.total_experience ??
                "See profile";
            }

            // =================================================
            // EDUCATION
            // =================================================

            const educationData =
              resume.education;

            let education = "N/A";

            if (
              Array.isArray(educationData) &&
              educationData.length > 0
            ) {
              const first =
                educationData[0];

              if (
                typeof first === "string"
              ) {
                education = first;
              }

              else if (
                first &&
                typeof first === "object"
              ) {
                education =
                  first.degree ||
                  first.course ||
                  first.qualification ||
                  first.education ||
                  "N/A";
              }
            }

            else if (
              typeof educationData === "string"
            ) {
              education =
                educationData;
            }

            else if (
              educationData &&
              typeof educationData === "object"
            ) {
              education =
                educationData.degree ||
                educationData.course ||
                educationData.qualification ||
                "N/A";
            }

            // =================================================
            // ROW
            // =================================================

            return (
              <TableRow
                key={
                  resume._id ||
                  resume.email ||
                  `${name}-${index}`
                }
                hover
                sx={{
                  "&:last-child td, &:last-child th":
                    {
                      border: 0,
                    },
                }}
              >

                {/* ============================================
                    CANDIDATE
                ============================================ */}

                <TableCell>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                  >

                    <Avatar
                      sx={{
                        bgcolor: "#EEF2FF",
                        color: "#4338CA",
                        width: 42,
                        height: 42,
                      }}
                    >
                      <PersonRoundedIcon />
                    </Avatar>

                    <Box>

                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="#0F172A"
                      >
                        {name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {role}
                      </Typography>

                    </Box>

                  </Box>

                </TableCell>

                {/* ============================================
                    EXPERIENCE + EDUCATION
                ============================================ */}

                <TableCell>

                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={0.7}
                    alignItems="flex-start"
                  >

                    <Chip
                      size="small"
                      icon={
                        <WorkRoundedIcon />
                      }
                      label={
                        experience ===
                        "See profile"
                          ? "Experience available"
                          : experience === "N/A"
                          ? "Experience N/A"
                          : `${experience} Years`
                      }
                      variant="outlined"
                    />

                    <Tooltip
                      title={education}
                      placement="top"
                    >

                      <Chip
                        size="small"
                        icon={
                          <SchoolRoundedIcon />
                        }
                        label={
                          education.length > 24
                            ? `${education.substring(
                                0,
                                24
                              )}...`
                            : education
                        }
                        variant="outlined"
                      />

                    </Tooltip>

                  </Box>

                </TableCell>

                {/* ============================================
                    OVERALL FIT
                ============================================ */}

                <TableCell
                  sx={{
                    minWidth: 140,
                  }}
                >

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="primary"
                  >
                    {score.toFixed(0)}%
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(
                      Math.max(score, 0),
                      100
                    )}
                    sx={{
                      mt: 0.7,
                      height: 6,
                      borderRadius: 3,
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Contextual fit
                  </Typography>

                </TableCell>

                {/* ============================================
                    RECOMMENDATION
                ============================================ */}

                <TableCell>

                  <Chip
                    size="small"
                    label={
                      candidate.recommendation ||
                      "N/A"
                    }
                    color={getChipColor(
                      candidate.recommendation
                    )}
                    sx={{
                      fontWeight: 600,
                    }}
                  />

                  {candidate.confidence && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      Confidence:{" "}
                      {candidate.confidence}
                    </Typography>
                  )}

                </TableCell>

                {/* ============================================
                    VIEW
                ============================================ */}

                <TableCell align="center">

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={
                      <VisibilityRoundedIcon />
                    }
                    onClick={() => {

                      console.log(
                        "========== CANDIDATE =========="
                      );

                      console.log(
                        "Candidate:",
                        candidate
                      );

                      console.log(
                        "Resume:",
                        candidate.resume
                      );

                      console.log(
                        "JD Analysis:",
                        analysis
                      );

                      navigate(
                        "/candidate",
                        {
                          state: {
                            ...candidate,

                            // IMPORTANT:
                            // candidate page now gets JD
                            job_analysis:
                              analysis,
                          },
                        }
                      );
                    }}
                    sx={{
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    View Analysis
                  </Button>

                </TableCell>

              </TableRow>
            );
          })}

        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default CandidateTable;