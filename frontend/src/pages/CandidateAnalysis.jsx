import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

// Icons
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import JDAnalysis from "../components/JDAnalysis.jsx";

function CandidateAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const candidate = location.state;
  const [profileTab, setProfileTab] = useState(0);

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!candidate) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F8FAFC",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            maxWidth: 480,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #E2E8F0",
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: "error.main",
              mx: "auto",
              mb: 2,
            }}
          >
            <ErrorOutlineRoundedIcon />
          </Avatar>

          <Typography variant="h6" fontWeight={700} color="#0F172A">
            Candidate Data Unavailable
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 3 }}
          >
            We couldn't retrieve the analysis details. Please select a candidate
            from the search results again.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Return to Candidates
          </Button>
        </Paper>
      </Box>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const resume = candidate.resume || {};
  const jobAnalysis = candidate.job_analysis || {};

  const score = Number(candidate.overall_score || 0);
  const recommendation = candidate.recommendation || "Under Review";
  const confidence = candidate.confidence || "Moderate";

  const roleFit = candidate.role_fit || "Role fit analysis not generated.";
  const reason = candidate.reason || "Detailed evaluation rationale not provided.";

  const strengths = Array.isArray(candidate.strengths) ? candidate.strengths : [];
  const gaps = Array.isArray(candidate.gaps) ? candidate.gaps : [];
  const compensatingFactors = Array.isArray(candidate.compensating_factors)
    ? candidate.compensating_factors
    : [];
  const criticalMissing = Array.isArray(candidate.critical_requirements_missing)
    ? candidate.critical_requirements_missing
    : [];

  const factorAnalysis = candidate.factor_analysis || {};

  const name =
    resume.name ||
    resume.candidate ||
    resume.candidate_name ||
    resume.full_name ||
    resume.personal_info?.name ||
    "Candidate Dossier";

  const email = resume.email || resume.personal_info?.email || "Not Provided";
  const phone =
    resume.phone || resume.mobile || resume.personal_info?.phone || "Not Provided";

  const currentRole =
    resume.current_role ||
    resume.designation ||
    resume.job_title ||
    resume.title ||
    (Array.isArray(resume.experience) && resume.experience[0]?.title) ||
    "Professional";

  const experienceYears =
    resume.experience_years ?? resume.total_experience ?? null;

  const educationList = Array.isArray(resume.education)
    ? resume.education
    : resume.education
    ? [resume.education]
    : [];

  const skills = Array.isArray(resume.skills) ? resume.skills : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const experienceList = Array.isArray(resume.experience) ? resume.experience : [];
  const certifications = Array.isArray(resume.certifications) ? resume.certifications : [];

  // =========================================================
  // SCORE THEME
  // =========================================================

  const getScoreTheme = (value) => {
    if (value >= 80) {
      return { main: "#10B981", bg: "#ECFDF5", text: "#065F46" };
    }
    if (value >= 65) {
      return { main: "#3B82F6", bg: "#EFF6FF", text: "#1E40AF" };
    }
    if (value >= 50) {
      return { main: "#F59E0B", bg: "#FFFBEB", text: "#92400E" };
    }
    return { main: "#EF4444", bg: "#FEF2F2", text: "#991B1B" };
  };

  const scoreTheme = getScoreTheme(score);

  const formatFactorName = (key) =>
    key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F8FA",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* TOP HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            px: { xs: 0, md: 0.5 },
          }}
        >
          <Button
            variant="text"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: "#334155",
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "none",
              borderRadius: 2,
              px: 1.5,
              py: 1,
              "&:hover": { bgcolor: "#EEF2F7" },
            }}
          >
            Back to Candidate Matches
          </Button>

          <Chip
            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: "16px !important" }} />}
            label="AI Contextual Analysis"
            size="small"
            sx={{
              height: 34,
              px: 0.8,
              bgcolor: "#EEF2FF",
              color: "#4F46E5",
              fontWeight: 800,
              fontSize: "0.78rem",
              borderRadius: 2,
              border: "1px solid #E0E7FF",
              boxShadow: "0 5px 16px rgba(79,70,229,0.08)",
              "& .MuiChip-icon": { color: "#6366F1" },
            }}
          />
        </Box>

        {/* CANDIDATE HERO */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            borderRadius: { xs: 3, md: 4 },
            p: { xs: 2.5, sm: 3.5, md: 4.5 },
            mb: 4,
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow: "0 15px 45px rgba(15,23,42,0.06)",
          }}
        >
          {/* Decorative Circle */}
          <Box
            sx={{
              position: "absolute",
              width: 330,
              height: 330,
              borderRadius: "50%",
              top: -150,
              right: -100,
              background:
                "radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0) 70%)",
              pointerEvents: "none",
            }}
          />

          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
            {/* CANDIDATE INFORMATION */}
            <Grid item xs={12} md={7} lg={7.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 2.5 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Avatar
                  sx={{
                    width: { xs: 72, sm: 90 },
                    height: { xs: 72, sm: 90 },
                    bgcolor: "#EEF2FF",
                    color: "#4F46E5",
                    fontSize: { xs: 30, sm: 38 },
                    fontWeight: 800,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    border: "1px solid #C7D2FE",
                    boxShadow: "0 8px 25px rgba(79,70,229,0.12)",
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#64748B",
                      mb: 0.7,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    CANDIDATE DOSSIER
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: { xs: "2rem", sm: "2.4rem", md: "2.7rem" },
                      lineHeight: 1.05,
                      fontWeight: 700,
                      color: "#0F172A",
                      letterSpacing: "-0.04em",
                      mb: 0.6,
                    }}
                  >
                    {name}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: { xs: "1.05rem", sm: "1.2rem" },
                      fontWeight: 600,
                      color: "#475569",
                      mb: 1.8,
                    }}
                  >
                    {currentRole}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {experienceYears !== null && (
                      <Chip
                        icon={<WorkRoundedIcon sx={{ fontSize: "15px !important" }} />}
                        label={`${experienceYears} Yrs Experience`}
                        size="small"
                        sx={{
                          bgcolor: "#F8FAFC",
                          color: "#334155",
                          fontWeight: 600,
                          border: "1px solid #E2E8F0",
                          borderRadius: 1.5,
                        }}
                      />
                    )}

                    {educationList.length > 0 && (
                      <Chip
                        icon={<SchoolRoundedIcon sx={{ fontSize: "15px !important" }} />}
                        label={
                          typeof educationList[0] === "object"
                            ? educationList[0].degree ||
                              educationList[0].qualification ||
                              "Education"
                            : educationList[0]
                        }
                        size="small"
                        sx={{
                          bgcolor: "#F8FAFC",
                          color: "#334155",
                          fontWeight: 600,
                          border: "1px solid #E2E8F0",
                          borderRadius: 1.5,
                          maxWidth: { xs: "100%", sm: 320 },
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            {/* SCORE CARD */}
            <Grid item xs={12} md={5} lg={4.5}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 3.5,
                  bgcolor: scoreTheme.bg,
                  border: `1px solid ${alpha(scoreTheme.main, 0.22)}`,
                  minHeight: 195,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* TOP ROW: HEADER & CHIP */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1.5,
                    width: "100%",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: scoreTheme.text,
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        fontFamily: "'Courier New', monospace",
                        lineHeight: 1.3,
                      }}
                    >
                      Overall Fit Score
                    </Typography>

                    {/* SCORE DISPLAY */}
                    <Box sx={{ display: "flex", alignItems: "baseline", mt: 0.5 }}>
                      <Typography
                        sx={{
                          color: scoreTheme.text,
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: { xs: "3rem", sm: "3.5rem" },
                          lineHeight: 1,
                          fontWeight: 700,
                          letterSpacing: "-0.05em",
                        }}
                      >
                        {score.toFixed(0)}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          color: scoreTheme.text,
                          opacity: 0.6,
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          ml: 0.5,
                        }}
                      >
                        %
                      </Typography>
                    </Box>
                  </Box>

                  {/* RECOMMENDATION CHIP */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: scoreTheme.text,
                        opacity: 0.65,
                        mb: 0.5,
                      }}
                    >
                      Status
                    </Typography>
                    <Chip
                      label={recommendation}
                      size="small"
                      sx={{
                        height: 28,
                        bgcolor: scoreTheme.main,
                        color: "#FFFFFF",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        borderRadius: 1.5,
                        boxShadow: `0 4px 12px ${alpha(scoreTheme.main, 0.25)}`,
                        "& .MuiChip-label": { px: 1.2 },
                      }}
                    />
                  </Box>
                </Box>

                {/* BOTTOM SECTION: PROGRESS & CONFIDENCE */}
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.max(score, 0), 100)}
                    sx={{
                      height: 6,
                      borderRadius: 5,
                      bgcolor: alpha(scoreTheme.main, 0.14),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: scoreTheme.main,
                        borderRadius: 5,
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1.2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: scoreTheme.text,
                        opacity: 0.72,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Confidence Level
                    </Typography>

                    <Typography
                      sx={{
                        color: scoreTheme.text,
                        fontSize: "0.78rem",
                        fontWeight: 800,
                      }}
                    >
                      {confidence}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* MAIN CONTENT */}
        <Grid container spacing={{ xs: 3, md: 3.5 }}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3.5}>
              {/* EXECUTIVE ASSESSMENT */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3.5 },
                  borderRadius: 4,
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0F172A"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "1.35rem",
                  }}
                >
                  <PsychologyRoundedIcon color="primary" />
                  Executive Assessment
                </Typography>

                <Stack spacing={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="#334155"
                      gutterBottom
                    >
                      Role Fit Assessment
                    </Typography>
                    <Typography variant="body2" color="#64748B" sx={{ lineHeight: 1.8 }}>
                      {roleFit}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="#334155"
                      gutterBottom
                    >
                      Decision Rationale
                    </Typography>
                    <Typography variant="body2" color="#64748B" sx={{ lineHeight: 1.8 }}>
                      {reason}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* STRENGTHS + GAPS */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 3.5,
                      bgcolor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="#0F172A"
                      sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                    >
                      <CheckCircleRoundedIcon color="success" fontSize="small" />
                      Key Strengths
                    </Typography>

                    {strengths.length > 0 ? (
                      <Stack spacing={1.5}>
                        {strengths.map((strength, index) => (
                          <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "success.main",
                                mt: 1,
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6 }}>
                              {strength}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No distinct strengths highlighted.
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 3.5,
                      bgcolor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="#0F172A"
                      sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                    >
                      <WarningAmberRoundedIcon color="warning" fontSize="small" />
                      Identified Gaps
                    </Typography>

                    {gaps.length > 0 ? (
                      <Stack spacing={1.5}>
                        {gaps.map((gap, index) => (
                          <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "warning.main",
                                mt: 1,
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6 }}>
                              {gap}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No critical gaps identified.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              {/* ADDITIONAL FACTORS & CRITICAL REQUIREMENTS */}
              {(compensatingFactors.length > 0 || criticalMissing.length > 0) && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3.5,
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Grid container spacing={3}>
                    {compensatingFactors.length > 0 && (
                      <Grid item xs={12} md={criticalMissing.length > 0 ? 6 : 12}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="#0F172A"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 20 }} />
                          Compensating Factors
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1.5 }}>
                          {compensatingFactors.map((factor, idx) => (
                            <Typography key={idx} variant="body2" color="#475569" sx={{ lineHeight: 1.6 }}>
                              • {factor}
                            </Typography>
                          ))}
                        </Stack>
                      </Grid>
                    )}

                    {criticalMissing.length > 0 && (
                      <Grid item xs={12} md={compensatingFactors.length > 0 ? 6 : 12}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="#0F172A"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <ErrorOutlineRoundedIcon color="error" sx={{ fontSize: 20 }} />
                          Critical Missing Requirements
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1.5 }}>
                          {criticalMissing.map((item, idx) => (
                            <Typography key={idx} variant="body2" color="#475569" sx={{ lineHeight: 1.6 }}>
                              • {item}
                            </Typography>
                          ))}
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              )}

              {/* FACTOR BREAKDOWN */}
              {Object.keys(factorAnalysis).length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 4,
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="#0F172A"
                    sx={{
                      mb: 3,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.25rem",
                    }}
                  >
                    Evaluation Factor Analysis
                  </Typography>

                  <Stack spacing={2.5}>
                    {Object.entries(factorAnalysis).map(([key, factor]) => {
                      const factorScore = Number(factor?.score || 0);
                      const factorTheme = getScoreTheme(factorScore);

                      return (
                        <Box
                          key={key}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: "#F8FAFC",
                            border: "1px solid #F1F5F9",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={700} color="#334155">
                              {formatFactorName(key)}
                            </Typography>

                            <Chip
                              label={`${factorScore}%`}
                              size="small"
                              sx={{
                                bgcolor: factorTheme.bg,
                                color: factorTheme.text,
                                fontWeight: 800,
                                height: 24,
                                fontSize: "0.75rem",
                              }}
                            />
                          </Box>

                          <LinearProgress
                            variant="determinate"
                            value={Math.min(Math.max(factorScore, 0), 100)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "#E2E8F0",
                              mb: 1.5,
                              "& .MuiLinearProgress-bar": {
                                bgcolor: factorTheme.main,
                                borderRadius: 3,
                              },
                            }}
                          />

                          {factor.notes && (
                            <Typography variant="body2" color="#64748B">
                              {factor.notes}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              )}

              {/* JD ANALYSIS (IF AVAILABLE) */}
              {jobAnalysis && Object.keys(jobAnalysis).length > 0 && (
                <JDAnalysis jobAnalysis={jobAnalysis} />
              )}
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: CANDIDATE PROFILE DETAILS */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                position: { lg: "sticky" },
                top: { lg: 24 },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                color="#0F172A"
                sx={{
                  mb: 2,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "1.2rem",
                }}
              >
                Profile Details
              </Typography>

              {/* Contact Information */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <EmailRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ wordBreak: "break-all", fontWeight: 500 }}
                  >
                    {email}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PhoneRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                    {phone}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Tabs Navigation */}
              <Tabs
                value={profileTab}
                onChange={(e, newValue) => setProfileTab(newValue)}
                variant="fullWidth"
                sx={{
                  mb: 2.5,
                  minHeight: 36,
                  "& .MuiTab-root": {
                    minHeight: 36,
                    py: 0.5,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textTransform: "none",
                  },
                }}
              >
                <Tab label="Skills" />
                <Tab label="Experience" />
                <Tab label="More" />
              </Tabs>

              {/* Tab 0: Skills */}
              {profileTab === 0 && (
                <Box>
                  {skills.length > 0 ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={
                            typeof skill === "object"
                              ? skill.name || skill.skill
                              : skill
                          }
                          size="small"
                          sx={{
                            bgcolor: "#F1F5F9",
                            color: "#334155",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            borderRadius: 1.5,
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No skills listed.
                    </Typography>
                  )}
                </Box>
              )}

              {/* Tab 1: Experience */}
              {profileTab === 1 && (
                <Stack spacing={2}>
                  {experienceList.length > 0 ? (
                    experienceList.map((exp, idx) => (
                      <Box key={idx}>
                        <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                          {exp.title || exp.designation || "Role"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {exp.company || exp.organization}
                          {exp.duration ? ` • ${exp.duration}` : ""}
                        </Typography>
                        {exp.description && (
                          <Typography
                            variant="body2"
                            color="#64748B"
                            sx={{ mt: 0.5, fontSize: "0.8rem", lineHeight: 1.5 }}
                          >
                            {exp.description}
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No experience records available.
                    </Typography>
                  )}
                </Stack>
              )}

              {/* Tab 2: Projects & Certifications */}
              {profileTab === 2 && (
                <Stack spacing={2.5}>
                  {projects.length > 0 && (
                    <Box>
                      <Typography
                        variant="caption"
                        fontWeight={800}
                        color="text.secondary"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          display: "block",
                          mb: 1,
                        }}
                      >
                        Projects
                      </Typography>
                      <Stack spacing={1.5}>
                        {projects.map((proj, idx) => (
                          <Box key={idx}>
                            <Typography variant="body2" fontWeight={700} color="#0F172A">
                              {proj.name || proj.title || "Project"}
                            </Typography>
                            {proj.description && (
                              <Typography
                                variant="caption"
                                color="#64748B"
                                sx={{ display: "block", lineHeight: 1.4 }}
                              >
                                {proj.description}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {certifications.length > 0 && (
                    <Box>
                      <Typography
                        variant="caption"
                        fontWeight={800}
                        color="text.secondary"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          display: "block",
                          mb: 1,
                        }}
                      >
                        Certifications
                      </Typography>
                      <Stack spacing={1}>
                        {certifications.map((cert, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            color="#334155"
                            sx={{ fontSize: "0.82rem" }}
                          >
                            • {typeof cert === "object" ? cert.name || cert.title : cert}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {projects.length === 0 && certifications.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No additional project or certification records.
                    </Typography>
                  )}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CandidateAnalysis;