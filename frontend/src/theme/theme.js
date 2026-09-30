// ============================================================================
// DESIGN SYSTEM — "AI Recruitment"
// ----------------------------------------------------------------------------
// Concept: Light, modern executive interface utilizing exact sampled hex values:
// Warm Alabaster, Slate Blue, Muted Sage, Off-White card surfaces, and Ink accents.
//
// Fonts:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
// ============================================================================

import { createTheme, alpha } from "@mui/material/styles";

export const colors = {
  ink: "#111111",          // Main heading and primary body text
  inkSoft: "#2D3136",
  inkFaint: "#4A5056",
  paper: "#F3EFE6",        // Main canvas background (Warm Alabaster / Light Sand)
  paperRaised: "#FAF8F5",  // Cards, inputs, and elevated containers (Soft Off-White)
  hairline: "#E3DEC3",     // Subtle card borders and dividers (Light Beige Hairline)
  hairlineStrong: "#C5C0B4",
  brass: "#6A82A0",        // Active nav & primary action buttons (Slate Blue)
  brassDark: "#0B1E38",    // Header buttons / high-contrast elements (Dark Navy / Ink)
  brassSoft: "#E8EEF5",    // Hover states & light accents
  teal: "#85A090",         // Selected pill tag / active state (Muted Sage Green)
  tealSoft: "#E2EAE4",
  amber: "#A87241",        // Secondary status indicator (English Ochre)
  amberSoft: "#F4ECE3",
  crimson: "#A65151",      // Error / alert status (Soft English Rust)
  crimsonSoft: "#F6EAE7",
  slate: "#888B90",        // Secondary / muted text (Faded Slate)
  slateFaint: "#888B90",
};

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

export const mono = "'IBM Plex Mono', ui-monospace, monospace";

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