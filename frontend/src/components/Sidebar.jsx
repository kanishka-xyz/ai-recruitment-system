import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import { colors, mono } from "../theme/theme.js";


/* =========================================================
   SIDEBAR MENU
========================================================= */

const menu = [
  {
    title: "Dashboard",
    icon: <DashboardRoundedIcon />,
    path: "/",
  },
  {
    title: "Candidates",
    icon: <GroupsRoundedIcon />,
    path: "/candidates",
  },
  {
    title: "Resume Database",
    icon: <FolderRoundedIcon />,
    path: "/resume-database",
  },
  {
    title: "Analytics",
    icon: <AnalyticsRoundedIcon />,
    path: "/analytics",
  },
  {
    title: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/settings",
  },
];


/* =========================================================
   SIDEBAR COMPONENT
========================================================= */

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();


  /* =======================================================
     CHECK ACTIVE MENU ITEM
  ======================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };


  /* =======================================================
     HANDLE NAVIGATION
  ======================================================= */

  const handleNavigation = (path) => {
    /*
      Analytics and Settings routes are not currently
      defined in App.jsx.

      We don't navigate to them yet to avoid showing
      a blank/error page.
    */

    if (path === "/analytics" || path === "/settings") {
      return;
    }

    navigate(path);
  };


  return (
    <Box
      sx={{
        width: 232,
        minHeight: "100vh",

        bgcolor: colors.paper,
        color: colors.ink,

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        borderRight: `1px solid ${colors.hairline}`,

        flexShrink: 0,
      }}
    >

      {/* ===================================================
          TOP SECTION
      =================================================== */}

      <Box>

        {/* =================================================
            WORDMARK & LOGO
        ================================================= */}

        <Box
          sx={{
            px: 3,
            pt: 3.5,
            pb: 3,

            borderBottom: `1px solid ${colors.hairline}`,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >

            {/* Logo */}

            <Box
              sx={{
                width: 32,
                height: 32,

                borderRadius: "6px",

                bgcolor: colors.ink,
                color: "#FFFFFF",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                H
              </Typography>
            </Box>


            {/* Brand Name */}

            <Box>

              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: 1.1,
                  color: colors.ink,
                }}
              >
                AI Recruitment
              </Typography>

              <Typography
                sx={{
                  fontFamily: mono,
                  fontSize: 9.5,
                  letterSpacing: "0.14em",
                  color: colors.slate,
                }}
              >
                AI RECRUITMENT
              </Typography>

            </Box>

          </Box>

        </Box>


        {/* =================================================
            MENU NAVIGATION
        ================================================= */}

        <List
          sx={{
            px: 2,
            pt: 2.5,
          }}
        >

          {menu.map((item) => {

            const active = isActive(item.path);

            const disabled =
              item.path === "/analytics" ||
              item.path === "/settings";


            return (
              <Tooltip
                key={item.title}
                title={
                  disabled
                    ? `${item.title} coming soon`
                    : ""
                }
                placement="right"
              >

                <span>

                  <ListItemButton
                    onClick={() =>
                      handleNavigation(item.path)
                    }

                    disabled={disabled}

                    sx={{
                      mb: 0.5,

                      borderRadius: 1.5,

                      py: 1,
                      px: 1.5,

                      minHeight: 42,

                      bgcolor: active
                        ? colors.brass
                        : "transparent",

                      color: active
                        ? "#FFFFFF"
                        : colors.inkSoft,

                      opacity: disabled ? 0.5 : 1,

                      cursor: disabled
                        ? "not-allowed"
                        : "pointer",

                      "&:hover": {
                        bgcolor: active
                          ? colors.brassDark
                          : "rgba(0, 0, 0, 0.04)",
                      },

                      "&.Mui-disabled": {
                        color: colors.inkSoft,
                        opacity: 0.5,
                      },
                    }}
                  >

                    {/* Icon */}

                    <ListItemIcon
                      sx={{
                        color: "inherit",

                        minWidth: 34,

                        "& svg": {
                          fontSize: 19,
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>


                    {/* Text */}

                    <ListItemText
                      primary={item.title}

                      primaryTypographyProps={{
                        fontSize: 13.5,

                        fontWeight: active
                          ? 700
                          : 600,
                      }}
                    />

                  </ListItemButton>

                </span>

              </Tooltip>
            );
          })}

        </List>

      </Box>


      {/* ===================================================
          BOTTOM STATUS CARD
      =================================================== */}

      <Tooltip
        title="AI matching engine is active"
        placement="right"
      >

        <Box
          sx={{
            m: 2,

            p: 1.75,

            borderRadius: 2,

            border: `1px solid ${colors.hairline}`,

            bgcolor: colors.paperRaised,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >

            {/* Live indicator */}

            <Box
              sx={{
                width: 7,
                height: 7,

                borderRadius: "50%",

                bgcolor: colors.teal,
              }}
            />


            {/* Status */}

            <Typography
              sx={{
                fontFamily: mono,

                fontSize: 10,

                letterSpacing: "0.08em",

                color: colors.slate,

                fontWeight: 600,
              }}
            >
              MATCHING ENGINE LIVE
            </Typography>

          </Box>

        </Box>

      </Tooltip>

    </Box>
  );
}


export default Sidebar;