import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

import { colors } from "../theme/theme.js";
import api from "../services/api.js";


/* =========================================================
   HELPERS
========================================================= */

function getName(candidate) {
  return (
    candidate?.candidate_name ||
    candidate?.name ||
    candidate?.full_name ||
    candidate?.candidate ||
    "Unknown Candidate"
  );
}


function getRole(candidate) {
  return (
    candidate?.current_role ||
    candidate?.role ||
    candidate?.job_title ||
    "Candidate"
  );
}


function getExperience(candidate) {
  return (
    candidate?.total_experience_years ??
    candidate?.experience_years ??
    candidate?.experience ??
    0
  );
}


function getInitials(name) {
  if (!name) return "C";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}


function normalizeArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value];
}


/* =========================================================
   SECTION CARD
========================================================= */

function Section({ icon, title, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E1E6EB",
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,

          display: "flex",
          alignItems: "center",
          gap: 1.2,

          backgroundColor: "#FAFBFC",
          borderBottom: "1px solid #EDF0F3",
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            backgroundColor: "#EDF2F7",
            color: "#607A96",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 800,
            color: "#26313C",
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Card>
  );
}


/* =========================================================
   INFORMATION ITEM
========================================================= */

function InfoItem({ icon, label, value }) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.2,
      }}
    >
      <Box
        sx={{
          color: "#7B8B9A",
          mt: 0.2,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            color: "#8A95A1",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,
            fontSize: 14,
            fontWeight: 600,
            color: "#303C48",
            wordBreak: "break-word",
          }}
        >
          {String(value)}
        </Typography>
      </Box>
    </Box>
  );
}


/* =========================================================
   CHIP LIST
========================================================= */

function ChipList({
  value,
  emptyText = "Not available",
}) {
  const items = normalizeArray(value);

  if (items.length === 0) {
    return (
      <Typography
        sx={{
          fontSize: 14,
          color: "#8B96A1",
        }}
      >
        {emptyText}
      </Typography>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={0.8}
      useFlexGap
      flexWrap="wrap"
    >
      {items.map((item, index) => {
        let label = item;

        if (typeof item === "object") {
          label =
            item.name ||
            item.title ||
            item.degree ||
            item.course ||
            JSON.stringify(item);
        }

        return (
          <Chip
            key={`${String(label)}-${index}`}
            label={String(label)}
            size="small"
            sx={{
              backgroundColor: "#F2F5F8",
              border: "1px solid #DCE2E8",
              color: "#3B4855",
              fontWeight: 600,
            }}
          />
        );
      })}
    </Stack>
  );
}


/* =========================================================
   EDUCATION
========================================================= */

function Education({ education }) {
  const items = normalizeArray(education);

  if (items.length === 0) {
    return (
      <Typography
        sx={{
          fontSize: 14,
          color: "#8B96A1",
        }}
      >
        Education information not available.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {items.map((item, index) => {
        if (typeof item === "string") {
          return (
            <Box key={index}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 650,
                  color: "#303C48",
                }}
              >
                {item}
              </Typography>
            </Box>
          );
        }

        if (typeof item === "object") {
          return (
            <Box key={index}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 750,
                  color: "#293540",
                }}
              >
                {item.degree ||
                  item.course ||
                  item.qualification ||
                  "Education"}
              </Typography>

              {item.institution && (
                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 13.5,
                    color: "#687684",
                  }}
                >
                  {item.institution}
                </Typography>
              )}

              {(item.year ||
                item.start_year ||
                item.end_year) && (
                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 12.5,
                    color: "#8A95A1",
                  }}
                >
                  {item.start_year || ""}

                  {item.start_year && item.end_year
                    ? " - "
                    : ""}

                  {item.end_year ||
                    item.year ||
                    ""}
                </Typography>
              )}
            </Box>
          );
        }

        return null;
      })}
    </Stack>
  );
}


/* =========================================================
   PROJECTS
========================================================= */

function Projects({ projects }) {
  const items = normalizeArray(projects);

  if (items.length === 0) {
    return (
      <Typography
        sx={{
          fontSize: 14,
          color: "#8B96A1",
        }}
      >
        No projects available.
      </Typography>
    );
  }

  return (
    <Stack spacing={2.5}>
      {items.map((project, index) => {
        if (typeof project === "string") {
          return (
            <Box key={index}>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#44515D",
                  lineHeight: 1.7,
                }}
              >
                {project}
              </Typography>
            </Box>
          );
        }

        if (typeof project === "object") {
          return (
            <Box key={index}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 750,
                  color: "#293540",
                }}
              >
                {project.name ||
                  project.title ||
                  "Project"}
              </Typography>

              {project.description && (
                <Typography
                  sx={{
                    mt: 0.6,
                    fontSize: 13.5,
                    color: "#687684",
                    lineHeight: 1.7,
                  }}
                >
                  {project.description}
                </Typography>
              )}

              {project.technologies && (
                <Box sx={{ mt: 1 }}>
                  <ChipList
                    value={project.technologies}
                  />
                </Box>
              )}
            </Box>
          );
        }

        return null;
      })}
    </Stack>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

function CandidateDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const candidate = location.state;

  console.log(
    "Candidate profile received:",
    candidate
  );


  /* =======================================================
     NO DATA
  ======================================================= */

  if (!candidate) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F6F8FA",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          p: 3,
        }}
      >
        <Card
          elevation={0}
          sx={{
            maxWidth: 500,
            width: "100%",

            p: 5,

            textAlign: "center",

            borderRadius: 3,
            border: "1px solid #E0E5EA",
          }}
        >
          <PersonRoundedIcon
            sx={{
              fontSize: 55,
              color: "#9AA7B4",
              mb: 1,
            }}
          />

          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 800,
              color: "#26313C",
            }}
          >
            No Candidate Selected
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#7B8793",
              fontSize: 14,
            }}
          >
            Please return to the candidate list and
            select a candidate.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/candidates")}
            sx={{
              mt: 3,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,

              backgroundColor: colors.brass,

              "&:hover": {
                backgroundColor: colors.brassDark,
              },
            }}
          >
            Back to Candidates
          </Button>
        </Card>
      </Box>
    );
  }


  /* =======================================================
     BASIC DATA
  ======================================================= */

  const name = getName(candidate);

  const role = getRole(candidate);

  const experience = getExperience(candidate);

  const initials = getInitials(name);


  const skills =
    candidate.skills ||
    candidate.technical_skills;

  const softSkills =
    candidate.soft_skills;

  const tools =
    candidate.tools;

  const languages =
    candidate.programming_languages;

  const certifications =
    candidate.certifications;

  const projects =
    candidate.projects;

  const achievements =
    candidate.achievements;

  const internships =
    candidate.internships;


  /* =======================================================
     OPEN RESUME
  ======================================================= */

  const openResume = () => {

    if (!candidate.resume_file) {
      console.error(
        "Resume filename missing:",
        candidate
      );

      return;
    }


    const baseURL =
      api.defaults.baseURL ||
      "http://127.0.0.1:8000";


    const resumeURL =
      `${baseURL}/resume/${encodeURIComponent(
        candidate.resume_file
      )}`;


    console.log(
      "Opening resume:",
      resumeURL
    );


    window.open(
      resumeURL,
      "_blank",
      "noopener,noreferrer"
    );
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F6F8FA",

        py: {
          xs: 2,
          md: 4,
        },
      }}
    >

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            md: 4,
          },
        }}
      >

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/candidates")}
          sx={{
            mb: 2,

            textTransform: "none",

            fontWeight: 700,

            color: "#63717E",

            "&:hover": {
              backgroundColor: "transparent",
              color: "#26313C",
            },
          }}
        >
          Back to Candidates
        </Button>


        {/* =================================================
            HERO
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,

            border: "1px solid #DEE4EA",

            backgroundColor: "#FFFFFF",

            overflow: "hidden",

            mb: 2.5,
          }}
        >

          {/* Accent */}

          <Box
            sx={{
              height: 6,
              backgroundColor: colors.brass,
            }}
          />

          <Box
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            <Box
              sx={{
                display: "flex",

                flexDirection: {
                  xs: "column",
                  md: "row",
                },

                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },

                gap: 2.5,
              }}
            >

              {/* Avatar */}

              <Box
                sx={{
                  width: 88,
                  height: 88,

                  borderRadius: "50%",

                  background:
                    "linear-gradient(135deg, #E7EEF6, #D5E1EE)",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  color: "#55718F",

                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 25,
                    fontWeight: 850,
                  }}
                >
                  {initials}
                </Typography>
              </Box>


              {/* Identity */}

              <Box sx={{ flex: 1 }}>

                <Typography
                  sx={{
                    fontSize: {
                      xs: 27,
                      md: 34,
                    },

                    fontWeight: 850,

                    color: "#18212B",

                    letterSpacing: "-0.025em",

                    lineHeight: 1.15,
                  }}
                >
                  {name}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.7,

                    fontSize: 16,

                    color: "#687684",

                    fontWeight: 600,
                  }}
                >
                  {role}
                </Typography>


                {/* Quick stats */}

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{
                    mt: 2,
                  }}
                >

                  <Chip
                    icon={<WorkRoundedIcon />}
                    label={`${experience} ${
                      Number(experience) === 1
                        ? "year"
                        : "years"
                    } experience`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#F1F4F7",
                    }}
                  />

                  {candidate.current_company && (
                    <Chip
                      icon={<BusinessRoundedIcon />}
                      label={candidate.current_company}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor: "#F1F4F7",
                      }}
                    />
                  )}

                  {candidate.location && (
                    <Chip
                      icon={<LocationOnRoundedIcon />}
                      label={candidate.location}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor: "#F1F4F7",
                      }}
                    />
                  )}

                </Stack>

              </Box>

            </Box>


            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            {(candidate.email ||
              candidate.phone ||
              candidate.location) && (

              <>
                <Divider sx={{ my: 3 }} />

                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  spacing={3}
                >

                  <InfoItem
                    icon={
                      <EmailRoundedIcon fontSize="small" />
                    }
                    label="Email"
                    value={candidate.email}
                  />

                  <InfoItem
                    icon={
                      <PhoneRoundedIcon fontSize="small" />
                    }
                    label="Phone"
                    value={candidate.phone}
                  />

                  <InfoItem
                    icon={
                      <LocationOnRoundedIcon fontSize="small" />
                    }
                    label="Location"
                    value={candidate.location}
                  />

                </Stack>

              </>
            )}

          </Box>

        </Card>


        {/* =================================================
            SUMMARY
        ================================================= */}

        {candidate.summary && (
          <Box sx={{ mb: 2.5 }}>
            <Section
              icon={
                <PersonRoundedIcon fontSize="small" />
              }
              title="Professional Summary"
            >
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "#52606D",
                }}
              >
                {candidate.summary}
              </Typography>
            </Section>
          </Box>
        )}


        {/* =================================================
            SKILLS
        ================================================= */}

        <Box sx={{ mb: 2.5 }}>
          <Section
            icon={
              <CodeRoundedIcon fontSize="small" />
            }
            title="Skills"
          >
            <ChipList
              value={skills}
              emptyText="No technical skills available."
            />
          </Section>
        </Box>


        {/* =================================================
            EDUCATION + CERTIFICATIONS
        ================================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 2.5,

            mb: 2.5,
          }}
        >

          <Section
            icon={
              <SchoolRoundedIcon fontSize="small" />
            }
            title="Education"
          >
            <Education
              education={candidate.education}
            />
          </Section>


          <Section
            icon={
              <WorkspacePremiumRoundedIcon fontSize="small" />
            }
            title="Certifications"
          >
            <ChipList
              value={certifications}
              emptyText="No certifications available."
            />
          </Section>

        </Box>


        {/* =================================================
            PROJECTS
        ================================================= */}

        <Box sx={{ mb: 2.5 }}>
          <Section
            icon={
              <FolderRoundedIcon fontSize="small" />
            }
            title="Projects"
          >
            <Projects projects={projects} />
          </Section>
        </Box>


        {/* =================================================
            INTERNSHIPS + ACHIEVEMENTS
        ================================================= */}

        {(internships || achievements) && (
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },

              gap: 2.5,

              mb: 2.5,
            }}
          >

            {internships && (
              <Section
                icon={
                  <WorkRoundedIcon fontSize="small" />
                }
                title="Internships"
              >
                <ChipList value={internships} />
              </Section>
            )}


            {achievements && (
              <Section
                icon={
                  <WorkspacePremiumRoundedIcon fontSize="small" />
                }
                title="Achievements"
              >
                <ChipList value={achievements} />
              </Section>
            )}

          </Box>
        )}


        {/* =================================================
            OTHER SKILLS
        ================================================= */}

        {(softSkills ||
          tools ||
          languages) && (

          <Box sx={{ mb: 2.5 }}>

            <Section
              icon={
                <CodeRoundedIcon fontSize="small" />
              }
              title="Additional Skills"
            >

              {softSkills && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#7D8995",
                      textTransform: "uppercase",
                    }}
                  >
                    Soft Skills
                  </Typography>

                  <ChipList value={softSkills} />
                </Box>
              )}


              {tools && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#7D8995",
                      textTransform: "uppercase",
                    }}
                  >
                    Tools
                  </Typography>

                  <ChipList value={tools} />
                </Box>
              )}


              {languages && (
                <Box>
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#7D8995",
                      textTransform: "uppercase",
                    }}
                  >
                    Programming Languages
                  </Typography>

                  <ChipList value={languages} />
                </Box>
              )}

            </Section>

          </Box>
        )}


        {/* =================================================
            RESUME
        ================================================= */}

        {candidate.resume_file && (
          <Box sx={{ mb: 2.5 }}>

            <Section
              icon={
                <DescriptionRoundedIcon fontSize="small" />
              }
              title="Resume"
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  gap: 2,

                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >

                {/* Resume Information */}

                <Box sx={{ minWidth: 0 }}>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#303C48",

                      wordBreak: "break-word",
                    }}
                  >
                    {candidate.resume_file}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 12,
                      color: "#8995A1",
                    }}
                  >
                    Source:{" "}
                    {candidate.source ||
                      "Internal Database"}
                  </Typography>

                </Box>


                {/* Open Resume */}

                <Button
                  variant="contained"
                  startIcon={
                    <DescriptionRoundedIcon />
                  }
                  onClick={openResume}
                  sx={{
                    flexShrink: 0,

                    textTransform: "none",

                    fontWeight: 700,

                    borderRadius: 2,

                    px: 2.5,

                    backgroundColor:
                      colors.brass,

                    "&:hover": {
                      backgroundColor:
                        colors.brassDark,
                    },
                  }}
                >
                  Open Resume
                </Button>

              </Box>

            </Section>

          </Box>
        )}

      </Container>

    </Box>
  );
}


export default CandidateDetails;