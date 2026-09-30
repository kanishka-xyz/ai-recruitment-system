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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";

import { colors } from "../theme/theme.js";


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


function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}


function Section({ icon, title, children, defaultOpen = true, badge }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E1E6EB",
        borderRadius: 3,
        overflow: "hidden",
        background: "#FFFFFF",
        height: "100%",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "#CBD5DF",
          boxShadow: "0 4px 18px rgba(31, 45, 61, 0.05)",
        },
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        sx={{
          width: "100%",
          border: 0,
          cursor: "pointer",
          textAlign: "left",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          background: "#FAFBFC",
          borderBottom: open ? "1px solid #EDF0F3" : "none",
          color: "inherit",
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
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            flex: 1,
            fontSize: 15,
            fontWeight: 800,
            color: "#26313C",
          }}
        >
          {title}
        </Typography>

        {badge && (
          <Chip
            size="small"
            label={badge}
            sx={{
              height: 24,
              fontSize: 11,
              fontWeight: 700,
              background: "#EEF3F7",
              color: "#607080",
            }}
          />
        )}

        <ExpandMoreRoundedIcon
          sx={{
            color: "#82909D",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </Box>

      {open && <Box sx={{ p: 3 }}>{children}</Box>}
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

        const [expanded, setExpanded] = React.useState(false);
        const long = text.length > 180;

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-start",
              p: 1.3,
              borderRadius: 2,
              background: "#F8FAFB",
              border: "1px solid #E9EDF1",
            }}
          >
            <Box
              sx={{
                mt: "7px",
                width: 7,
                height: 7,
                borderRadius: "50%",
                flexShrink: 0,
                background: positive ? "#3E8F72" : "#C77B57",
              }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "#46535F",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: expanded || !long ? "unset" : 3,
                  overflow: "hidden",
                }}
              >
                {text}
              </Typography>

              {long && (
                <Button
                  size="small"
                  onClick={() => setExpanded((value) => !value)}
                  sx={{
                    mt: 0.3,
                    minWidth: 0,
                    p: 0,
                    textTransform: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#55718F",
                  }}
                >
                  {expanded ? "Show less" : "Read more"}
                </Button>
              )}
            </Box>
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


function ScoreMeter({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const label =
    safeScore >= 80
      ? "Strong fit"
      : safeScore >= 60
      ? "Good fit"
      : safeScore >= 40
      ? "Partial fit"
      : "Low fit";

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #E1E6EB",
        background: "#FFFFFF",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#8995A1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Overall role fit
          </Typography>
          <Typography sx={{ mt: 0.3, fontSize: 34, fontWeight: 900, color: "#18212B", lineHeight: 1 }}>
            {safeScore.toFixed(1)}
            <Typography component="span" sx={{ fontSize: 14, color: "#8A95A1", fontWeight: 700 }}>
              {" "} / 100
            </Typography>
          </Typography>
        </Box>

        <Chip
          label={label}
          size="small"
          sx={{
            fontWeight: 800,
            background: safeScore >= 80 ? "#E8F4EF" : safeScore >= 60 ? "#F7F0DF" : "#F8ECEA",
            color: safeScore >= 80 ? "#2E8066" : safeScore >= 60 ? "#8C6826" : "#A54E4E",
          }}
        />
      </Box>

      <Box sx={{ height: 10, borderRadius: 99, background: "#E9EEF2", overflow: "hidden" }}>
        <Box
          sx={{
            width: `${safeScore}%`,
            height: "100%",
            borderRadius: 99,
            background: safeScore >= 80 ? "#3E8F72" : safeScore >= 60 ? "#B58A3A" : "#B9685D",
            transition: "width 0.6s ease",
          }}
        />
      </Box>

      <Typography sx={{ mt: 1.2, fontSize: 12.5, color: "#7A8792" }}>
        This is the contextual AI assessment of the candidate against this job description.
      </Typography>
    </Box>
  );
}


function QuickNav({ onJump }) {
  const items = [
    ["summary", "Summary"],
    ["evidence", "Evidence"],
    ["factors", "Factor analysis"],
  ];

  return (
    <Box
      sx={{
        mb: 2.5,
        p: 1,
        borderRadius: 2.5,
        border: "1px solid #E1E6EB",
        background: "#FFFFFF",
        display: "flex",
        gap: 0.5,
        flexWrap: "wrap",
      }}
    >
      {items.map(([id, label]) => (
        <Button
          key={id}
          size="small"
          onClick={() => onJump(id)}
          sx={{
            px: 1.6,
            py: 0.8,
            borderRadius: 1.7,
            textTransform: "none",
            fontWeight: 750,
            color: "#657482",
            "&:hover": { background: "#F1F4F7", color: "#26313C" },
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
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
  // Keep the evaluation payload separate from the resume/profile payload.
  // This page is intentionally an evaluation-only view.
  const candidate = candidateState;

  const name = getName(candidate);

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
                <PersonRoundedIcon sx={{ fontSize: 42 }} />
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
                    mt: 1.5,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#8A95A1",
                  }}
                >
                  AI Candidate Evaluation
                </Typography>
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

        <QuickNav
          onJump={(id) => {
            document.getElementById(id)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />

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

        <Box id="summary" sx={{ scrollMarginTop: 20, mb: 2.5 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={5}>
              <ScoreMeter score={score} />
            </Grid>

            <Grid item xs={12} md={7}>
              <Section
                icon={<PsychologyRoundedIcon fontSize="small" />}
                title="What this means"
                defaultOpen
              >
                <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: "#52606D" }}>
                  {candidate.reason || "No detailed evaluation reason was returned."}
                </Typography>
              </Section>
            </Grid>
          </Grid>
        </Box>

        {/* Role fit + reason */}
        <Box id="evidence" sx={{ scrollMarginTop: 20 }}>
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
        </Box>

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
        <Box id="factors" sx={{ mb: 2.5, scrollMarginTop: 20 }}>
          <Section
            icon={<PsychologyRoundedIcon fontSize="small" />}
            title="Contextual Factor Analysis"
            defaultOpen
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

      </Container>
    </Box>
  );
}


export default CandidateDetails;
