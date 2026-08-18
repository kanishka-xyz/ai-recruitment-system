import React from "react";
import { Box, Card, Typography, FormControl, Select, MenuItem } from "@mui/material";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import { colors, mono } from "../theme/theme.js";

function SearchSource({ source, setSource, platform, setPlatform }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, alignItems: "center" }}>
      <Typography sx={{ ...eyebrow, mr: 0.5 }}>Source</Typography>

      {/* Internal database */}
      <Card
        elevation={0}
        onClick={() => setSource("internal")}
        sx={{
          width: 240,
          height: 54,
          display: "flex",
          alignItems: "center",
          px: 2,
          cursor: "pointer",
          borderRadius: 2,
          border: source === "internal" ? `1.5px solid ${colors.brass}` : `1px solid ${colors.hairline}`,
          bgcolor: source === "internal" ? colors.brassSoft : colors.paperRaised,
          transition: "all 0.15s ease",
        }}
      >
        <StorageRoundedIcon sx={{ color: colors.brassDark, mr: 1.5, fontSize: 20 }} />
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: colors.ink }}>
            Internal Database
          </Typography>
          <Typography sx={{ fontFamily: mono, fontSize: "0.65rem", color: colors.slateFaint }}>
            YOUR TALENT POOL
          </Typography>
        </Box>
      </Card>

      {/* External platform */}
      <FormControl size="small" sx={{ width: 260 }}>
        <Select
          displayEmpty
          value={platform}
          onChange={(e) => {
            setSource("external");
            setPlatform(e.target.value);
          }}
          sx={{
            height: 54,
            borderRadius: 2,
            bgcolor: source === "external" ? colors.brassSoft : colors.paperRaised,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: source === "external" ? colors.brass : colors.hairline,
              borderWidth: source === "external" ? 1.5 : 1,
            },
          }}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <PublicRoundedIcon sx={{ color: colors.brassDark, fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: colors.ink }}>
                    External Platform
                  </Typography>
                </Box>
              );
            }
            return (
              <Box display="flex" alignItems="center" gap={1.5}>
                <PublicRoundedIcon sx={{ color: colors.brassDark, fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: colors.ink }}>
                  {selected}
                </Typography>
              </Box>
            );
          }}
        >
          <MenuItem value="LinkedIn Recruiter">LinkedIn Recruiter</MenuItem>
          <MenuItem value="Naukri Recruiter">Naukri Recruiter</MenuItem>
          <MenuItem value="Greenhouse ATS">Greenhouse ATS</MenuItem>
          <MenuItem value="Workday">Workday</MenuItem>
        </Select>
      </FormControl>
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

export default SearchSource;
