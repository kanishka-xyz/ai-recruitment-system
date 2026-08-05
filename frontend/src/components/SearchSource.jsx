import {
  Box,
  Card,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

function SearchSource({
  source,
  setSource,
  platform,
  setPlatform,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "center",
      }}
    >
      {/* Internal Database */}

      <Card
        elevation={0}
        onClick={() => setSource("internal")}
        sx={{
          width: 260,
          height: 56,

          display: "flex",
          alignItems: "center",

          px: 2,
          cursor: "pointer",

          border:
            source === "internal"
              ? "2px solid #5B5CEB"
              : "1px solid #E5E7EB",

          bgcolor:
            source === "internal"
              ? "#F7F7FF"
              : "#fff",
        }}
      >
        <StorageRoundedIcon
          sx={{
            color: "#5B5CEB",
            mr: 2,
          }}
        />

        <Typography fontWeight={600}>
          Internal Database
        </Typography>
      </Card>

      {/* External Platform */}

      <FormControl
        size="small"
        sx={{
          width: 280,
        }}
      >
        <Select
          displayEmpty
          value={platform}
          onChange={(e) => {
            setSource("external");
            setPlatform(e.target.value);
          }}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <PublicRoundedIcon
                    sx={{ color: "#5B5CEB" }}
                  />

                  <Typography>
                    External Platform
                  </Typography>
                </Box>
              );
            }

            return selected;
          }}
        >
          <MenuItem value="LinkedIn Recruiter">
            LinkedIn Recruiter
          </MenuItem>

          <MenuItem value="Naukri Recruiter">
            Naukri Recruiter
          </MenuItem>

          <MenuItem value="Greenhouse ATS">
            Greenhouse ATS
          </MenuItem>

          <MenuItem value="Workday">
            Workday
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default SearchSource;