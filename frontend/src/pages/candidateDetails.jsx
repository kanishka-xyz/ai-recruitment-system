import React from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

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

import { useLocation, useNavigate } from "react-router-dom";

import JDAnalysis from "../components/JDAnalysis.jsx";


function CandidateAnalysis() {
  const navigate = useNavigate();
  const { state: candidate } = useLocation();

  // =====================================================
  // NO CANDIDATE
  // =====================================================

  if (!candidate) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
          p: 5,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Candidate data not available
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const resume = candidate.resume || {};

  const jobAnalysis =
    candidate.job_analysis || {};

  const score = Number(
    candidate.overall_score || 0
  );

  const recommendation =
    candidate.recommendation ||
    "Not Available";

  const confidence =
    candidate.confidence ||
    "Not Available";

  const roleFit =
    candidate.role_fit ||
    "Role fit analysis not available.";

  const reason =
    candidate.reason ||
    "Detailed evaluation reason not available.";

  const strengths = Array.isArray(
    candidate.strengths
  )
    ? candidate.strengths
    : [];

  const gaps = Array.isArray(
    candidate.gaps
  )
    ? candidate.gaps
    : [];

  const compensatingFactors =
    Array.isArray(
      candidate.compensating_factors
    )
      ? candidate.compensating_factors
      : [];

  const criticalMissing =
    Array.isArray(
      candidate.critical_requirements_missing
    )
      ? candidate.critical_requirements_missing
      : [];

  const factorAnalysis =
    candidate.factor_analysis || {};

  // =====================================================
  // CANDIDATE NAME
  // =====================================================

  const name =
    resume.name ||
    resume.candidate ||
    resume.candidate_name ||
    resume.full_name ||
    resume.personal_info?.name ||
    "Unknown Candidate";

  // =====================================================
  // CONTACT
  // =====================================================

  const email =
    resume.email ||
    resume.personal_info?.email ||
    "Not Available";

  const phone =
    resume.phone ||
    resume.mobile ||
    resume.personal_info?.phone ||
    "Not Available";

  // =====================================================
  // ROLE
  // =====================================================

  let currentRole =
    resume.current_role ||
    resume.designation ||
    resume.job_title ||
    resume.title ||
    "";

  if (
    !currentRole &&
    Array.isArray(resume.experience) &&
    resume.experience.length > 0
  ) {
    currentRole =
      resume.experience[0]?.title ||
      resume.experience[0]?.role ||
      resume.experience[0]?.designation ||
      "";
  }

  if (!currentRole) {
    currentRole = "Candidate";
  }

  // =====================================================
  // EXPERIENCE
  // =====================================================

  const experienceYears =
    resume.experience_years ??
    resume.total_experience ??
    null;

  // =====================================================
  // EDUCATION
  // =====================================================

  const educationList =
    Array.isArray(resume.education)
      ? resume.education
      : resume.education
      ? [resume.education]
      : [];

  // =====================================================
  // SKILLS
  // =====================================================

  const skills =
    Array.isArray(resume.skills)
      ? resume.skills
      : [];

  // =====================================================
  // PROJECTS
  // =====================================================

  const projects =
    Array.isArray(resume.projects)
      ? resume.projects
      : [];

  // =====================================================
  // EXPERIENCE LIST
  // =====================================================

  const experienceList =
    Array.isArray(resume.experience)
      ? resume.experience
      : [];

  // =====================================================
  // CERTIFICATIONS
  // =====================================================

  const certifications =
    Array.isArray(resume.certifications)
      ? resume.certifications
      : [];

  // =====================================================
  // RECOMMENDATION COLOR
  // =====================================================

  const getRecommendationColor = () => {
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
  // FACTOR LABEL
  // =====================================================

  const formatFactorName = (key) => {
    return key
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        p: {
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
          mb: 4,
        }}
      >
        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
            color="#0F172A"
          >
            Candidate Analysis
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Contextual AI evaluation based on the
            complete candidate profile
          </Typography>

        </Box>

        <Button
          variant="outlined"
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Back to Candidates
        </Button>
      </Box>

      {/* =================================================
          CANDIDATE SUMMARY
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #E2E8F0",
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 3,
            }}
          >

            {/* Candidate */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >

              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: "#EEF2FF",
                  color: "#4338CA",
                }}
              >
                <PersonRoundedIcon
                  sx={{ fontSize: 38 }}
                />
              </Avatar>

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {name}
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  {currentRole}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 1.5 }}
                >

                  {experienceYears !==
                    null && (
                    <Chip
                      size="small"
                      icon={
                        <WorkRoundedIcon />
                      }
                      label={`${experienceYears} Years Experience`}
                      variant="outlined"
                    />
                  )}

                  {educationList.length >
                    0 && (
                    <Chip
                      size="small"
                      icon={
                        <SchoolRoundedIcon />
                      }
                      label={
                        typeof educationList[0] ===
                        "object"
                          ? educationList[0]
                              .degree ||
                            educationList[0]
                              .qualification ||
                            "Education Available"
                          : educationList[0]
                      }
                      variant="outlined"
                    />
                  )}

                </Stack>

              </Box>
            </Box>

            {/* Score */}

            <Box
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 250,
                },
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Overall Fit
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color="primary"
                  >
                    {score.toFixed(0)}%
                  </Typography>
                </Box>

                <Chip
                  label={recommendation}
                  color={
                    getRecommendationColor()
                  }
                  sx={{
                    fontWeight: 700,
                  }}
                />
              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(
                  Math.max(score, 0),
                  100
                )}
                sx={{
                  mt: 1.5,
                  height: 8,
                  borderRadius: 5,
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                AI Confidence:{" "}
                <strong>
                  {confidence}
                </strong>
              </Typography>

            </Box>

          </Box>

        </CardContent>
      </Card>

      {/* =================================================
          TWO COLUMN PAGE
      ================================================= */}

      <Grid container spacing={3}>

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <Grid size={{ xs: 12, lg: 8 }}>

          <Stack spacing={3}>

            {/* =============================================
                ROLE FIT
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={1.5}
              >
                <PsychologyRoundedIcon
                  color="primary"
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Role Fit
                </Typography>
              </Stack>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                }}
              >
                {roleFit}
              </Typography>

            </Paper>

            {/* =============================================
                WHY THIS CANDIDATE
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Why this candidate?
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                }}
              >
                {reason}
              </Typography>

            </Paper>

            {/* =============================================
                STRENGTHS
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Strengths
              </Typography>

              {strengths.length > 0 ? (
                <Stack spacing={1.5}>

                  {strengths.map(
                    (strength, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 1.2,
                          alignItems:
                            "flex-start",
                        }}
                      >
                        <CheckCircleRoundedIcon
                          color="success"
                          fontSize="small"
                          sx={{ mt: 0.2 }}
                        />

                        <Typography
                          color="text.secondary"
                        >
                          {strength}
                        </Typography>
                      </Box>
                    )
                  )}

                </Stack>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  No specific strengths were
                  returned by the evaluator.
                </Typography>
              )}

            </Paper>

            {/* =============================================
                COMPENSATING FACTORS
            ============================================= */}

            {compensatingFactors.length >
              0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border:
                    "1px solid #E2E8F0",
                  bgcolor: "#F8FAFC",
                }}
              >

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mb={2}
                >
                  <AutoAwesomeRoundedIcon
                    color="primary"
                  />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Compensating Factors
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>

                  {compensatingFactors.map(
                    (factor, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 1.2,
                        }}
                      >
                        <CheckCircleRoundedIcon
                          color="primary"
                          fontSize="small"
                        />

                        <Typography
                          color="text.secondary"
                        >
                          {factor}
                        </Typography>
                      </Box>
                    )
                  )}

                </Stack>

              </Paper>
            )}

            {/* =============================================
                GAPS
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Identified Gaps
              </Typography>

              {gaps.length > 0 ? (
                <Stack spacing={1.5}>

                  {gaps.map(
                    (gap, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 1.2,
                          alignItems:
                            "flex-start",
                        }}
                      >
                        <WarningAmberRoundedIcon
                          color="warning"
                          fontSize="small"
                          sx={{ mt: 0.2 }}
                        />

                        <Typography
                          color="text.secondary"
                        >
                          {gap}
                        </Typography>
                      </Box>
                    )
                  )}

                </Stack>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  No significant gaps identified.
                </Typography>
              )}

            </Paper>

            {/* =============================================
                CRITICAL REQUIREMENTS
            ============================================= */}

            {criticalMissing.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border:
                    "1px solid #FECACA",
                  bgcolor: "#FEF2F2",
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="error"
                  mb={2}
                >
                  Critical Requirements Missing
                </Typography>

                <Stack spacing={1}>

                  {criticalMissing.map(
                    (requirement, index) => (
                      <Typography
                        key={index}
                        color="error"
                      >
                        • {requirement}
                      </Typography>
                    )
                  )}

                </Stack>

              </Paper>
            )}

            {/* =============================================
                CONTEXTUAL FACTOR ANALYSIS
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Contextual Factor Analysis
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 2 }}
              >
                These factors are interpreted
                together rather than treated as
                isolated scoring parameters.
              </Typography>

              <Divider sx={{ mb: 1 }} />

              {Object.entries(
                factorAnalysis
              ).map(
                ([factor, analysis]) => {

                  if (!analysis) {
                    return null;
                  }

                  return (
                    <Box
                      key={factor}
                      sx={{
                        py: 2,
                        borderBottom:
                          "1px solid #F1F5F9",
                      }}
                    >

                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="#334155"
                      >
                        {formatFactorName(
                          factor
                        )}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.7,
                          lineHeight: 1.7,
                        }}
                      >
                        {typeof analysis ===
                        "string"
                          ? analysis
                          : JSON.stringify(
                              analysis
                            )}
                      </Typography>

                    </Box>
                  );
                }
              )}

            </Paper>

            {/* =============================================
                SKILLS
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Candidate Skills
              </Typography>

              {skills.length > 0 ? (
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  useFlexGap
                  gap={1}
                >
                  {skills.map(
                    (skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    )
                  )}
                </Stack>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  Skills not available.
                </Typography>
              )}

            </Paper>

            {/* =============================================
                EXPERIENCE
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Professional Experience
              </Typography>

              {experienceList.length >
              0 ? (
                <Stack spacing={2}>

                  {experienceList.map(
                    (experience, index) => (
                      <Box key={index}>

                        <Typography
                          fontWeight={700}
                        >
                          {experience.title ||
                            experience.role ||
                            experience.designation ||
                            "Experience"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="primary"
                        >
                          {experience.company ||
                            ""}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {experience.dates ||
                            experience.duration ||
                            ""}
                        </Typography>

                        {Array.isArray(
                          experience.description
                        ) ? (
                          <Box sx={{ mt: 1 }}>
                            {experience.description.map(
                              (
                                item,
                                itemIndex
                              ) => (
                                <Typography
                                  key={
                                    itemIndex
                                  }
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: 0.5,
                                  }}
                                >
                                  • {item}
                                </Typography>
                              )
                            )}
                          </Box>
                        ) : (
                          experience.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              {
                                experience.description
                              }
                            </Typography>
                          )
                        )}

                        {index <
                          experienceList.length -
                            1 && (
                          <Divider
                            sx={{ mt: 2 }}
                          />
                        )}

                      </Box>
                    )
                  )}

                </Stack>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  Professional experience
                  details not available.
                </Typography>
              )}

            </Paper>

            {/* =============================================
                PROJECTS
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Projects
              </Typography>

              {projects.length > 0 ? (
                <Stack spacing={2}>

                  {projects.map(
                    (project, index) => (
                      <Box key={index}>

                        <Typography
                          fontWeight={700}
                        >
                          {project.title ||
                            project.name ||
                            "Project"}
                        </Typography>

                        {Array.isArray(
                          project.technologies
                        ) && (
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            useFlexGap
                            gap={0.7}
                            sx={{ mt: 1 }}
                          >
                            {project.technologies.map(
                              (
                                technology,
                                techIndex
                              ) => (
                                <Chip
                                  key={
                                    techIndex
                                  }
                                  label={
                                    technology
                                  }
                                  size="small"
                                />
                              )
                            )}
                          </Stack>
                        )}

                        {Array.isArray(
                          project.description
                        ) ? (
                          <Box sx={{ mt: 1 }}>
                            {project.description.map(
                              (
                                item,
                                itemIndex
                              ) => (
                                <Typography
                                  key={
                                    itemIndex
                                  }
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: 0.5,
                                  }}
                                >
                                  • {item}
                                </Typography>
                              )
                            )}
                          </Box>
                        ) : (
                          project.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              {
                                project.description
                              }
                            </Typography>
                          )
                        )}

                        {index <
                          projects.length -
                            1 && (
                          <Divider
                            sx={{ mt: 2 }}
                          />
                        )}

                      </Box>
                    )
                  )}

                </Stack>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  Projects not available.
                </Typography>
              )}

            </Paper>

            {/* =============================================
                EDUCATION
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Education
              </Typography>

              {educationList.length >
              0 ? (
                <Stack spacing={2}>

                  {educationList.map(
                    (education, index) => {

                      if (
                        typeof education ===
                        "string"
                      ) {
                        return (
                          <Typography
                            key={index}
                          >
                            {education}
                          </Typography>
                        );
                      }

                      return (
                        <Box key={index}>

                          <Typography
                            fontWeight={700}
                          >
                            {education.degree ||
                              education.course ||
                              education.qualification ||
                              "Qualification"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {education.institution ||
                              education.college ||
                              education.university ||
                              ""}
                          </Typography>

                          {education.gpa && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              GPA:{" "}
                              {education.gpa}
                            </Typography>
                          )}

                          {education.years && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {
                                education.years
                              }
                            </Typography>
                          )}

                        </Box>
                      );
                    }
                  )}

                </Stack>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  Education not available.
                </Typography>
              )}

            </Paper>

            {/* =============================================
                CERTIFICATIONS
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Certifications
              </Typography>

              {certifications.length >
              0 ? (
                <Stack spacing={1}>

                  {certifications.map(
                    (
                      certification,
                      index
                    ) => (
                      <Typography
                        key={index}
                        color="text.secondary"
                      >
                        •{" "}
                        {typeof certification ===
                        "object"
                          ? certification.name ||
                            certification.title ||
                            JSON.stringify(
                              certification
                            )
                          : certification}
                      </Typography>
                    )
                  )}

                </Stack>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  Certifications not
                  available.
                </Typography>
              )}

            </Paper>

            {/* =============================================
                ORIGINAL RESUME TEXT
            ============================================= */}

            {resume.resume_text && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border:
                    "1px solid #E2E8F0",
                }}
              >

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mb={2}
                >
                  <DescriptionRoundedIcon
                    color="primary"
                  />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Original Resume
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    bgcolor: "#F8FAFC",
                    borderRadius: 2,
                    p: 2,
                    maxHeight: 450,
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                    }}
                  >
                    {resume.resume_text}
                  </Typography>
                </Box>

              </Paper>
            )}

          </Stack>

        </Grid>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <Grid size={{ xs: 12, lg: 4 }}>

          <Stack
            spacing={3}
            sx={{
              position: {
                lg: "sticky",
              },
              top: 20,
            }}
          >

            {/* JD */}

            <JDAnalysis
              analysis={jobAnalysis}
            />

            {/* Contact */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Candidate Information
              </Typography>

              <Stack spacing={2}>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <EmailRoundedIcon
                    color="action"
                    fontSize="small"
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {email}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <PhoneRoundedIcon
                    color="action"
                    fontSize="small"
                  />

                  <Typography variant="body2">
                    {phone}
                  </Typography>
                </Box>

              </Stack>

            </Paper>

            {/* Evaluation Method */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
                bgcolor: "#F8FAFC",
              }}
            >

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Evaluation Method
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                The overall fit represents
                contextual suitability for this
                specific role. Skills,
                experience, projects, education,
                certifications, achievements,
                internships and domain relevance
                are considered together rather
                than independently.
              </Typography>

            </Paper>

          </Stack>

        </Grid>

      </Grid>

    </Box>
  );
}

export default CandidateAnalysis;