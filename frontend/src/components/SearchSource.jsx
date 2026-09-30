import React, { useRef, useState } from "react";

import {
  Box,
  Card,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

import { colors, mono } from "../theme/theme.js";
import api from "../services/api.js";


function SearchSource({
  source,
  setSource,
  platform,
  setPlatform
}) {

  const fileInputRef = useRef(null);

  const [internalDialogOpen, setInternalDialogOpen] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");


  // ============================================================
  // OPEN INTERNAL DATABASE
  // ============================================================

  const handleInternalDatabase = () => {

    setSource("internal");

    setUploadMessage("");

    setInternalDialogOpen(true);
  };


  // ============================================================
  // ZIP UPLOAD
  // ============================================================

  const handleZipUpload = async (event) => {

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }


    // ----------------------------------------------------------
    // CHECK FILE
    // ----------------------------------------------------------

    if (!file.name.toLowerCase().endsWith(".zip")) {

      setUploadMessage(
        "Please select a ZIP file."
      );

      event.target.value = "";

      return;
    }


    const formData = new FormData();

    formData.append(
      "file",
      file
    );


    try {

      setUploading(true);

      setUploadMessage(
        "Uploading resume database..."
      );


      // --------------------------------------------------------
      // UPLOAD ZIP
      // --------------------------------------------------------

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


      const data = response.data;


      if (!data.success) {

        throw new Error(
          data.message ||
          "Resume database upload failed."
        );
      }


      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      setUploadMessage(
        `Database connected successfully. ` +
        `${data.processed_count || 0} new resumes processed, ` +
        `${data.skipped_count || 0} already existed.`
      );


    } catch (error) {

      console.error(
        "Resume database upload error:",
        error
      );


      setUploadMessage(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to upload resume database."
      );


    } finally {

      setUploading(false);

      // Allow same ZIP to be selected again
      event.target.value = "";
    }
  };


  // ============================================================
  // CLOSE DIALOG
  // ============================================================

  const handleCloseDialog = () => {

    if (uploading) {
      return;
    }

    setInternalDialogOpen(false);
  };


  return (

    <>

      {/* ======================================================
          SOURCE SELECTOR
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2.5,
          alignItems: "center",
        }}
      >

        <Typography
          sx={{
            ...eyebrow,
            mr: 0.5,
          }}
        >
          Source
        </Typography>


        {/* ==================================================
            INTERNAL DATABASE
        ================================================== */}

        <Card
          elevation={0}
          onClick={handleInternalDatabase}
          sx={{
            width: 240,
            height: 54,

            display: "flex",
            alignItems: "center",

            px: 2,

            cursor: "pointer",

            borderRadius: 2,

            border:
              source === "internal"
                ? `1.5px solid ${colors.brass}`
                : `1px solid ${colors.hairline}`,

            bgcolor:
              source === "internal"
                ? colors.brassSoft
                : colors.paperRaised,

            transition:
              "all 0.15s ease",

            "&:hover": {
              borderColor:
                colors.brass,

              transform:
                "translateY(-1px)",
            },
          }}
        >

          <StorageRoundedIcon
            sx={{
              color:
                colors.brassDark,

              mr: 1.5,

              fontSize: 20,
            }}
          />


          <Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: colors.ink,
              }}
            >
              Internal Database
            </Typography>


            <Typography
              sx={{
                fontFamily: mono,
                fontSize: "0.65rem",
                color: colors.slateFaint,
              }}
            >
              YOUR TALENT POOL
            </Typography>

          </Box>

        </Card>


        {/* ==================================================
            EXTERNAL PLATFORM
        ================================================== */}

        <FormControl
          size="small"
          sx={{
            width: 260,
          }}
        >

          <Select
            displayEmpty
            value={platform}

            onChange={(e) => {

              setSource("external");

              setPlatform(
                e.target.value
              );

            }}

            sx={{
              height: 54,

              borderRadius: 2,

              bgcolor:
                source === "external"
                  ? colors.brassSoft
                  : colors.paperRaised,

              "& .MuiOutlinedInput-notchedOutline":
                {
                  borderColor:
                    source === "external"
                      ? colors.brass
                      : colors.hairline,

                  borderWidth:
                    source === "external"
                      ? 1.5
                      : 1,
                },
            }}

            renderValue={(selected) => {

              if (!selected) {

                return (

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                  >

                    <PublicRoundedIcon
                      sx={{
                        color:
                          colors.brassDark,

                        fontSize: 20,
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: colors.ink,
                      }}
                    >
                      External Platform
                    </Typography>

                  </Box>

                );
              }


              return (

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                >

                  <PublicRoundedIcon
                    sx={{
                      color:
                        colors.brassDark,

                      fontSize: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: colors.ink,
                    }}
                  >
                    {selected}
                  </Typography>

                </Box>

              );

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


      {/* ======================================================
          INTERNAL DATABASE DIALOG
      ====================================================== */}

      <Dialog
        open={internalDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >

        <DialogTitle
          sx={{
            fontWeight: 700,
            color: colors.ink,
            pb: 1,
          }}
        >
          Connect Internal Database
        </DialogTitle>


        <DialogContent>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: colors.slateFaint,
              lineHeight: 1.5,
              mb: 2.5,
            }}
          >
            Add your company's resume database
            to search candidates from your
            internal talent pool.
          </Typography>


          {/* ==================================================
              FOLDER OPTION
          ================================================== */}

          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <FolderRoundedIcon />
            }

            onClick={() => {

              setUploadMessage(
                "For the current version, please upload the resume folder as a ZIP file."
              );

            }}

            sx={{
              height: 48,

              borderRadius: 2,

              textTransform: "none",

              fontWeight: 700,

              color:
                colors.brassDark,

              borderColor:
                colors.hairline,

              "&:hover": {
                borderColor:
                  colors.brass,

                backgroundColor:
                  colors.brassSoft,
              },
            }}
          >
            Select Resume Folder
          </Button>


          {/* ==================================================
              OR
          ================================================== */}

          <Divider
            sx={{
              my: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: mono,
                fontSize: "0.65rem",
                color: colors.slateFaint,
              }}
            >
              OR
            </Typography>
          </Divider>


          {/* ==================================================
              HIDDEN ZIP INPUT
          ================================================== */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            hidden
            onChange={handleZipUpload}
          />


          {/* ==================================================
              ZIP BUTTON
          ================================================== */}

          <Button
            fullWidth
            variant="contained"

            disabled={uploading}

            startIcon={
              uploading
                ? (
                  <CircularProgress
                    size={16}
                  />
                )
                : (
                  <UploadFileRoundedIcon />
                )
            }

            onClick={() => {

              fileInputRef.current?.click();

            }}

            sx={{
              height: 48,

              borderRadius: 2,

              textTransform: "none",

              fontWeight: 700,

              backgroundColor:
                colors.brass,

              color:
                colors.ink,

              boxShadow: "none",

              "&:hover": {
                backgroundColor:
                  colors.brassDark,

                boxShadow: "none",
              },
            }}
          >

            {uploading
              ? "Processing Resumes..."
              : "Upload Resume ZIP"}

          </Button>


          {/* ==================================================
              SUPPORTED FORMAT
          ================================================== */}

          <Typography
            sx={{
              mt: 1.5,

              fontFamily: mono,

              fontSize: "0.62rem",

              color:
                colors.slateFaint,

              textAlign: "center",
            }}
          >
            PDF / DOCX resumes supported
          </Typography>


          {/* ==================================================
              STATUS
          ================================================== */}

          {uploadMessage && (

            <Box
              sx={{
                mt: 2,

                p: 1.5,

                borderRadius: 1.5,

                backgroundColor:
                  colors.paperRaised,

                border:
                  `1px solid ${colors.hairline}`,
              }}
            >

              <Typography
                sx={{
                  fontSize: "0.75rem",

                  lineHeight: 1.5,

                  color:
                    colors.ink,
                }}
              >
                {uploadMessage}
              </Typography>

            </Box>

          )}

        </DialogContent>


        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >

          <Button
            onClick={handleCloseDialog}
            disabled={uploading}
            sx={{
              textTransform: "none",
              color: colors.slateFaint,
            }}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

    </>
  );
}


// ============================================================
// EYEBROW STYLE
// ============================================================

const eyebrow = {

  fontFamily: mono,

  fontSize: "0.7rem",

  fontWeight: 700,

  letterSpacing: "0.12em",

  textTransform: "uppercase",

  color: colors.slateFaint,

};


export default SearchSource;