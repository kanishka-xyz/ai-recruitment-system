import { useMemo, useState } from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { exportCandidatesToExcel } from "../utils/exportcandidates.js";

import { Box, Button, Card, CardContent, Grid, Stack, Typography, Chip } from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import RecommendRoundedIcon from "@mui/icons-material/RecommendRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

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
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography sx={eyebrow}>Case File</Typography>
          <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30, color: colors.ink, mt: 0.25 }}>
            Candidate Evaluation
          </Typography>
          <Typography sx={{ color: colors.slate, mt: 0.5 }}>
            Ranked results for <strong style={{ color: colors.ink }}>{analysis.job_title || "the selected role"}</strong>
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/")}
          sx={{ borderRadius: 1.5, px: 3, fontWeight: 700, borderColor: colors.hairlineStrong, color: colors.ink }}
        >
          New Search
        </Button>
      </Box>

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
