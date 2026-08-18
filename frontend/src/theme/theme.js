// ============================================================================
// DESIGN SYSTEM — "Dossier"
// ----------------------------------------------------------------------------
// Concept: recruiters aren't scrolling a feed, they're building a case file
// on every candidate. The palette borrows from ink, brass fasteners and
// case-folder paper rather than the default indigo/slate SaaS look. Scores
// read like a wax seal / rating stamp instead of a generic progress bar.
//
// Fonts (add to your index.html <head>, or install via @fontsource/*):
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
// ============================================================================

import { createTheme, alpha } from "@mui/material/styles";

export const colors = {
  ink: "#12151C",
  inkSoft: "#242A36",
  inkFaint: "#3A4152",
  paper: "#FAFAF8",
  paperRaised: "#FFFFFF",
  hairline: "#E3E1D8",
  hairlineStrong: "#D8D5C8",
  brass: "#B8863B",
  brassDark: "#8F6526",
  brassSoft: "#F6EEDD",
  teal: "#1F6F5C",
  tealSoft: "#E5F2EE",
  amber: "#C97A2B",
  amberSoft: "#FBEEE0",
  crimson: "#A23B3B",
  crimsonSoft: "#FBEAEA",
  slate: "#4B5468",
  slateFaint: "#8A90A0",
};

// Tier scale used by the ScoreSeal signature element and anywhere a
// candidate's fit is expressed. Kept in one place so it stays consistent.
export const scoreTier = (value) => {
  if (value >= 80) return { name: "Excellent", main: colors.teal, soft: colors.tealSoft };
  if (value >= 65) return { name: "Strong", main: colors.brass, soft: colors.brassSoft };
  if (value >= 50) return { name: "Moderate", main: colors.amber, soft: colors.amberSoft };
  return { name: "Weak", main: colors.crimson, soft: colors.crimsonSoft };
};

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: colors.paper,
      paper: colors.paperRaised,
    },
    primary: {
      main: colors.brass,
      dark: colors.brassDark,
      light: colors.brassSoft,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.teal,
      contrastText: "#FFFFFF",
    },
    success: { main: colors.teal, light: colors.tealSoft },
    warning: { main: colors.amber, light: colors.amberSoft },
    error: { main: colors.crimson, light: colors.crimsonSoft },
    text: {
      primary: colors.ink,
      secondary: colors.slate,
    },
    divider: colors.hairline,
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Fraunces', serif", fontWeight: 600, letterSpacing: "-0.01em" },
    h2: { fontFamily: "'Fraunces', serif", fontWeight: 600, letterSpacing: "-0.01em" },
    h3: { fontFamily: "'Fraunces', serif", fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontFamily: "'Fraunces', serif", fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h6: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600 },
      },
    },
  },
});

// Small helper: the mono "utility" font used for stats, scores, eyebrow
// labels and timestamps — anywhere a number needs to feel measured.
export const mono = "'IBM Plex Mono', ui-monospace, monospace";

// Reusable "eyebrow" label style (uppercase, tracked-out mono caption)
export const eyebrowSx = {
  fontFamily: mono,
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: colors.slateFaint,
};

export const cardSx = {
  bgcolor: colors.paperRaised,
  border: `1px solid ${colors.hairline}`,
  borderRadius: 3,
};

export { alpha };
export default theme;
