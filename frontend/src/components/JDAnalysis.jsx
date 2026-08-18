import { Paper, Typography, Box, Chip, Divider } from "@mui/material";
import { colors, mono } from "../theme/theme.js";

function JDAnalysis({ analysis }) {
  if (!analysis) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: `1px dashed ${colors.hairlineStrong}`,
          bgcolor: colors.paper,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.08em", color: colors.slateFaint }}>
          NO REQUISITION LOADED
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13.5, color: colors.slate }}>
          Upload or generate a JD to see the brief here.
        </Typography>
      </Paper>
    );
  }

  const experience =
    typeof analysis.experience === "object"
      ? `${analysis.experience.min} – ${analysis.experience.max} yrs`
      : analysis.experience || "Not specified";

  const location =
    typeof analysis.location === "object"
      ? [analysis.location.city, analysis.location.state, analysis.location.country].filter(Boolean).join(", ")
      : analysis.location || "Not specified";

  const education = Array.isArray(analysis.education) ? analysis.education.join(", ") : analysis.education;

  const skills = Array.isArray(analysis.skills) ? analysis.skills : [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${colors.hairline}`,
        bgcolor: colors.paperRaised,
        position: "sticky",
        top: 20,
      }}
    >
      <Typography sx={eyebrow}>Requisition Brief</Typography>
      <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19, color: colors.ink, mt: 0.25 }}>
        AI JD Analysis
      </Typography>

      <Divider sx={{ my: 2.25, borderColor: colors.hairline }} />

      <Field label="Job Title" value={analysis.job_title || "—"} large />
      <Field label="Experience" value={experience} />
      <Field label="Location" value={location} />
      <Field label="Education" value={education || "Not specified"} last />

      <Divider sx={{ my: 2.25, borderColor: colors.hairline }} />

      <Typography sx={{ ...eyebrow, mb: 1.25 }}>Required Skills</Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              sx={{
                bgcolor: colors.brassSoft,
                color: colors.brassDark,
                fontWeight: 700,
                fontSize: "0.72rem",
                border: `1px solid ${colors.hairline}`,
              }}
            />
          ))
        ) : (
          <Typography sx={{ fontSize: 13, color: colors.slateFaint }}>None extracted.</Typography>
        )}
      </Box>
    </Paper>
  );
}

function Field({ label, value, large, last }) {
  return (
    <Box sx={{ mb: last ? 0 : 2 }}>
      <Typography sx={{ ...eyebrow, mb: 0.4 }}>{label}</Typography>
      <Typography
        sx={{
          fontSize: large ? 16 : 14,
          fontWeight: large ? 700 : 500,
          color: colors.ink,
          fontFamily: large ? "'Fraunces', serif" : "'Manrope', sans-serif",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

const eyebrow = {
  fontFamily: mono,
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: colors.slateFaint,
};

export default JDAnalysis;
