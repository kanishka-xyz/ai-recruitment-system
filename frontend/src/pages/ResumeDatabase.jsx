import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import InputBase from "@mui/material/InputBase";

import api from "../services/api.js";
import { colors } from "../theme/theme.js";


/* =========================================================
   HELPERS
========================================================= */

function getName(candidate) {
  return (
    candidate?.candidate_name ||
    candidate?.name ||
    candidate?.full_name ||
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


/* =========================================================
   MAIN COMPONENT
========================================================= */

function ResumeDatabase() {

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");


  /* =======================================================
     LOAD RESUMES
  ======================================================= */

  const loadResumes = async () => {

    try {

      setLoading(true);

      setMessage("");

      const response = await api.get(
        "/internalDatabase"
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.resumes ||
          data.candidates ||
          data.data ||
          [];

      setResumes(list);

    } catch (error) {

      console.error(
        "Failed to load resume database:",
        error
      );

      setMessage(
        error?.response?.data?.detail ||
        "Could not load the resume database."
      );

      setResumes([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadResumes();

  }, []);


  /* =======================================================
     UPLOAD ZIP
  ======================================================= */

  const handleUploadClick = () => {

    fileInputRef.current?.click();

  };


  const handleUpload = async (event) => {

    const file = event.target.files?.[0];

    if (!file) return;


    if (!file.name.toLowerCase().endsWith(".zip")) {

      setMessage(
        "Please select a ZIP file containing PDF or DOCX resumes."
      );

      event.target.value = "";

      return;
    }


    try {

      setUploading(true);

      setMessage("Uploading and processing resumes...");


      const formData = new FormData();

      formData.append("file", file);


      const response = await api.post(
        "/uploadResumeDatabase",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      const result = response.data;


      setMessage(
        result.message ||
        `Uploaded ${
          result.uploaded_count ?? 0
        } resumes successfully.`
      );


      await loadResumes();

    } catch (error) {

      console.error(
        "Resume upload failed:",
        error
      );

      setMessage(
        error?.response?.data?.detail ||
        "Resume upload failed."
      );

    } finally {

      setUploading(false);

      event.target.value = "";

    }
  };


  /* =======================================================
     OPEN PDF
  ======================================================= */

  const openResume = (resume) => {

    /*
      We use the backend endpoint:

      GET /resume/{filename}

      This allows FastAPI to securely return
      the actual PDF file.
    */

    const filename =
      resume?.resume_file;

    if (!filename) {

      setMessage(
        "Resume file is not available."
      );

      return;
    }


    const baseURL =
      api.defaults.baseURL ||
      "http://127.0.0.1:8000";


    const url =
      `${baseURL}/resume/${encodeURIComponent(
        filename
      )}`;


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredResumes =
    resumes.filter((resume) => {

      const query =
        search.trim().toLowerCase();

      if (!query) return true;


      const name =
        getName(resume).toLowerCase();

      const role =
        getRole(resume).toLowerCase();

      const file =
        String(
          resume.resume_file || ""
        ).toLowerCase();

      const skills =
        Array.isArray(resume.skills)
          ? resume.skills
              .join(" ")
              .toLowerCase()
          : String(
              resume.skills || ""
            ).toLowerCase();


      return (
        name.includes(query) ||
        role.includes(query) ||
        file.includes(query) ||
        skills.includes(query)
      );

    });


  /* =======================================================
     RENDER
  ======================================================= */

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
            PAGE HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: {
              xs: "flex-start",
              md: "center",
            },

            flexDirection: {
              xs: "column",
              md: "row",
            },

            gap: 2,

            mb: 3,
          }}
        >

          {/* Title */}

          <Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 27,
                  md: 32,
                },

                fontWeight: 850,

                color: "#18212B",

                letterSpacing:
                  "-0.02em",
              }}
            >
              Resume Database
            </Typography>

            <Typography
              sx={{
                mt: 0.6,

                fontSize: 14,

                color: "#74808C",
              }}
            >
              Manage and access resumes stored
              in the internal candidate database.
            </Typography>

          </Box>


          {/* =================================================
              NAVIGATION + ACTIONS
          ================================================= */}

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >

            {/* Dashboard */}

            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,

                borderColor: "#DCE2E8",

                color: "#46515D",

                backgroundColor: "#FFFFFF",

                "&:hover": {
                  borderColor: colors.brass,
                  backgroundColor: "#FAFBFC",
                },
              }}
            >
              Dashboard
            </Button>


            {/* Candidates */}

            <Button
              variant="outlined"
              startIcon={<PersonRoundedIcon />}
              onClick={() => navigate("/candidates")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,

                borderColor: "#DCE2E8",

                color: "#46515D",

                backgroundColor: "#FFFFFF",

                "&:hover": {
                  borderColor: colors.brass,
                  backgroundColor: "#FAFBFC",
                },
              }}
            >
              Candidates
            </Button>


            {/* Refresh */}

            <IconButton
              onClick={loadResumes}
              disabled={loading}
              sx={{
                width: 42,
                height: 42,

                backgroundColor:
                  "#FFFFFF",

                border:
                  "1px solid #DCE2E8",

                "&:hover": {
                  backgroundColor:
                    "#F1F4F7",
                },
              }}
            >
              <RefreshRoundedIcon />
            </IconButton>


            {/* Add Resumes */}

            <Button
              variant="contained"
              startIcon={
                uploading ? (
                  <CircularProgress
                    size={17}
                    sx={{
                      color: "#FFFFFF",
                    }}
                  />
                ) : (
                  <UploadFileRoundedIcon />
                )
              }

              onClick={handleUploadClick}

              disabled={uploading}

              sx={{
                textTransform:
                  "none",

                fontWeight: 750,

                px: 2.2,
                py: 1.15,

                borderRadius: 2,

                backgroundColor:
                  colors.brass,

                boxShadow: "none",

                "&:hover": {
                  backgroundColor:
                    colors.brassDark,

                  boxShadow: "none",
                },
              }}
            >
              {uploading
                ? "Processing..."
                : "Add Resumes"}
            </Button>

          </Stack>


          {/* Hidden ZIP input */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            hidden
            onChange={handleUpload}
          />

        </Box>


        {/* =================================================
            DATABASE SUMMARY
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,

            border:
              "1px solid #DEE4EA",

            backgroundColor:
              "#FFFFFF",

            mb: 2.5,

            overflow: "hidden",
          }}
        >

          <Box
            sx={{
              height: 5,

              backgroundColor:
                colors.brass,
            }}
          />

          <Box
            sx={{
              p: 3,

              display: "flex",

              alignItems: "center",

              gap: 2,
            }}
          >

            <Box
              sx={{
                width: 58,
                height: 58,

                borderRadius: 2.5,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor:
                  "#EAF0F6",

                color: "#607A96",
              }}
            >
              <FolderRoundedIcon
                sx={{
                  fontSize: 31,
                }}
              />
            </Box>


            <Box>

              <Typography
                sx={{
                  fontSize: 12,

                  fontWeight: 800,

                  color: "#8A95A1",

                  textTransform:
                    "uppercase",

                  letterSpacing:
                    "0.07em",
                }}
              >
                Internal Database
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: 24,

                  fontWeight: 850,

                  color: "#26313C",
                }}
              >
                {resumes.length}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,

                  color: "#7B8793",
                }}
              >
                resumes available
              </Typography>

            </Box>

          </Box>

        </Card>


        {/* =================================================
            SEARCH
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,

            border:
              "1px solid #DEE4EA",

            backgroundColor:
              "#FFFFFF",

            mb: 2.5,

            px: 2,
            py: 0.5,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >

            <SearchRoundedIcon
              sx={{
                color: "#8995A1",
              }}
            />

            <InputBase
              fullWidth
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search candidates, roles, skills or resume names..."
              sx={{
                py: 1.2,

                fontSize: 14,

                color: "#303C48",
              }}
            />

          </Box>

        </Card>


        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <Card
            elevation={0}
            sx={{
              p: 2,

              mb: 2.5,

              borderRadius: 2,

              border:
                "1px solid #DCE3E9",

              backgroundColor:
                "#F8FAFB",
            }}
          >

            <Typography
              sx={{
                fontSize: 13,

                color: "#566471",

                fontWeight: 600,
              }}
            >
              {message}
            </Typography>

          </Card>
        )}


        {/* =================================================
            STORED RESUMES
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,

            border:
              "1px solid #DEE4EA",

            backgroundColor:
              "#FFFFFF",

            overflow: "hidden",
          }}
        >

          {/* Header */}

          <Box
            sx={{
              px: 3,
              py: 2.5,

              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",
            }}
          >

            <Box>

              <Typography
                sx={{
                  fontSize: 18,

                  fontWeight: 800,

                  color: "#26313C",
                }}
              >
                Stored Resumes
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: 12.5,

                  color: "#8995A1",
                }}
              >
                {filteredResumes.length}{" "}
                records shown
              </Typography>

            </Box>

          </Box>


          <Divider />


          {/* Loading */}

          {loading && (
            <Box
              sx={{
                minHeight: 250,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

              <CircularProgress
                sx={{
                  color: colors.brass,
                }}
              />

            </Box>
          )}


          {/* Empty */}

          {!loading &&
            filteredResumes.length === 0 && (

              <Box
                sx={{
                  minHeight: 250,

                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  textAlign: "center",

                  p: 4,
                }}
              >

                <DescriptionRoundedIcon
                  sx={{
                    fontSize: 48,

                    color: "#AAB4BE",

                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 18,

                    fontWeight: 750,

                    color: "#394653",
                  }}
                >
                  No resumes found
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,

                    fontSize: 13,

                    color: "#8A95A1",
                  }}
                >
                  Add a ZIP file containing
                  your candidate resumes.
                </Typography>

              </Box>
            )}


          {/* Resume rows */}

          {!loading &&
            filteredResumes.length > 0 && (

              <Stack>

                {filteredResumes.map(
                  (resume, index) => {

                    const name =
                      getName(resume);

                    const role =
                      getRole(resume);

                    return (
                      <Box
                        key={
                          resume._id ||
                          resume.id ||
                          resume.file_hash ||
                          index
                        }
                        sx={{
                          px: 3,
                          py: 2.2,

                          display: "flex",

                          alignItems: {
                            xs: "flex-start",
                            md: "center",
                          },

                          justifyContent:
                            "space-between",

                          flexDirection: {
                            xs: "column",
                            md: "row",
                          },

                          gap: 2,

                          "&:hover": {
                            backgroundColor:
                              "#FAFBFC",
                          },

                          borderBottom:
                            index ===
                            filteredResumes.length - 1
                              ? "none"
                              : "1px solid #EDF0F3",
                        }}
                      >

                        {/* Candidate */}

                        <Box
                          sx={{
                            display: "flex",

                            alignItems:
                              "center",

                            gap: 1.8,

                            minWidth: 0,

                            flex: 1,
                          }}
                        >

                          <Box
                            sx={{
                              width: 46,
                              height: 46,

                              borderRadius:
                                "50%",

                              backgroundColor:
                                "#EAF0F6",

                              display: "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              color:
                                "#607A96",

                              flexShrink: 0,
                            }}
                          >
                            <PersonRoundedIcon />
                          </Box>


                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >

                            <Typography
                              sx={{
                                fontSize: 15,

                                fontWeight: 750,

                                color:
                                  "#26313C",
                              }}
                            >
                              {name}
                            </Typography>


                            <Box
                              sx={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap: 0.7,

                                mt: 0.3,
                              }}
                            >

                              <WorkOutlineRoundedIcon
                                sx={{
                                  fontSize: 15,

                                  color:
                                    "#8A95A1",
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize: 12.5,

                                  color:
                                    "#73808C",
                                }}
                              >
                                {role}
                              </Typography>

                            </Box>

                          </Box>

                        </Box>


                        {/* Resume file */}

                        <Box
                          sx={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: 1,

                            minWidth: {
                              md: 300,
                            },

                            maxWidth: {
                              md: 420,
                            },
                          }}
                        >

                          <DescriptionRoundedIcon
                            sx={{
                              fontSize: 19,

                              color:
                                "#7D8B98",

                              flexShrink: 0,
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 13,

                              color:
                                "#52606D",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {resume.resume_file ||
                              "Resume"}
                          </Typography>

                          <Chip
                            label="Internal"
                            size="small"
                            sx={{
                              fontSize: 11,

                              fontWeight: 700,

                              backgroundColor:
                                "#EEF2F6",

                              color:
                                "#5F7080",

                              flexShrink: 0,
                            }}
                          />

                        </Box>


                        {/* Open button */}

                        <Button
                          variant="outlined"
                          endIcon={
                            <OpenInNewRoundedIcon />
                          }
                          onClick={() =>
                            openResume(resume)
                          }
                          sx={{
                            textTransform:
                              "none",

                            fontWeight: 700,

                            borderRadius: 2,

                            minWidth: 125,

                            borderColor:
                              "#D0D8E0",

                            color:
                              "#53687C",

                            "&:hover": {
                              borderColor:
                                colors.brass,

                              backgroundColor:
                                "#FAF8F3",
                            },
                          }}
                        >
                          Open Resume
                        </Button>

                      </Box>
                    );
                  }
                )}

              </Stack>
            )}

        </Card>

      </Container>

    </Box>
  );
}


export default ResumeDatabase;