import React from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
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

import ScoreSeal from "./ScoreSeal.jsx";
import { colors, mono, scoreTier } from "../theme/theme.js";

function CandidateTable({ candidates = [], analysis = {} }) {
  const navigate = useNavigate();

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!candidates.length) {
    return (
      <Box sx={{ py: 7, textAlign: "center" }}>
        <Typography sx={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.08em", color: colors.slateFaint }}>
          NO MATCHES FOUND
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, color: colors.ink, fontFamily: "'Fraunces', serif" }}>
          No candidates in this case file yet.
        </Typography>
      </Box>
    );
  }

  const getChipStyle = (recommendation) => {
    switch (recommendation) {
      case "Highly Recommended":
        return { bgcolor: colors.tealSoft, color: colors.teal };
      case "Recommended":
        return { bgcolor: colors.brassSoft, color: colors.brassDark };
      case "Consider":
        return { bgcolor: colors.amberSoft, color: colors.amber };
      default:
        return { bgcolor: colors.crimsonSoft, color: colors.crimson };
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: 3, border: `1px solid ${colors.hairline}`, overflowX: "auto" }}
    >
      <Table sx={{ minWidth: 820 }} aria-label="candidate table">
        <TableHead sx={{ bgcolor: colors.paper }}>
          <TableRow>
            <TableCell sx={headCell}>Candidate</TableCell>
            <TableCell sx={headCell}>Experience &amp; Education</TableCell>
            <TableCell sx={{ ...headCell, textAlign: "center" }}>Fit Score</TableCell>
            <TableCell sx={headCell}>Recommendation</TableCell>
            <TableCell sx={{ ...headCell, textAlign: "center" }}>Dossier</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {candidates.map((candidate, index) => {
            const score = Number(candidate.overall_score || 0);
            const resume = candidate.resume || {};

            const name =
              resume.name ||
              resume.candidate ||
              resume.candidate_name ||
              resume.full_name ||
              resume.personal_info?.name ||
              "Unknown Candidate";

            let role =
              resume.current_role || resume.designation || resume.job_title || resume.title || "";

            if (!role && Array.isArray(resume.experience) && resume.experience.length > 0) {
              role =
                resume.experience[0]?.title ||
                resume.experience[0]?.role ||
                resume.experience[0]?.designation ||
                "";
            }
            if (!role) role = "Candidate";

            const experienceData =
              resume.experience_years ?? resume.total_experience ?? resume.experience;

            let experience = "N/A";
            if (typeof experienceData === "number") {
              experience = experienceData.toString();
            } else if (typeof experienceData === "string") {
              experience = experienceData;
            } else if (experienceData && !Array.isArray(experienceData) && typeof experienceData === "object") {
              experience = experienceData.years ?? experienceData.total_years ?? experienceData.duration ?? "N/A";
            } else if (Array.isArray(experienceData)) {
              experience = resume.experience_years ?? resume.total_experience ?? "See profile";
            }

            const educationData = resume.education;
            let education = "N/A";
            if (Array.isArray(educationData) && educationData.length > 0) {
              const first = educationData[0];
              if (typeof first === "string") {
                education = first;
              } else if (first && typeof first === "object") {
                education = first.degree || first.course || first.qualification || first.education || "N/A";
              }
            } else if (typeof educationData === "string") {
              education = educationData;
            } else if (educationData && typeof educationData === "object") {
              education = educationData.degree || educationData.course || educationData.qualification || "N/A";
            }

            const chipStyle = getChipStyle(candidate.recommendation);

            return (
              <TableRow
                key={resume._id || resume.email || `${name}-${index}`}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: colors.paper },
                }}
              >
                {/* CANDIDATE */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: colors.brassSoft,
                        color: colors.brassDark,
                        width: 40,
                        height: 40,
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 700,
                      }}
                    >
                      {name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color={colors.ink}>
                        {name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.slate }} display="block">
                        {role}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* EXPERIENCE + EDUCATION */}
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={0.7} alignItems="flex-start">
                    <Chip
                      size="small"
                      icon={<WorkRoundedIcon sx={{ fontSize: "15px !important" }} />}
                      label={
                        experience === "See profile"
                          ? "Experience available"
                          : experience === "N/A"
                          ? "Experience N/A"
                          : `${experience} Years`
                      }
                      variant="outlined"
                      sx={{ borderColor: colors.hairline, color: colors.slate, fontWeight: 600 }}
                    />
                    <Tooltip title={education} placement="top">
                      <Chip
                        size="small"
                        icon={<SchoolRoundedIcon sx={{ fontSize: "15px !important" }} />}
                        label={education.length > 24 ? `${education.substring(0, 24)}...` : education}
                        variant="outlined"
                        sx={{ borderColor: colors.hairline, color: colors.slate, fontWeight: 600 }}
                      />
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* FIT SCORE — signature element */}
                <TableCell sx={{ minWidth: 100 }}>
                  <Box display="flex" justifyContent="center">
                    <ScoreSeal score={score} size={52} showLabel={false} />
                  </Box>
                </TableCell>

                {/* RECOMMENDATION */}
                <TableCell>
                  <Chip
                    size="small"
                    label={candidate.recommendation || "N/A"}
                    sx={{ ...chipStyle, fontWeight: 700 }}
                  />
                  {candidate.confidence && (
                    <Typography
                      sx={{ mt: 0.5, fontFamily: mono, fontSize: "0.66rem", color: colors.slateFaint }}
                      display="block"
                    >
                      CONFIDENCE: {candidate.confidence}
                    </Typography>
                  )}
                </TableCell>

                {/* VIEW */}
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={() => {
                      navigate("/candidate", {
                        state: { ...candidate, job_analysis: analysis },
                      });
                    }}
                    sx={{
                      whiteSpace: "nowrap",
                      borderRadius: 1.5,
                      borderColor: colors.hairlineStrong,
                      color: colors.ink,
                      fontWeight: 700,
                      "&:hover": { borderColor: colors.brass, bgcolor: colors.brassSoft },
                    }}
                  >
                    View
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

const headCell = {
  fontFamily: mono,
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.slateFaint,
  borderBottom: `1px solid ${colors.hairline}`,
};

export default CandidateTable;
