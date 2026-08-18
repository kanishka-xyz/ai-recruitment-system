import React from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Button,
  InputAdornment,
  Stack,
  IconButton,
  Avatar,
  Badge,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { colors, mono } from "../theme/theme.js";

function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: colors.paperRaised,
        borderBottom: `1px solid ${colors.hairline}`,
        color: colors.ink,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 }, minHeight: "72px !important" }}>
        {/* Search */}
        <TextField
          placeholder="Search candidates, JDs, skills…"
          variant="outlined"
          size="small"
          sx={{
            width: { xs: 220, sm: 320, md: 380 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: colors.paper,
              fontSize: "0.875rem",
              fontFamily: mono,
              transition: "all 0.15s ease-in-out",
              "& fieldset": { borderColor: colors.hairline },
              "&:hover fieldset": { borderColor: colors.hairlineStrong },
              "&.Mui-focused": {
                bgcolor: colors.paperRaised,
                boxShadow: `0 0 0 3px ${colors.brassSoft}`,
                "& fieldset": { borderColor: colors.brass },
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.slateFaint, fontSize: 19 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Actions */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddRoundedIcon />}
            sx={{
              bgcolor: colors.ink,
              color: "#F4F2EC",
              borderRadius: "8px",
              px: 2.25,
              py: 0.9,
              fontSize: "0.85rem",
              fontWeight: 700,
              "&:hover": { bgcolor: colors.inkSoft },
            }}
          >
            Create JD
          </Button>

          <IconButton
            size="small"
            sx={{
              color: colors.slate,
              p: 1,
              borderRadius: "8px",
              border: `1px solid ${colors.hairline}`,
              "&:hover": { bgcolor: colors.paper, color: colors.ink },
            }}
          >
            <Badge variant="dot" sx={{ "& .MuiBadge-dot": { bgcolor: colors.crimson } }}>
              <NotificationsNoneRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ height: 24, my: "auto", mx: 0.5 }} />

          {/* Recruiter identity */}
          <Button
            disableRipple
            endIcon={<KeyboardArrowDownRoundedIcon sx={{ color: colors.slateFaint }} />}
            sx={{ p: 0.5, pr: 1, borderRadius: "8px", "&:hover": { bgcolor: colors.paper } }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: colors.brassSoft,
                  color: colors.brassDark,
                  fontFamily: "'Fraunces', serif",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                RC
              </Avatar>
              <Box textAlign="left" sx={{ display: { xs: "none", md: "block" } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: colors.ink, lineHeight: 1.2 }}>
                  Alex Morgan
                </Typography>
                <Typography sx={{ fontFamily: mono, fontSize: "0.68rem", color: colors.slateFaint, letterSpacing: "0.04em" }}>
                  LEAD RECRUITER
                </Typography>
              </Box>
            </Stack>
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
