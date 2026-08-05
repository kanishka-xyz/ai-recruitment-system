import { useMemo, useState } from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { exportCandidatesToExcel } from "../utils/exportCandidates.js";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import RecommendRoundedIcon from "@mui/icons-material/RecommendRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { useLocation, useNavigate } from "react-router-dom";

import JDAnalysis from "../components/JDAnalysis.jsx";
import CandidateTable from "../components/CandidateTable.jsx";


function StatCard({ title, value, icon }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        height: "100%",
        bgcolor: "#FFFFFF",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ mt: 1 }}
            >
              {value}
            </Typography>
          </Box>

          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
}


function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [search, setSearch] = useState("");

  // =====================================================
  // No result state
  // =====================================================

  if (!state) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
          p: 5,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          No Search Results
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Please upload a job description to search
          for suitable candidates.
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </Box>
    );
  }

  console.log("Results State:", state);

  // =====================================================
  // Data
  // =====================================================

  const analysis =
    state.analysis ||
    state.job_description ||
    {};

  const candidates =
    Array.isArray(state.candidates)
      ? state.candidates
      : [];

  // =====================================================
  // Statistics
  // =====================================================

  const highlyRecommended = candidates.filter(
    (candidate) =>
      candidate.recommendation ===
      "Highly Recommended"
  ).length;

  const recommended = candidates.filter(
    (candidate) =>
      candidate.recommendation === "Recommended"
  ).length;

  const averageScore =
    candidates.length > 0
      ? (
          candidates.reduce(
            (sum, candidate) =>
              sum +
              Number(
                candidate.overall_score || 0
              ),
            0
          ) / candidates.length
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // Search Candidates
  // =====================================================

  const filteredCandidates = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      const resume =
        candidate.resume || {};

      const name =
        resume.name ||
        resume.candidate ||
        resume.candidate_name ||
        resume.full_name ||
        "";

      const role =
        resume.current_role ||
        resume.designation ||
        resume.job_title ||
        "";

      const skills = Array.isArray(
        resume.skills
      )
        ? resume.skills.join(" ")
        : String(resume.skills || "");

      return (
        name.toLowerCase().includes(query) ||
        role.toLowerCase().includes(query) ||
        skills.toLowerCase().includes(query)
      );
    });
  }, [candidates, search]);

  // =====================================================
  // UI
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
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
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
            AI Recruitment Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Contextual candidate evaluation for{" "}
            <strong>
              {analysis.job_title ||
                "the selected role"}
            </strong>
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() => navigate("/")}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          New Search
        </Button>
      </Box>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Evaluated Candidates"
            value={candidates.length}
            icon={
              <GroupsRoundedIcon
                color="primary"
                sx={{ fontSize: 40 }}
              />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Highly Recommended"
            value={highlyRecommended}
            icon={
              <EmojiEventsRoundedIcon
                color="success"
                sx={{ fontSize: 40 }}
              />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Recommended"
            value={recommended}
            icon={
              <RecommendRoundedIcon
                color="warning"
                sx={{ fontSize: 40 }}
              />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Average Overall Fit"
            value={`${averageScore}%`}
            icon={
              <InsightsRoundedIcon
                color="secondary"
                sx={{ fontSize: 40 }}
              />
            }
          />
        </Grid>
      </Grid>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "340px minmax(0, 1fr)",
          },

          gap: 3,
          alignItems: "start",
        }}
      >

        {/* JD ANALYSIS */}

        <JDAnalysis
          analysis={analysis}
        />

        {/* CANDIDATE RESULTS */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
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

            {/* Candidate Header */}

            {/* Candidate Header */}

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
    <Typography
      variant="h5"
      fontWeight={700}
      color="#0F172A"
    >
      Ranked Candidates
    </Typography>

    <Typography
      color="text.secondary"
      variant="body2"
      sx={{ mt: 0.5 }}
    >
      Ranked by overall contextual suitability for this role
    </Typography>
  </Box>

  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    flexWrap="wrap"
    useFlexGap
  >
    <Chip
      color="primary"
      label={`${candidates.length} Candidates`}
      sx={{
        fontWeight: 600,
      }}
    />

    <Button
      variant="contained"
      color="success"
      startIcon={<DownloadRoundedIcon />}
      onClick={() =>
        exportCandidatesToExcel(
          candidates,
          analysis
        )
      }
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 2,
      }}
    >
      Export Final Output
    </Button>
  </Stack>
</Box>

            {/* Candidate Table */}

            <CandidateTable
              candidates={
                filteredCandidates
              }
              analysis={analysis}
            />

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Results;