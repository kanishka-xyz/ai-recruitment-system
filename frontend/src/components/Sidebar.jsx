import React from "react";
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import { colors, mono } from "../theme/theme.js";

const menu = [
  { title: "Dashboard", icon: <DashboardRoundedIcon /> , active: true },
  { title: "Candidates", icon: <GroupsRoundedIcon /> },
  { title: "Resume Database", icon: <FolderRoundedIcon /> },
  { title: "Analytics", icon: <AnalyticsRoundedIcon /> },
  { title: "Settings", icon: <SettingsRoundedIcon /> },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: 232,
        minHeight: "100vh",
        bgcolor: colors.ink,
        color: "#F4F2EC",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: `1px solid ${colors.inkSoft}`,
      }}
    >
      <Box>
        {/* Wordmark */}
        <Box sx={{ px: 3, pt: 3.5, pb: 3, borderBottom: `1px solid ${colors.inkSoft}` }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "6px",
                border: `1.5px solid ${colors.brass}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, color: colors.brass }}>
                D
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, lineHeight: 1.1 }}>
                Dossier
              </Typography>
              <Typography sx={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: "#8B92A5" }}>
                RECRUITMENT
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu */}
        <List sx={{ px: 2, pt: 2.5 }}>
          {menu.map((item) => (
            <ListItemButton
              key={item.title}
              sx={{
                mb: 0.5,
                borderRadius: 1.5,
                py: 1,
                px: 1.5,
                minHeight: 42,
                bgcolor: item.active ? colors.brass : "transparent",
                color: item.active ? "#1B1400" : "#C8CCDA",
                "&:hover": {
                  bgcolor: item.active ? colors.brass : "rgba(255,255,255,0.06)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 34,
                  "& svg": { fontSize: 19 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: 13.5,
                  fontWeight: item.active ? 700 : 600,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Bottom status card */}
      <Tooltip title="AI matching engine is active" placement="right">
        <Box
          sx={{
            m: 2,
            p: 1.75,
            borderRadius: 2,
            border: `1px solid ${colors.inkSoft}`,
            bgcolor: colors.inkSoft,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: colors.teal }} />
            <Typography sx={{ fontFamily: mono, fontSize: 10.5, letterSpacing: "0.08em", color: "#B7BCC9" }}>
              MATCHING ENGINE LIVE
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default Sidebar;
