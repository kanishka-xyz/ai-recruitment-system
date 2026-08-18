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
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
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
import ScoreSeal from "../components/ScoreSeal.jsx";
import { colors, mono, scoreTier } from "../theme/theme.js";

function CandidateAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state;
  const [profileTab, setProfileTab] = useState(0);

  // --------------------------------------------------
  // Empty State Guard
  // --------------------------------------------------
  if (!candidate) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: colors.paper, p: 3 }}>
        <Paper elevation={0} sx={{ p: 5, maxWidth: 480, textAlign: "center", borderRadius: 4, border: `1px solid ${colors.hairline}` }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: colors.crimsonSoft, color: colors.crimson, mx: "auto", mb: 2 }}>
            <ErrorOutlineRoundedIcon />
          </Avatar>
          <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20, color: colors.ink }}>
            Candidate Data Unavailable
          </Typography>
          <Typography sx={{ mt: 1, mb: 3, color: colors.slate, fontSize: 14 }}>
            We couldn't retrieve the dossier details. Please select a candidate from the search results again.
          </Typography>
          <Button
            variant="contained"
            disableElevation
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 1.5, px: 3, bgcolor: colors.ink, fontWeight: 700, "&:hover": { bgcolor: colors.inkSoft } }}
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
  const reason = candidate.reason || "Detailed evaluation rationale not provided.";
  const strengths = Array.isArray(candidate.strengths) ? candidate.strengths : [];
  const gaps = Array.isArray(candidate.gaps) ? candidate.gaps : [];
  const compensatingFactors = Array.isArray(candidate.compensating_factors) ? candidate.compensating_factors : [];
  const criticalMissing = Array.isArray(candidate.critical_requirements_missing) ? candidate.critical_requirements_missing : [];
  const factorAnalysis = candidate.factor_analysis || {};

  const name =
    resume.name || resume.candidate || resume.candidate_name || resume.full_name || resume.personal_info?.name || "Candidate Dossier";

  const email = resume.email || resume.personal_info?.email || "Not Provided";
  const phone = resume.phone || resume.mobile || resume.personal_info?.phone || "Not Provided";

  let currentRole =
    resume.current_role ||
    resume.designation ||
    resume.job_title ||
    resume.title ||
    (Array.isArray(resume.experience) && resume.experience[0]?.title) ||
    "Professional";

  const experienceYears = resume.experience_years ?? resume.total_experience ?? null;
  const educationList = Array.isArray(resume.education) ? resume.education : resume.education ? [resume.education] : [];
  const skills = Array.isArray(resume.skills) ? resume.skills : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const experienceList = Array.isArray(resume.experience) ? resume.experience : [];
  const certifications = Array.isArray(resume.certifications) ? resume.certifications : [];

  const tier = scoreTier(score);

  const formatFactorName = (key) => key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.paper, py: 4 }}>
      <Container maxWidth="xl">
        {/* Navigation Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: colors.slate, fontWeight: 700, "&:hover": { bgcolor: colors.paperRaised } }}
          >
            Back to Candidate Matches
          </Button>
          <Chip
            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: "16px !important" }} />}
            label="AI Contextual Analysis"
            size="small"
            sx={{ bgcolor: colors.brassSoft, color: colors.brassDark, fontWeight: 700, borderRadius: 1.5 }}
          />
        </Box>

        {/* Hero Header Card */}
        <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 3, md: 4 }, mb: 4, border: `1px solid ${colors.hairline}`, bgcolor: colors.paperRaised }}>
          <Grid container spacing={3} alignItems="center">
            {/* Candidate Identity */}
            <Grid item xs={12} md={7} lg={8}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: { xs: 64, md: 84 },
                    height: { xs: 64, md: 84 },
                    bgcolor: colors.brassSoft,
                    color: colors.brassDark,
                    fontFamily: "'Fraunces', serif",
                    fontSize: 32,
                    fontWeight: 700,
                    border: `1.5px solid ${colors.hairlineStrong}`,
                  }}
                >
                  {name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: { xs: 26, md: 32 }, color: colors.ink, letterSpacing: "-0.01em" }}>
                    {name}
                  </Typography>
                  <Typography sx={{ color: colors.slate, fontWeight: 500, fontSize: 17, mb: 1.5 }}>
                    {currentRole}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {experienceYears !== null && (
                      <Chip
                        icon={<WorkRoundedIcon sx={{ fontSize: "15px !important" }} />}
                        label={`${experienceYears} Yrs Experience`}
                        size="small"
                        sx={{ bgcolor: colors.paper, color: colors.ink, fontWeight: 700, border: `1px solid ${colors.hairline}` }}
                      />
                    )}
                    {educationList.length > 0 && (
                      <Chip
                        icon={<SchoolRoundedIcon sx={{ fontSize: "15px !important" }} />}
                        label={typeof educationList[0] === "object" ? educationList[0].degree || educationList[0].qualification || "Educated" : educationList[0]}
                        size="small"
                        sx={{ bgcolor: colors.paper, color: colors.ink, fontWeight: 700, border: `1px solid ${colors.hairline}` }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            {/* Score seal + recommendation */}
            <Grid item xs={12} md={5} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: tier.soft,
                  border: `1px solid ${tier.main}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <ScoreSeal score={score} size={76} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontFamily: mono, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", color: colors.slate, textTransform: "uppercase" }}>
                    Overall Fit
                  </Typography>
                  <Chip
                    label={recommendation}
                    sx={{ mt: 0.75, bgcolor: tier.main, color: "#fff", fontWeight: 700, fontSize: "0.75rem" }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
                    <Typography sx={{ fontSize: 12, color: colors.slate }}>Confidence</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.ink }}>{confidence}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content Layout */}
        <Grid container spacing={3.5}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3.5}>
              {/* Executive Evaluation */}
              <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, bgcolor: colors.paperRaised, border: `1px solid ${colors.hairline}` }}>
                <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20, color: colors.ink, display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <PsychologyRoundedIcon sx={{ color: colors.brass }} /> Executive Assessment
                </Typography>

                <Stack spacing={3}>
                  <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: colors.paper, border: `1px solid ${colors.hairline}` }}>
                    <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 13.5, mb: 0.75 }}>Role Fit Assessment</Typography>
                    <Typography sx={{ color: colors.slate, lineHeight: 1.8, fontSize: 14 }}>{roleFit}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 13.5, mb: 0.75 }}>Decision Rationale</Typography>
                    <Typography sx={{ color: colors.slate, lineHeight: 1.8, fontSize: 14 }}>{reason}</Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Strengths / Gaps */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, height: "100%", borderRadius: 3.5, bgcolor: colors.paperRaised, border: `1px solid ${colors.hairline}` }}>
                    <Typography sx={{ fontWeight: 700, color: colors.ink, display: "flex", alignItems: "center", gap: 1, mb: 2, fontSize: 15 }}>
                      <CheckCircleRoundedIcon sx={{ color: colors.teal }} fontSize="small" /> Key Strengths
                    </Typography>
                    {strengths.length > 0 ? (
                      <Stack spacing={1.5}>
                        {strengths.map((str, idx) => (
                          <Box key={idx} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: colors.teal, mt: 1, flexShrink: 0 }} />
                            <Typography sx={{ color: colors.slate, lineHeight: 1.6, fontSize: 14 }}>{str}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography sx={{ color: colors.slateFaint, fontSize: 14 }}>No distinct strengths highlighted.</Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, height: "100%", borderRadius: 3.5, bgcolor: colors.paperRaised, border: `1px solid ${colors.hairline}` }}>
                    <Typography sx={{ fontWeight: 700, color: colors.ink, display: "flex", alignItems: "center", gap: 1, mb: 2, fontSize: 15 }}>
                      <WarningAmberRoundedIcon sx={{ color: colors.amber }} fontSize="small" /> Identified Gaps
                    </Typography>
                    {gaps.length > 0 ? (
                      <Stack spacing={1.5}>
                        {gaps.map((gap, idx) => (
                          <Box key={idx} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: colors.amber, mt: 1, flexShrink: 0 }} />
                            <Typography sx={{ color: colors.slate, lineHeight: 1.6, fontSize: 14 }}>{gap}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography sx={{ color: colors.slateFaint, fontSize: 14 }}>No major gaps identified against the requirements.</Typography>
                    )}
                  </Paper>
                </Grid>

                {criticalMissing.length > 0 && (
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3.5, bgcolor: colors.crimsonSoft, border: `1px solid ${colors.crimson}33` }}>
                      <Typography sx={{ fontWeight: 700, color: colors.crimson, display: "flex", alignItems: "center", gap: 1, mb: 1.5, fontSize: 15 }}>
                        <ErrorOutlineRoundedIcon fontSize="small" /> Critical Missing Requirements
                      </Typography>
                      <Stack spacing={1}>
                        {criticalMissing.map((req, idx) => (
                          <Typography key={idx} sx={{ color: colors.crimson, fontWeight: 500, fontSize: 14 }}>
                            • {req}
                          </Typography>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                )}

                {compensatingFactors.length > 0 && (
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3.5, bgcolor: colors.tealSoft, border: `1px solid ${colors.teal}33` }}>
                      <Typography sx={{ fontWeight: 700, color: colors.teal, display: "flex", alignItems: "center", gap: 1, mb: 1.5, fontSize: 15 }}>
                        <AutoAwesomeRoundedIcon fontSize="small" /> Compensating Factors
                      </Typography>
                      <Stack spacing={1}>
                        {compensatingFactors.map((factor, idx) => (
                          <Typography key={idx} sx={{ color: colors.teal, fontSize: 14 }}>
                            ✓ {factor}
                          </Typography>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Factor Breakdown */}
              {Object.keys(factorAnalysis).length > 0 && (
                <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, bgcolor: colors.paperRaised, border: `1px solid ${colors.hairline}` }}>
                  <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, color: colors.ink }}>
                    Contextual Factor Evaluation
                  </Typography>
                  <Typography sx={{ color: colors.slate, mt: 0.5, mb: 3, fontSize: 13.5 }}>
                    Holistic synthesis of candidate dimensions evaluated concurrently against core requirements.
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: colors.hairline }} />
                  <Stack spacing={2}>
                    {Object.entries(factorAnalysis).map(([factor, analysisText]) => {
                      if (!analysisText) return null;
                      return (
                        <Box key={factor} sx={{ p: 2, borderRadius: 2, bgcolor: colors.paper, border: `1px solid ${colors.hairline}` }}>
                          <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 13.5 }}>{formatFactorName(factor)}</Typography>
                          <Typography sx={{ color: colors.slate, mt: 0.5, lineHeight: 1.7, fontSize: 14 }}>
                            {typeof analysisText === "string" ? analysisText : JSON.stringify(analysisText)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              )}

              {/* Profile Background Tabs */}
              <Paper elevation={0} sx={{ borderRadius: 4, bgcolor: colors.paperRaised, border: `1px solid ${colors.hairline}`, overflow: "hidden" }}>
                <Tabs
                  value={profileTab}
                  onChange={(e, val) => setProfileTab(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  TabIndicatorProps={{ style: { backgroundColor: colors.brass, height: 2.5 } }}
                  sx={{
                    borderBottom: `1px solid ${colors.hairline}`,
                    px: 2,
                    "& .MuiTab-root": { fontWeight: 700, minHeight: 52, color: colors.slate },
                    "& .Mui-selected": { color: `${colors.ink} !important` },
                  }}
                >
                  <Tab icon={<WorkRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Experience" />
                  <Tab icon={<StarRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Skills" />
                  <Tab icon={<FolderSpecialRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Projects" />
                  <Tab icon={<SchoolRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Education & Certs" />
                  {resume.resume_text && (
                    <Tab icon={<DescriptionRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Raw Resume" />
                  )}
                </Tabs>

                <Box sx={{ p: 3.5 }}>
                  {/* Experience */}
                  {profileTab === 0 && (
                    <Box>
                      {experienceList.length > 0 ? (
                        <Stack spacing={3}>
                          {experienceList.map((exp, idx) => (
                            <Box key={idx} sx={{ position: "relative", pl: 2, borderLeft: `2px solid ${colors.hairlineStrong}` }}>
                              <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 15.5 }}>
                                {exp.title || exp.role || exp.designation || "Role"}
                              </Typography>
                              <Typography sx={{ color: colors.brassDark, fontWeight: 700, fontSize: 13.5 }}>
                                {exp.company || "Company Not Listed"}
                              </Typography>
                              <Typography sx={{ fontFamily: mono, fontSize: 11.5, color: colors.slateFaint }}>
                                {exp.dates || exp.duration || ""}
                              </Typography>
                              {Array.isArray(exp.description) ? (
                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                  {exp.description.map((desc, dIdx) => (
                                    <Typography key={dIdx} sx={{ color: colors.slate, fontSize: 14 }}>
                                      • {desc}
                                    </Typography>
                                  ))}
                                </Stack>
                              ) : (
                                exp.description && (
                                  <Typography sx={{ color: colors.slate, mt: 1, fontSize: 14 }}>{exp.description}</Typography>
                                )
                              )}
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography sx={{ color: colors.slateFaint, fontSize: 14 }}>No experience records found.</Typography>
                      )}
                    </Box>
                  )}

                  {/* Skills */}
                  {profileTab === 1 && (
                    <Box>
                      {skills.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                          {skills.map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              sx={{ bgcolor: colors.paper, border: `1px solid ${colors.hairline}`, color: colors.ink, fontWeight: 600 }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography sx={{ color: colors.slateFaint, fontSize: 14 }}>No parsed skills available.</Typography>
                      )}
                    </Box>
                  )}

                  {/* Projects */}
                  {profileTab === 2 && (
                    <Box>
                      {projects.length > 0 ? (
                        <Stack spacing={3}>
                          {projects.map((proj, idx) => (
                            <Box key={idx} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: colors.paper, border: `1px solid ${colors.hairline}` }}>
                              <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 15 }}>
                                {proj.title || proj.name || "Project"}
                              </Typography>
                              {Array.isArray(proj.technologies) && (
                                <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.5} sx={{ my: 1 }}>
                                  {proj.technologies.map((tech, tIdx) => (
                                    <Chip
                                      key={tIdx}
                                      label={tech}
                                      size="small"
                                      sx={{ fontSize: "0.7rem", height: 22, bgcolor: colors.brassSoft, color: colors.brassDark }}
                                    />
                                  ))}
                                </Stack>
                              )}
                              {Array.isArray(proj.description) ? (
                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                  {proj.description.map((desc, dIdx) => (
                                    <Typography key={dIdx} sx={{ color: colors.slate, fontSize: 14 }}>
                                      • {desc}
                                    </Typography>
                                  ))}
                                </Stack>
                              ) : (
                                proj.description && (
                                  <Typography sx={{ color: colors.slate, mt: 1, fontSize: 14 }}>{proj.description}</Typography>
                                )
                              )}
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography sx={{ color: colors.slateFaint, fontSize: 14 }}>No project records found.</Typography>
                      )}
                    </Box>
                  )}

                  {/* Education & Certs */}
                  {profileTab === 3 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 14, mb: 1 }}>Academic Background</Typography>
                        {educationList.length > 0 ? (
                          <Stack spacing={2} sx={{ mt: 1 }}>
                            {educationList.map((edu, idx) => (
                              <Box key={idx}>
                                <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 14 }}>
                                  {typeof edu === "string" ? edu : edu.degree || edu.qualification || "Degree"}
                                </Typography>
                                {typeof edu === "object" && (
                                  <Typography sx={{ fontFamily: mono, fontSize: 11.5, color: colors.slateFaint }} display="block">
                                    {edu.institution || edu.university || ""}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography sx={{ color: colors.slateFaint, fontSize: 14 }}>Not Available</Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 14, mb: 1 }}>Certifications</Typography>
                        {certifications.length > 0 ? (
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            {certifications.map((cert, idx) => (
                              <Typography key={idx} sx={{ color: colors.slate, display: "flex", alignItems: "center", gap: 1, fontSize: 14 }}>
                                <WorkspacePremiumRoundedIcon sx={{ color: colors.brass }} fontSize="small" />
                                {typeof cert === "object" ? cert.name || cert.title : cert}
                              </Typography>
                            ))}
                          </Stack>
                        ) : (
                          <Typography sx={{ color: colors.slateFaint, fontSize: 14 }}>No certifications recorded.</Typography>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* Raw Resume */}
                  {profileTab === 4 && resume.resume_text && (
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        bgcolor: colors.paper,
                        border: `1px solid ${colors.hairline}`,
                        maxHeight: 500,
                        overflowY: "auto",
                        fontFamily: mono,
                        fontSize: "0.85rem",
                        color: colors.slate,
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

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3} sx={{ position: { lg: "sticky" }, top: 24 }}>
              <Box sx={{ bgcolor: colors.paperRaised, borderRadius: 4, border: `1px solid ${colors.hairline}`, p: 3 }}>
                <JDAnalysis analysis={jobAnalysis} />
              </Box>

              {/* Contact */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3.5, bgcolor: colors.paperRaised, border: `1px solid ${colors.hairline}` }}>
                <Typography sx={{ fontWeight: 700, color: colors.ink, mb: 2, fontSize: 15 }}>Candidate Contact</Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: colors.paper, color: colors.slate }}>
                      <EmailRoundedIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontFamily: mono, fontSize: 10.5, color: colors.slateFaint, letterSpacing: "0.06em" }} display="block">
                        EMAIL ADDRESS
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 13.5 }} noWrap>
                        {email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: colors.paper, color: colors.slate }}>
                      <PhoneRoundedIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontFamily: mono, fontSize: 10.5, color: colors.slateFaint, letterSpacing: "0.06em" }} display="block">
                        PHONE NUMBER
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 13.5 }} noWrap>
                        {phone}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {/* Policy note */}
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: colors.paper, border: `1px dashed ${colors.hairlineStrong}` }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                  <InfoOutlinedIcon sx={{ fontSize: 18, color: colors.slateFaint, mt: 0.2 }} />
                  <Typography sx={{ color: colors.slate, lineHeight: 1.6, fontSize: 12 }}>
                    Fit score represents contextual qualification mapping factoring in overlapping skillset domains,
                    seniority trajectory, and project scale rather than isolated keyword matches.
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
