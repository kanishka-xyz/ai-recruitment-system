import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";


function getName(candidate) {
  return (
    candidate?.candidate_name ||
    candidate?.name ||
    candidate?.full_name ||
    candidate?.candidate ||
    "Unknown Candidate"
  );
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function textOf(item) {
  if (typeof item === "string") return item;
  return (
    item?.description ||
    item?.reason ||
    item?.name ||
    item?.text ||
    JSON.stringify(item)
  );
}

function Collapsible({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #DDE4EA",
        borderRadius: 2.5,
        overflow: "hidden",
        background: "#FFFFFF",
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        sx={{
          width: "100%",
          border: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          px: 2.5,
          py: 1.8,
          background: "#FFFFFF",
          textAlign: "left",
          color: "#17212B",
          minHeight: 58,
          "&:hover": { background: "#F8FAFC" },
        }}
      >
        {icon}
        <Typography sx={{ flex: 1, fontSize: 17, fontWeight: 900 }}>
          {title}
        </Typography>
        <ExpandMoreRoundedIcon
          sx={{
            color: "#647382",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        />
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Divider sx={{ mb: 2 }} />
          {children}
        </Box>
      </Collapse>
    </Card>
  );
}

function Signal({ label, value, tone = "neutral" }) {
  const styles = {
    positive: { bg: "#EAF6F0", color: "#247354", dot: "#3E8F72" },
    warning: { bg: "#FFF6E5", color: "#8A641E", dot: "#B58A3A" },
    negative: { bg: "#FCEDEB", color: "#A54E4E", dot: "#B9685D" },
    neutral: { bg: "#F0F4F7", color: "#506170", dot: "#71879A" },
  };

  const s = styles[tone] || styles.neutral;

  return (
    <Box
      sx={{
        px: 1.6,
        py: 1.2,
        borderRadius: 2,
        background: s.bg,
        flex: "1 1 180px",
        minWidth: 0,
        border: "1px solid rgba(39,52,64,.08)",
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 900, color: s.color, textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}
      </Typography>
      <Typography sx={{ mt: .35, fontSize: 15, fontWeight: 800, color: "#17212B" }}>
        {value || "Not available"}
      </Typography>
    </Box>
  );
}

function BulletGroup({ items, positive = false, limit = 3 }) {
  const values = toArray(items).filter(Boolean);
  const shown = values.slice(0, limit);

  if (!shown.length) {
    return (
      <Typography sx={{ color: "#334454", fontSize: 15 }}>
        No specific points returned.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {shown.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-start",
            p: 1.2,
            borderRadius: 2,
            background: "#F7F9FB",
          }}
        >
          {positive ? (
            <CheckCircleRoundedIcon sx={{ mt: .15, fontSize: 18, color: "#3E8F72" }} />
          ) : (
            <WarningAmberRoundedIcon sx={{ mt: .15, fontSize: 18, color: "#B9685D" }} />
          )}
          <Typography sx={{ fontSize: 15, lineHeight: 1.6, color: "#263440" }}>
            {textOf(item)}
          </Typography>
        </Box>
      ))}
      {values.length > limit && (
        <Typography sx={{ fontSize: 12, color: "#4D5D6B", fontWeight: 800 }}>
          +{values.length - limit} more — see detailed analysis below
        </Typography>
      )}
    </Stack>
  );
}

function ScoreRing({ score }) {
  const safe = Math.max(0, Math.min(100, Number(score) || 0));
  const tone = safe >= 80 ? "#3E8F72" : safe >= 60 ? "#B58A3A" : "#B9685D";

  return (
    <Box
      sx={{
        width: 150,
        height: 150,
        borderRadius: "50%",
        background: `conic-gradient(${tone} ${safe}%, #E8EDF1 0)`,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 116,
          height: 116,
          borderRadius: "50%",
          background: "#FFFFFF",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 34, lineHeight: 1, fontWeight: 900, color: "#17212B" }}>
            {safe.toFixed(0)}
          </Typography>
          <Typography sx={{ mt: .5, fontSize: 11, fontWeight: 800, color: "#4B5B69", textTransform: "uppercase" }}>
            fit score
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function FactorBars({ factors }) {
  const entries = Object.entries(factors || {}).filter(([, value]) => value);
  const visible = entries.slice(0, 6);

  if (!visible.length) {
    return (
      <Typography sx={{ color: "#687786", fontSize: 14 }}>
        Detailed factor analysis was not returned by the evaluator.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.8}>
      {visible.map(([key, value]) => (
        <Box key={key}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: .7 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#273540", textTransform: "capitalize" }}>
              {key.replaceAll("_", " ")}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#425362" }}>
              evaluated
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: 6,
              borderRadius: 10,
              background: "#E8EDF1",
              "& .MuiLinearProgress-bar": {
                borderRadius: 10,
                background: "#7890A5",
              },
            }}
          />
          <Typography sx={{ mt: .7, fontSize: 13, lineHeight: 1.55, color: "#334454" }}>
            {String(value)}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

function CandidateDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state;

  if (!candidate) {
    return (
      <Box sx={{ minHeight: "100vh", background: "#F6F8FA", display: "grid", placeItems: "center", p: 3 }}>
        <Card elevation={0} sx={{ p: 5, maxWidth: 500, textAlign: "center", border: "1px solid #DDE4EA", borderRadius: 3 }}>
          <PsychologyRoundedIcon sx={{ fontSize: 52, color: "#7890A5" }} />
          <Typography sx={{ mt: 1, fontSize: 22, fontWeight: 850, color: "#17212B" }}>
            No Evaluation Selected
          </Typography>
          <Typography sx={{ mt: 1, color: "#334454" }}>
            Select a candidate from the search results to view the AI assessment.
          </Typography>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/results")}
            variant="contained"
            sx={{ mt: 3, textTransform: "none", fontWeight: 800 }}
          >
            Back to Results
          </Button>
        </Card>
      </Box>
    );
  }

  const name = getName(candidate);
  const score = Number(candidate.overall_score ?? 0);
  const semanticScore = Number(candidate.semantic_score ?? 0);
  const recommendation = candidate.recommendation || "Under Review";
  const confidence = candidate.confidence || "N/A";

  const contextualTime =
    candidate._contextual_total_time ??
    candidate.contextual_total_time ??
    null;

  const geminiTime =
    candidate._contextual_time ??
    candidate.contextual_evaluation_time ??
    null;

  const factorAnalysis =
    candidate.factor_analysis &&
    typeof candidate.factor_analysis === "object"
      ? candidate.factor_analysis
      : {};

  const strengths = toArray(candidate.strengths);
  const gaps = toArray(candidate.gaps);

  const recommendationTone =
    recommendation === "Highly Recommended"
      ? "positive"
      : recommendation === "Recommended"
      ? "warning"
      : "negative";

  const recommendationBg =
    recommendationTone === "positive" ? "#EAF6F0" :
    recommendationTone === "warning" ? "#FFF6E5" : "#FCEDEB";

  const recommendationColor =
    recommendationTone === "positive" ? "#247354" :
    recommendationTone === "warning" ? "#8A641E" : "#A54E4E";

  return (
    <Box sx={{ minHeight: "100vh", background: "#F3F6F8", py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/results")}
          sx={{ mb: 2, color: "#566675", fontWeight: 800, textTransform: "none" }}
        >
          Back to Search Results
        </Button>

        {/* The recruiter should understand this screen in a few seconds. */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #D3DCE4",
            borderRadius: 3,
            overflow: "hidden",
            mb: 2,
            background: "#FFFFFF",
          }}
        >
          <Box sx={{ height: 5, background: "#55718F" }} />
          <Box sx={{ p: { xs: 2.5, md: 3 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography sx={{ fontSize: 12, fontWeight: 900, color: "#71808D", textTransform: "uppercase", letterSpacing: ".1em" }}>
                  AI Candidate Assessment
                </Typography>
                <Typography sx={{ mt: .7, fontSize: { xs: 27, md: 35 }, fontWeight: 900, color: "#17212B", letterSpacing: "-.03em" }}>
                  {name}
                </Typography>
                <Typography sx={{ mt: .8, fontSize: 15, color: "#334454" }}>
                  AI evaluation against the uploaded job description
                </Typography>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    background: recommendationBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 900, color: recommendationColor, textTransform: "uppercase", letterSpacing: ".08em" }}>
                      AI recommendation
                    </Typography>
                    <Typography sx={{ mt: .4, fontSize: 21, fontWeight: 900, color: "#17212B" }}>
                      {recommendation}
                    </Typography>
                  </Box>
                  <CheckCircleRoundedIcon sx={{ fontSize: 34, color: recommendationColor }} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* First screen: score + the handful of signals a recruiter needs. */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #DCE3E9",
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
                background: "#FFFFFF",
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 900, color: "#71808D", textTransform: "uppercase", letterSpacing: ".08em" }}>
                At a glance
              </Typography>

              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2.5 }}>
                <ScoreRing score={score} />
                <Box>
                  <Typography sx={{ fontSize: 17, fontWeight: 900, color: "#17212B" }}>
                    Overall role fit
                  </Typography>
                  <Typography sx={{ mt: .6, fontSize: 15, lineHeight: 1.65, color: "#334454" }}>
                    {score >= 80
                      ? "The evaluation found strong alignment with the role."
                      : score >= 60
                      ? "The evaluation found meaningful alignment with some areas to review."
                      : "The evaluation found several areas that need closer review."}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #DCE3E9",
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
                background: "#FFFFFF",
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 900, color: "#71808D", textTransform: "uppercase", letterSpacing: ".08em" }}>
                Key signals
              </Typography>

              <Grid container spacing={1.2} sx={{ mt: 1.5 }}>
                <Grid item xs={6}>
                  <Signal label="Confidence" value={confidence} tone="neutral" />
                </Grid>
                <Grid item xs={6}>
                  <Signal
                    label="Semantic match"
                    value={`${semanticScore.toFixed(1)}%`}
                    tone={semanticScore >= 60 ? "positive" : "warning"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Signal label="Strengths" value={`${strengths.length} identified`} tone="positive" />
                </Grid>
                <Grid item xs={6}>
                  <Signal
                    label="Gaps"
                    value={`${gaps.length} identified`}
                    tone={gaps.length > 0 ? "warning" : "positive"}
                  />
                </Grid>
              </Grid>

              {(contextualTime || geminiTime) && (
                <Typography sx={{ mt: 2, fontSize: 12, color: "#71808D" }}>
                  Evaluation completed in{" "}
                  <strong>{contextualTime ? `${Number(contextualTime).toFixed(2)} sec` : "—"}</strong>
                  {geminiTime ? ` • Gemini response ${Number(geminiTime).toFixed(2)} sec` : ""}
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Don't make the recruiter read the AI explanation immediately. */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: "100%", p: 2.5, border: "1px solid #DCE3E9", borderRadius: 3, background: "#FFFFFF" }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                <LightbulbRoundedIcon sx={{ color: "#B58A3A" }} />
                <Typography sx={{ fontSize: 16, fontWeight: 850, color: "#17212B" }}>
                  Why this candidate stands out
                </Typography>
              </Box>
              <BulletGroup items={candidate.strengths} positive limit={3} />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: "100%", p: 2.5, border: "1px solid #DCE3E9", borderRadius: 3, background: "#FFFFFF" }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                <WarningAmberRoundedIcon sx={{ color: "#B9685D" }} />
                <Typography sx={{ fontSize: 16, fontWeight: 850, color: "#17212B" }}>
                  What needs attention
                </Typography>
              </Box>
              <BulletGroup items={candidate.gaps} limit={3} />
            </Card>
          </Grid>
        </Grid>

        <Stack spacing={2}>
          <Collapsible
            title="Why did the AI reach this result?"
            icon={<PsychologyRoundedIcon sx={{ color: "#55718F" }} />}
            defaultOpen={false}
          >
            <Typography sx={{ fontSize: 16, lineHeight: 1.75, color: "#263440" }}>
              {candidate.reason || "No detailed reasoning was returned."}
            </Typography>
          </Collapsible>

          <Collapsible
            title="Role fit explanation"
            icon={<TrendingUpRoundedIcon sx={{ color: "#55718F" }} />}
          >
            <Typography sx={{ fontSize: 15, lineHeight: 1.75, color: "#263440" }}>
              {candidate.role_fit || "No role-fit explanation was returned."}
            </Typography>
          </Collapsible>

          <Collapsible
            title="Detailed strengths, gaps & requirements"
            icon={<BoltRoundedIcon sx={{ color: "#55718F" }} />}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 900, color: "#247354" }}>
                  Strengths
                </Typography>
                <BulletGroup items={candidate.strengths} positive limit={20} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 900, color: "#A54E4E" }}>
                  Gaps
                </Typography>
                <BulletGroup items={candidate.gaps} limit={20} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ mt: 2, mb: 1, fontSize: 14, fontWeight: 900, color: "#566675" }}>
                  Compensating factors
                </Typography>
                <BulletGroup items={candidate.compensating_factors} positive limit={20} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ mt: 2, mb: 1, fontSize: 14, fontWeight: 900, color: "#A54E4E" }}>
                  Critical requirements missing
                </Typography>
                <BulletGroup items={candidate.critical_requirements_missing} limit={20} />
              </Grid>
            </Grid>
          </Collapsible>

          <Collapsible
            title="How the AI evaluated the candidate"
            icon={<SpeedRoundedIcon sx={{ color: "#55718F" }} />}
          >
            <FactorBars factors={factorAnalysis} />
          </Collapsible>
        </Stack>

      </Container>
    </Box>
  );
}

export default CandidateDetails;
