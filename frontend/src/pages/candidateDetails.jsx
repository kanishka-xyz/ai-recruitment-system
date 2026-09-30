import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import { colors } from "../theme/theme.js";
import api from "../services/api.js";


function getName(candidate) {
  return (
    candidate?.candidate_name ||
    candidate?.name ||
    candidate?.full_name ||
    candidate?.candidate ||
    candidate?.personal_info?.name ||
    "Unknown Candidate"
  );
}


function getRole(candidate) {
  return (
    candidate?.current_role ||
    candidate?.role ||
    candidate?.job_title ||
    candidate?.designation ||
    "Candidate"
  );
}


function getExperience(candidate) {
  return (
    candidate?.total_experience_years ??
    candidate?.experience_years ??
    candidate?.total_experience ??
    candidate?.experience ??
    "N/A"
  );
}


function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase() || "C";
}


function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}


function Section({ icon, title, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E1E6EB",
        borderRadius: 3,
        overflow: "hidden",
        background: "#FFFFFF",
        height: "100%",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          background: "#FAFBFC",
          borderBottom: "1px solid #EDF0F3",
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#EDF2F7",
            color: "#607A96",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 800,
            color: "#26313C",
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>{children}</Box>
    </Card>
  );
}


function ListSection({ items, emptyText, positive = false }) {
  const values = toArray(items);

  if (!values.length) {
    return (
      <Typography sx={{ color: "#8B96A1", fontSize: 14 }}>
        {emptyText}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.2}>
      {values.map((item, index) => {
        const text =
          typeof item === "string"
            ? item
            : item?.description ||
              item?.reason ||
              item?.name ||
              JSON.stringify(item);

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                mt: "3px",
                width: 7,
                height: 7,
                borderRadius: "50%",
                flexShrink: 0,
                background: positive ? "#3E8F72" : "#C77B57",
              }}
            />

            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.65,
                color: "#46535F",
              }}
            >
              {text}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}


function MetricCard({ icon, label, value, accent = "#55718F" }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.2,
        borderRadius: 2.5,
        border: "1px solid #E1E6EB",
        background: "#FFFFFF",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: accent,
          mb: 1,
        }}
      >
        {icon}
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#87929D",
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 850,
          color: "#18212B",
        }}
      >
        {value}
      </Typography>
    </Card>
  );
}


function CandidateDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const candidateState = location.state;

  if (!candidateState) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#F6F8FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Card
          elevation={0}
          sx={{
            maxWidth: 520,
            width: "100%",
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #E0E5EA",
          }}
        >
          <PersonRoundedIcon
            sx={{ fontSize: 55, color: "#9AA7B4", mb: 1 }}
          />

          <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
            No Evaluation Selected
          </Typography>

          <Typography sx={{ mt: 1, color: "#7B8793", fontSize: 14 }}>
            Return to the search results and select a candidate evaluation.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/results")}
            sx={{
              mt: 3,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              backgroundColor: colors.brass,
              "&:hover": { backgroundColor: colors.brassDark },
            }}
          >
            Back to Results
          </Button>
        </Card>
      </Box>
    );
  }

  // Search results contain AI evaluation fields at the top level and
  // the parsed resume under `resume`.
  const resume =
    candidateState.resume &&
    typeof candidateState.resume === "object"
      ? candidateState.resume
      : {};

  const candidate = {
    ...resume,
    ...candidateState,
  };

  const name = getName(candidate);
  const role = getRole(candidate);
  const experience = getExperience(candidate);
  const initials = getInitials(name);

  const score = Number(candidate.overall_score ?? 0);
  const semanticScore = Number(candidate.semantic_score ?? 0);

  const factorAnalysis =
    candidate.factor_analysis &&
    typeof candidate.factor_analysis === "object"
      ? candidate.factor_analysis
      : {};

  const evaluationTime =
    candidate._contextual_time ??
    candidate.contextual_evaluation_time ??
    "N/A";

  const contextualTotalTime =
    candidate._contextual_total_time ??
    candidate.contextual_total_time ??
    "N/A";

  const openResume = () => {
    if (!candidate.resume_file) return;

    const baseURL =
      api.defaults.baseURL || "http://127.0.0.1:8000";

    const resumeURL =
      `${baseURL}/resume/${encodeURIComponent(candidate.resume_file)}`;

    window.open(resumeURL, "_blank", "noopener,noreferrer");
  };

  const recommendation = candidate.recommendation || "Under Review";
  const recommendationColor =
    recommendation === "Highly Recommended"
      ? "#2E8066"
      : recommendation === "Recommended"
      ? "#9A6A21"
      : recommendation === "Consider"
      ? "#A66A00"
      : "#A54E4E";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F6F8FA",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/results")}
          sx={{
            mb: 2,
            textTransform: "none",
            fontWeight: 700,
            color: "#63717E",
            "&:hover": {
              background: "transparent",
              color: "#26313C",
            },
          }}
        >
          Back to Search Results
        </Button>

        {/* Candidate identity + evaluation status */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #DEE4EA",
            background: "#FFFFFF",
            overflow: "hidden",
            mb: 2.5,
          }}
        >
          <Box sx={{ height: 6, background: colors.brass }} />

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #E7EEF6, #D5E1EE)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#55718F",
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: 25, fontWeight: 850 }}>
                  {initials}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 27, md: 34 },
                    fontWeight: 850,
                    color: "#18212B",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {name}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 16,
                    color: "#687684",
                    fontWeight: 600,
                  }}
                >
                  {role}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mt: 2 }}
                >
                  <Chip
                    icon={<WorkRoundedIcon />}
                    label={`${experience} experience`}
                    size="small"
                    sx={{ fontWeight: 700, background: "#F1F4F7" }}
                  />

                  {candidate.current_company && (
                    <Chip
                      icon={<BusinessRoundedIcon />}
                      label={candidate.current_company}
                      size="small"
                      sx={{ fontWeight: 700, background: "#F1F4F7" }}
                    />
                  )}

                  {candidate.location && (
                    <Chip
                      icon={<LocationOnRoundedIcon />}
                      label={candidate.location}
                      size="small"
                      sx={{ fontWeight: 700, background: "#F1F4F7" }}
                    />
                  )}
                </Stack>
              </Box>

              <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#8995A1",
                  }}
                >
                  Evaluation Status
                </Typography>

                <Chip
                  icon={<CheckCircleRoundedIcon />}
                  label={
                    candidate.evaluation_status === "completed"
                      ? "Completed"
                      : candidate.evaluation_status || "Available"
                  }
                  sx={{
                    mt: 0.8,
                    fontWeight: 800,
                    color: "#2E8066",
                    background: "#E8F4EF",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Main AI evaluation metrics */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<TrendingUpRoundedIcon />}
              label="Overall Fit"
              value={`${score.toFixed(1)} / 100`}
              accent="#55718F"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<PsychologyRoundedIcon />}
              label="Recommendation"
              value={recommendation}
              accent={recommendationColor}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<CheckCircleRoundedIcon />}
              label="Confidence"
              value={candidate.confidence || "N/A"}
              accent="#55718F"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<SpeedRoundedIcon />}
              label="Semantic Similarity"
              value={`${semanticScore.toFixed(2)}%`}
              accent="#55718F"
            />
          </Grid>
        </Grid>

        {/* Evaluation timing */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            p: 2.2,
            borderRadius: 2.5,
            border: "1px solid #E1E6EB",
            background: "#FFFFFF",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box>
              <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#8A95A1", textTransform: "uppercase" }}>
                Gemini Response
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: 18, fontWeight: 800, color: "#26313C" }}>
                {typeof evaluationTime === "number" ? `${evaluationTime.toFixed(2)} sec` : evaluationTime}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#8A95A1", textTransform: "uppercase" }}>
                Total Contextual Evaluation
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: 18, fontWeight: 800, color: "#26313C" }}>
                {typeof contextualTotalTime === "number" ? `${contextualTotalTime.toFixed(2)} sec` : contextualTotalTime}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Role fit + reason */}
        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          <Grid item xs={12} md={5}>
            <Section
              icon={<WorkRoundedIcon fontSize="small" />}
              title="Role Fit"
            >
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "#52606D",
                }}
              >
                {candidate.role_fit || "No role-fit explanation available."}
              </Typography>
            </Section>
          </Grid>

          <Grid item xs={12} md={7}>
            <Section
              icon={<PsychologyRoundedIcon fontSize="small" />}
              title="AI Evaluation Reason"
            >
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "#52606D",
                }}
              >
                {candidate.reason || "No detailed reason was returned."}
              </Typography>
            </Section>
          </Grid>
        </Grid>

        {/* Strengths / gaps / compensation / critical */}
        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          <Grid item xs={12} md={6}>
            <Section
              icon={<CheckCircleRoundedIcon fontSize="small" />}
              title="Strengths"
            >
              <ListSection
                items={candidate.strengths}
                emptyText="No strengths returned."
                positive
              />
            </Section>
          </Grid>

          <Grid item xs={12} md={6}>
            <Section
              icon={<WarningAmberRoundedIcon fontSize="small" />}
              title="Gaps"
            >
              <ListSection
                items={candidate.gaps}
                emptyText="No gaps returned."
              />
            </Section>
          </Grid>

          <Grid item xs={12} md={6}>
            <Section
              icon={<TrendingUpRoundedIcon fontSize="small" />}
              title="Compensating Factors"
            >
              <ListSection
                items={candidate.compensating_factors}
                emptyText="No compensating factors returned."
                positive
              />
            </Section>
          </Grid>

          <Grid item xs={12} md={6}>
            <Section
              icon={<WarningAmberRoundedIcon fontSize="small" />}
              title="Critical Requirements Missing"
            >
              <ListSection
                items={candidate.critical_requirements_missing}
                emptyText="No critical requirements identified."
              />
            </Section>
          </Grid>
        </Grid>

        {/* Factor analysis */}
        <Box sx={{ mb: 2.5 }}>
          <Section
            icon={<PsychologyRoundedIcon fontSize="small" />}
            title="Contextual Factor Analysis"
          >
            <Grid container spacing={2}>
              {[
                ["Skills", "skills"],
                ["Experience", "experience"],
                ["Projects", "projects"],
                ["Education", "education"],
                ["Certifications", "certifications"],
                ["Achievements", "achievements"],
                ["Internships", "internships"],
                ["Domain Relevance", "domain_relevance"],
              ].map(([label, key]) => (
                <Grid item xs={12} md={6} key={key}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#F7F9FB",
                      border: "1px solid #E7EBEF",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#7C8995",
                        mb: 0.7,
                      }}
                    >
                      {label}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13.5,
                        lineHeight: 1.7,
                        color: "#46535F",
                      }}
                    >
                      {factorAnalysis[key] ||
                        "No sufficient evaluation available."}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Section>
        </Box>

        {/* Supporting resume information */}
        <Box sx={{ mb: 2.5 }}>
          <Section
            icon={<DescriptionRoundedIcon fontSize="small" />}
            title="Supporting Candidate Profile"
          >
            <Stack spacing={2}>
              {candidate.summary && (
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#7C8995", textTransform: "uppercase" }}>
                    Summary
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 14, lineHeight: 1.7, color: "#52606D" }}>
                    {candidate.summary}
                  </Typography>
                </Box>
              )}

              {candidate.education && (
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#7C8995", textTransform: "uppercase" }}>
                    Education
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 14, lineHeight: 1.7, color: "#52606D" }}>
                    {toArray(candidate.education)
                      .map((item) =>
                        typeof item === "string"
                          ? item
                          : item?.degree ||
                            item?.course ||
                            item?.qualification ||
                            JSON.stringify(item)
                      )
                      .join(" • ")}
                  </Typography>
                </Box>
              )}

              {candidate.skills && (
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#7C8995", textTransform: "uppercase", mb: 0.7 }}>
                    Skills
                  </Typography>

                  <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
                    {toArray(candidate.skills).map((skill, index) => (
                      <Chip
                        key={index}
                        size="small"
                        label={
                          typeof skill === "string"
                            ? skill
                            : skill?.name || JSON.stringify(skill)
                        }
                        sx={{
                          background: "#F2F5F8",
                          border: "1px solid #DCE2E8",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {candidate.resume_file && (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<DescriptionRoundedIcon />}
                    onClick={openResume}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    Open Original Resume
                  </Button>
                </Box>
              )}
            </Stack>
          </Section>
        </Box>
      </Container>
    </Box>
  );
}


export default CandidateDetails;
