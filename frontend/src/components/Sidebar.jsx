import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremium";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesome";

const menu = [
  {
    title: "Dashboard",
    icon: <DashboardRoundedIcon />,
    active: true,
  },

  {
    title: "Candidates",
    icon: <GroupsRoundedIcon />,
  },
  {
    title: "Resume Database",
    icon: <FolderRoundedIcon />,
  },
  {
    title: "Analytics",
    icon: <AnalyticsRoundedIcon />,
  },
  {
    title: "Settings",
    icon: <SettingsRoundedIcon />,
  },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: 160,
        height: "150vh",
        background:
          "linear-gradient(180deg,#0F172A 0%, #1E1B4B 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
      }}
    >
      <Box>
        {/* Logo */}

        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mb={6}
        >
          <Box>
            

            <Typography
              fontSize={10}
              color="#CBD5E1"
            >
              AI Recruitment
            </Typography>
          </Box>
        </Box>

        {/* Menu */}

        <List>

          {menu.map((item) => (

            <ListItemButton
              key={item.title}
              sx={{
                mb: 0.3,
                borderRadius: 1.5,

                bgcolor: item.active
                  ? "#5B5CEB"
                  : "transparent",

                "&:hover": {
                  bgcolor: "#5B5CEB",
                },

                py: 0.55,
                px: 1.2,
                minHeight: 36
              }}
            >
              <ListItemIcon
                sx={{
                    color: "white",
                    minWidth: 10,
                    display: "flex",
                    justifyContent: "center",

                    "& svg": {
                    fontSize: 18,
                    },
                }}
                ></ListItemIcon>
              <ListItemText
                primary={item.title}
              />
            </ListItemButton>

          ))}

        </List>
      </Box>

      {/* Bottom Card */}

      
    </Box>
  );
}

export default Sidebar;