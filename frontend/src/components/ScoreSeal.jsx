import React from "react";
import { Box, Typography } from "@mui/material";
import { colors, mono, scoreTier } from "../theme/theme.js";

/**
 * ScoreSeal — the signature element of the "Dossier" design system.
 *
 * Every candidate is stamped with a fit score. Rather than a generic
 * progress bar, the score reads like a wax seal / assessor's stamp:
 * a ringed circle with the number set in the display serif and a
 * tier label in tracked-out mono underneath. Used in the candidate
 * table, the results grid, and the candidate dossier hero.
 */
function ScoreSeal({ score = 0, size = 64, showLabel = true }) {
  const value = Math.min(Math.max(Number(score) || 0, 0), 100);
  const tier = scoreTier(value);
  const stroke = Math.max(3, size * 0.06);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.hairline}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tier.main}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
        </svg>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: size * 0.3,
              lineHeight: 1,
              color: colors.ink,
            }}
          >
            {value.toFixed(0)}
          </Typography>
          <Typography sx={{ fontFamily: mono, fontSize: size * 0.11, color: colors.slateFaint }}>
            /100
          </Typography>
        </Box>
      </Box>
      {showLabel && (
        <Typography
          sx={{
            fontFamily: mono,
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: tier.main,
          }}
        >
          {tier.name}
        </Typography>
      )}
    </Box>
  );
}

export default ScoreSeal;
