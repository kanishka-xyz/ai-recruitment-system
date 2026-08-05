import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";

function JDAnalysis({ analysis }) {
  if (!analysis) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        No JD Analysis
      </Paper>
    );
  }

  const experience =
    typeof analysis.experience === "object"
      ? `${analysis.experience.min} - ${analysis.experience.max} Years`
      : analysis.experience || "Not Specified";

  const location =
    typeof analysis.location === "object"
      ? [
          analysis.location.city,
          analysis.location.state,
          analysis.location.country,
        ]
          .filter(Boolean)
          .join(", ")
      : analysis.location || "Not Specified";

  const education = Array.isArray(analysis.education)
    ? analysis.education.join(", ")
    : analysis.education;

  const skills = Array.isArray(analysis.skills)
    ? analysis.skills
    : [];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        position: "sticky",
        top: 20,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        AI JD Analysis
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2">Job Title</Typography>

      <Typography mb={2}>
        {analysis.job_title}
      </Typography>

      <Typography variant="subtitle2">
        Experience
      </Typography>

      <Typography mb={2}>
        {experience}
      </Typography>

      <Typography variant="subtitle2">
        Location
      </Typography>

      <Typography mb={2}>
        {location}
      </Typography>

      <Typography variant="subtitle2">
        Education
      </Typography>

      <Typography mb={2}>
        {education}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="subtitle2"
        mb={1}
      >
        Skills
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            size="small"
          />
        ))}
      </Box>
    </Paper>
  );
}

export default JDAnalysis;