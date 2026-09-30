import { useMemo, useState } from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { exportCandidatesToExcel } from "../utils/exportcandidates.js";

import { Box, Button, Card, CardContent, Grid, Stack, Typography, Chip } from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import RecommendRoundedIcon from "@mui/icons-material/RecommendRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

import { useLocation, useNavigate } from "react-router-dom";

import JDAnalysis from "../components/JDAnalysis.jsx";
import CandidateTable from "../components/candidateTable.jsx";
import { colors, mono } from "../theme/theme.js";

function StatCard({ title, value, icon, accent }) {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${colors.hairline}`, height: "100%", bgcolor: colors.paperRaised }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography sx={eyebrow}>{title}</Typography>
            <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 32, color: colors.ink, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: accent + "1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accent,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [search, setSearch] = useState("");

  if (!state) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: colors.paper, p: 5 }}>
        <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, color: colors.ink }}>
          No Search Results
        </Typography>
        <Typography sx={{ color: colors.slate, mt: 1 }}>
          Please upload a job description to search for suitable candidates.
        </Typography>
        <Button
          sx={{ mt: 2.5, borderRadius: 1.5, bgcolor: colors.ink, fontWeight: 700, "&:hover": { bgcolor: colors.inkSoft } }}
          variant="contained"
          disableElevation
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </Box>
    );
  }

  const analysis = state.analysis || state.job_description || {};
  const candidates = Array.isArray(state.candidates) ? state.candidates : [];

  const highlyRecommended = candidates.filter((c) => c.recommendation === "Highly Recommended").length;
  const recommended = candidates.filter((c) => c.recommendation === "Recommended").length;

  const averageScore =
    candidates.length > 0
      ? (candidates.reduce((sum, c) => sum + Number(c.overall_score || 0), 0) / candidates.length).toFixed(1)
      : "0.0";

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return candidates;

    return candidates.filter((candidate) => {
      const resume = candidate.resume || {};
      const name = resume.name || resume.candidate || resume.candidate_name || resume.full_name || "";
      const role = resume.current_role || resume.designation || resume.job_title || "";
      const skills = Array.isArray(resume.skills) ? resume.skills.join(" ") : String(resume.skills || "");

      return (
        name.toLowerCase().includes(query) ||
        role.toLowerCase().includes(query) ||
        skills.toLowerCase().includes(query)
      );
    });
  }, [candidates, search]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.paper, p: { xs: 2, md: 4 } }}>
      {/* HEADER CARD */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${colors.hairline}`,
          bgcolor: colors.paperRaised,
          p: { xs: 2.5, md: 3.5 },
          mb: 4,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 4,
            height: "100%",
            bgcolor: colors.brass,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: { xs: "1.8rem", md: "2.25rem" },
                color: colors.ink,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              Candidate Evaluation
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="body2" sx={{ color: colors.slate, fontSize: "0.9rem", fontWeight: 500 }}>
                Ranked suitability evaluation for
              </Typography>
              <Chip
                icon={<WorkOutlineRoundedIcon sx={{ fontSize: "15px !important", color: `${colors.brassDark} !important` }} />}
                label={analysis.job_title || "Selected Role"}
                sx={{
                  bgcolor: colors.brassSoft,
                  color: colors.brassDark,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  height: 28,
                  borderRadius: "8px",
                  border: `1px solid ${colors.hairlineStrong}`,
                  "& .MuiChip-label": { px: 1.25 },
                }}
              />
            </Stack>
          </Box>

          <Button
            onClick={() => navigate("/")}
            startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              bgcolor: colors.paper,
              color: colors.ink,
              border: `1px solid ${colors.hairlineStrong}`,
              px: 3,
              py: 1.1,
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.85rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: colors.ink,
                color: "#FFFFFF",
                borderColor: colors.ink,
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              },
            }}
          >
            New Search
          </Button>
        </Box>
      </Card>

      {/* STATS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Evaluated Candidates" value={candidates.length} icon={<GroupsRoundedIcon />} accent={colors.slate} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Highly Recommended" value={highlyRecommended} icon={<EmojiEventsRoundedIcon />} accent={colors.teal} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Recommended" value={recommended} icon={<RecommendRoundedIcon />} accent={colors.brass} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Average Fit" value={`${averageScore}%`} icon={<InsightsRoundedIcon />} accent={colors.amber} />
        </Grid>
      </Grid>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "340px minmax(0, 1fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <JDAnalysis analysis={analysis} />

        <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${colors.hairline}`, bgcolor: colors.paperRaised }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 21, color: colors.ink }}>
                  Ranked Candidates
                </Typography>
                <Typography sx={{ color: colors.slate, fontSize: 13.5, mt: 0.4 }}>
                  Ranked by overall contextual suitability for this role
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  label={`${candidates.length} Candidates`}
                  sx={{ bgcolor: colors.brassSoft, color: colors.brassDark, fontWeight: 700 }}
                />

                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<DownloadRoundedIcon />}
                  onClick={() => exportCandidatesToExcel(candidates, analysis)}
                  sx={{ bgcolor: colors.teal, fontWeight: 700, borderRadius: 1.5, "&:hover": { bgcolor: "#175A4B" } }}
                >
                  Export Final Output
                </Button>
              </Stack>
            </Box>

            <CandidateTable candidates={filteredCandidates} analysis={analysis} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

const eyebrow = {
  fontFamily: mono,
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: colors.slateFaint,
};

export default Results;