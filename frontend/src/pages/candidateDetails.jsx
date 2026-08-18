import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import JDAnalysis from "../components/JDAnalysis.jsx";

function CandidateAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const candidate = location.state;
  const [profileTab, setProfileTab] = useState(0);

  // --------------------------------------------------
  // Empty State Guard
  // --------------------------------------------------
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
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Return to Candidates
          </Button>
        </Paper>
      </Box>
    );
  }

  // --------------------------------------------------
  // Data Extraction & Normalization
  // --------------------------------------------------
  const resume = candidate.resume || {};
  const jobAnalysis = candidate.job_analysis || {};
  const score = Number(candidate.overall_score || 0);
  const recommendation = candidate.recommendation || "Under Review";
  const confidence = candidate.confidence || "Moderate";
  const roleFit = candidate.role_fit || "Role fit analysis not generated.";
  const reason =
    candidate.reason || "Detailed evaluation rationale not provided.";
  const strengths = Array.isArray(candidate.strengths)
    ? candidate.strengths
    : [];
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
    resume.phone ||
    resume.mobile ||
    resume.personal_info?.phone ||
    "Not Provided";

  let currentRole =
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
  const experienceList = Array.isArray(resume.experience)
    ? resume.experience
    : [];
  const certifications = Array.isArray(resume.certifications)
    ? resume.certifications
    : [];

  // --------------------------------------------------
  // UI Helpers
  // --------------------------------------------------
  const getScoreTheme = (val) => {
    if (val >= 80) return { main: "#10B981", bg: "#ECFDF5", text: "#065F46" };
    if (val >= 65) return { main: "#3B82F6", bg: "#EFF6FF", text: "#1E40AF" };
    if (val >= 50) return { main: "#F59E0B", bg: "#FFFBEB", text: "#92400E" };
    return { main: "#EF4444", bg: "#FEF2F2", text: "#991B1B" };
  };

  const scoreTheme = getScoreTheme(score);

  const formatFactorName = (key) =>
    key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", py: 4 }}>
      <Container maxWidth="xl">
        {/* Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3.5,
          }}
        >
          <Button
            variant="text"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: "#475569",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(100, 116, 139, 0.08)" },
            }}
          >
            Back to Candidate Matches
          </Button>
          <Chip
            icon={
              <AutoAwesomeRoundedIcon sx={{ fontSize: "16px !important" }} />
            }
            label="AI Contextual Analysis"
            size="small"
            sx={{
              bgcolor: "#EEF2FF",
              color: "#4F46E5",
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          />
        </Box>

        {/* Hero Header Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 4,
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            boxShadow: "0 4px 20px -4px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Candidate Identity */}
            <Grid item xs={12} md={7} lg={8}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: { xs: 64, md: 84 },
                    height: { xs: 64, md: 84 },
                    bgcolor:
                      "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                    background:
                      "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
                    color: "#4F46E5",
                    fontSize: 32,
                    fontWeight: 700,
                    boxShadow: "inset 0 0 0 1px rgba(99, 102, 241, 0.2)",
                  }}
                >
                  {name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#0F172A"
                    sx={{ letterSpacing: -0.5 }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="#64748B"
                    fontWeight={500}
                    sx={{ mb: 1.5 }}
                  >
                    {currentRole}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {experienceYears !== null && (
                      <Chip
                        icon={
                          <WorkRoundedIcon
                            sx={{ fontSize: "15px !important" }}
                          />
                        }
                        label={`${experienceYears} Yrs Experience`}
                        size="small"
                        sx={{
                          bgcolor: "#F1F5F9",
                          color: "#334155",
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {educationList.length > 0 && (
                      <Chip
                        icon={
                          <SchoolRoundedIcon
                            sx={{ fontSize: "15px !important" }}
                          />
                        }
                        label={
                          typeof educationList[0] === "object"
                            ? educationList[0].degree ||
                              educationList[0].qualification ||
                              "Educated"
                            : educationList[0]
                        }
                        size="small"
                        sx={{
                          bgcolor: "#F1F5F9",
                          color: "#334155",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            {/* Score & Recommendation Banner */}
            <Grid item xs={12} md={5} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: scoreTheme.bg,
                  border: `1px solid ${alpha(scoreTheme.main, 0.2)}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: scoreTheme.text,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Overall Fit Score
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight={900}
                      sx={{ color: scoreTheme.text, lineHeight: 1.1, my: 0.5 }}
                    >
                      {score.toFixed(0)}
                      <Typography
                        component="span"
                        variant="h5"
                        fontWeight={700}
                        sx={{ opacity: 0.7 }}
                      >
                        %
                      </Typography>
                    </Typography>
                  </Box>
                  <Chip
                    label={recommendation}
                    sx={{
                      bgcolor: scoreTheme.main,
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      boxShadow: `0 2px 8px ${alpha(scoreTheme.main, 0.4)}`,
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(Math.max(score, 0), 100)}
                  sx={{
                    mt: 2,
                    mb: 1,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(scoreTheme.main, 0.15),
                    "& .MuiLinearProgress-bar": {
                      bgcolor: scoreTheme.main,
                      borderRadius: 3,
                    },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="caption"
                    sx={{ color: scoreTheme.text, opacity: 0.8 }}
                  >
                    Confidence Level
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: scoreTheme.text, fontWeight: 700 }}
                  >
                    {confidence}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content Layout */}
        <Grid container spacing={3.5}>
          {/* Left Column: Deep Analysis & Profile Details */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3.5}>
              {/* Executive Evaluation Block */}
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: 4,
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0F172A"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <PsychologyRoundedIcon color="primary" /> Executive Assessment
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
                    <Typography
                      variant="body2"
                      color="#64748B"
                      sx={{ lineHeight: 1.8 }}
                    >
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
                    <Typography
                      variant="body2"
                      color="#64748B"
                      sx={{ lineHeight: 1.8 }}
                    >
                      {reason}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Strengths, Factors, and Gaps Grid */}
              <Grid container spacing={3}>
                {/* Strengths */}
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
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CheckCircleRoundedIcon
                        color="success"
                        fontSize="small"
                      />{" "}
                      Key Strengths
                    </Typography>
                    {strengths.length > 0 ? (
                      <Stack spacing={1.5}>
                        {strengths.map((str, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              alignItems: "flex-start",
                            }}
                          >
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
                            <Typography
                              variant="body2"
                              color="#475569"
                              sx={{ lineHeight: 1.6 }}
                            >
                              {str}
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

                {/* Identified Gaps */}
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
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <WarningAmberRoundedIcon
                        color="warning"
                        fontSize="small"
                      />{" "}
                      Identified Gaps
                    </Typography>
                    {gaps.length > 0 ? (
                      <Stack spacing={1.5}>
                        {gaps.map((gap, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              alignItems: "flex-start",
                            }}
                          >
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
                            <Typography
                              variant="body2"
                              color="#475569"
                              sx={{ lineHeight: 1.6 }}
                            >
                              {gap}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No major gaps identified against the requirements.
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Critical Missing (if any) */}
                {criticalMissing.length > 0 && (
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3.5,
                        bgcolor: "#FEF2F2",
                        border: "1px solid #FECACA",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="#991B1B"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <ErrorOutlineRoundedIcon fontSize="small" /> Critical
                        Missing Requirements
                      </Typography>
                      <Stack spacing={1}>
                        {criticalMissing.map((req, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            color="#B91C1C"
                            fontWeight={500}
                          >
                            • {req}
                          </Typography>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                )}

                {/* Compensating Factors */}
                {compensatingFactors.length > 0 && (
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3.5,
                        bgcolor: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="#166534"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <AutoAwesomeRoundedIcon fontSize="small" /> Compensating
                        Factors
                      </Typography>
                      <Stack spacing={1}>
                        {compensatingFactors.map((factor, idx) => (
                          <Typography key={idx} variant="body2" color="#15803D">
                            ✓ {factor}
                          </Typography>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Contextual Multi-Factor Breakdown */}
              {Object.keys(factorAnalysis).length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 4,
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Typography variant="h6" fontWeight={800} color="#0F172A">
                    Contextual Factor Evaluation
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, mb: 3 }}
                  >
                    Holistic synthesis of candidate dimensions evaluated
                    concurrently against core requirements.
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    {Object.entries(factorAnalysis).map(
                      ([factor, analysisText]) => {
                        if (!analysisText) return null;
                        return (
                          <Box
                            key={factor}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#F8FAFC",
                              border: "1px solid #F1F5F9",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              color="#1E293B"
                            >
                              {formatFactorName(factor)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="#64748B"
                              sx={{ mt: 0.5, lineHeight: 1.7 }}
                            >
                              {typeof analysisText === "string"
                                ? analysisText
                                : JSON.stringify(analysisText)}
                            </Typography>
                          </Box>
                        );
                      },
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Profile Background Tabs (Experience, Projects, Education, Resume) */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  overflow: "hidden",
                }}
              >
                <Tabs
                  value={profileTab}
                  onChange={(e, val) => setProfileTab(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    borderBottom: "1px solid #E2E8F0",
                    px: 2,
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      minHeight: 52,
                    },
                  }}
                >
                  <Tab
                    icon={<WorkRoundedIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Experience"
                  />
                  <Tab
                    icon={<StarRoundedIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Skills"
                  />
                  <Tab
                    icon={<FolderSpecialRoundedIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Projects"
                  />
                  <Tab
                    icon={<SchoolRoundedIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Education & Certs"
                  />
                  {resume.resume_text && (
                    <Tab
                      icon={<DescriptionRoundedIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Raw Resume"
                    />
                  )}
                </Tabs>

                <Box sx={{ p: 3.5 }}>
                  {/* Tab 0: Experience */}
                  {profileTab === 0 && (
                    <Box>
                      {experienceList.length > 0 ? (
                        <Stack spacing={3}>
                          {experienceList.map((exp, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                position: "relative",
                                pl: 2,
                                borderLeft: "2px solid #E2E8F0",
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                color="#0F172A"
                              >
                                {exp.title ||
                                  exp.role ||
                                  exp.designation ||
                                  "Role"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="primary.main"
                                fontWeight={600}
                              >
                                {exp.company || "Company Not Listed"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {exp.dates || exp.duration || ""}
                              </Typography>
                              {Array.isArray(exp.description) ? (
                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                  {exp.description.map((desc, dIdx) => (
                                    <Typography
                                      key={dIdx}
                                      variant="body2"
                                      color="#64748B"
                                    >
                                      • {desc}
                                    </Typography>
                                  ))}
                                </Stack>
                              ) : (
                                exp.description && (
                                  <Typography
                                    variant="body2"
                                    color="#64748B"
                                    sx={{ mt: 1 }}
                                  >
                                    {exp.description}
                                  </Typography>
                                )
                              )}
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No experience records found.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Tab 1: Skills */}
                  {profileTab === 1 && (
                    <Box>
                      {skills.length > 0 ? (
                        <Stack
                          direction="row"
                          flexWrap="wrap"
                          useFlexGap
                          gap={1}
                        >
                          {skills.map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              sx={{
                                bgcolor: "#F8FAFC",
                                border: "1px solid #E2E8F0",
                                color: "#334155",
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No parsed skills available.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Tab 2: Projects */}
                  {profileTab === 2 && (
                    <Box>
                      {projects.length > 0 ? (
                        <Stack spacing={3}>
                          {projects.map((proj, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                p: 2.5,
                                borderRadius: 2.5,
                                bgcolor: "#F8FAFC",
                                border: "1px solid #F1F5F9",
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                color="#0F172A"
                              >
                                {proj.title || proj.name || "Project"}
                              </Typography>
                              {Array.isArray(proj.technologies) && (
                                <Stack
                                  direction="row"
                                  flexWrap="wrap"
                                  useFlexGap
                                  gap={0.5}
                                  sx={{ my: 1 }}
                                >
                                  {proj.technologies.map((tech, tIdx) => (
                                    <Chip
                                      key={tIdx}
                                      label={tech}
                                      size="small"
                                      sx={{ fontSize: "0.7rem", height: 22 }}
                                    />
                                  ))}
                                </Stack>
                              )}
                              {Array.isArray(proj.description) ? (
                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                  {proj.description.map((desc, dIdx) => (
                                    <Typography
                                      key={dIdx}
                                      variant="body2"
                                      color="#64748B"
                                    >
                                      • {desc}
                                    </Typography>
                                  ))}
                                </Stack>
                              ) : (
                                proj.description && (
                                  <Typography
                                    variant="body2"
                                    color="#64748B"
                                    sx={{ mt: 1 }}
                                  >
                                    {proj.description}
                                  </Typography>
                                )
                              )}
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No project records found.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Tab 3: Education & Certs */}
                  {profileTab === 3 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="#0F172A"
                          gutterBottom
                        >
                          Academic Background
                        </Typography>
                        {educationList.length > 0 ? (
                          <Stack spacing={2} sx={{ mt: 1 }}>
                            {educationList.map((edu, idx) => (
                              <Box key={idx}>
                                <Typography
                                  variant="body2"
                                  fontWeight={700}
                                  color="#334155"
                                >
                                  {typeof edu === "string"
                                    ? edu
                                    : edu.degree ||
                                      edu.qualification ||
                                      "Degree"}
                                </Typography>
                                {typeof edu === "object" && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                  >
                                    {edu.institution || edu.university || ""}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not Available
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="#0F172A"
                          gutterBottom
                        >
                          Certifications
                        </Typography>
                        {certifications.length > 0 ? (
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            {certifications.map((cert, idx) => (
                              <Typography
                                key={idx}
                                variant="body2"
                                color="#475569"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <WorkspacePremiumRoundedIcon
                                  color="action"
                                  fontSize="small"
                                />
                                {typeof cert === "object"
                                  ? cert.name || cert.title
                                  : cert}
                              </Typography>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No certifications recorded.
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* Tab 4: Raw Resume */}
                  {profileTab === 4 && resume.resume_text && (
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        maxHeight: 500,
                        overflowY: "auto",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        color: "#334155",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {resume.resume_text}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Sticky Metadata & Target JD */}
          <Grid item xs={12} lg={4}>
            <Stack
              spacing={3}
              sx={{
                position: { lg: "sticky" },
                top: 24,
              }}
            >
              {/* Target Job Requirements */}
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: 4,
                  border: "1px solid #E2E8F0",
                  p: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <JDAnalysis analysis={jobAnalysis} />
              </Box>

              {/* Contact Information Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3.5,
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="#0F172A"
                  mb={2}
                >
                  Candidate Contact
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: "#F1F5F9",
                        color: "#64748B",
                      }}
                    >
                      <EmailRoundedIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Email Address
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="#334155"
                        noWrap
                      >
                        {email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: "#F1F5F9",
                        color: "#64748B",
                      }}
                    >
                      <PhoneRoundedIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Phone Number
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="#334155"
                        noWrap
                      >
                        {phone}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {/* Evaluation Policy / System Note */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#F8FAFC",
                  border: "1px dashed #CBD5E1",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                  <InfoOutlinedIcon
                    sx={{ fontSize: 18, color: "#64748B", mt: 0.2 }}
                  />
                  <Typography
                    variant="caption"
                    color="#64748B"
                    sx={{ lineHeight: 1.6 }}
                  >
                    Fit score represents contextual qualification mapping
                    factoring in overlapping skillset domains, seniority
                    trajectory, and project scale rather than isolated keyword
                    matches.
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CandidateAnalysis;
