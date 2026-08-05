import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const getFinalStatus = (recommendation) => {
  if (
    recommendation === "Highly Recommended" ||
    recommendation === "Recommended"
  ) {
    return "Shortlisted";
  }

  if (recommendation === "Consider") {
    return "On Hold";
  }

  return "Rejected";
};

const arrayToText = (value) => {
  if (!value) return "";

  if (Array.isArray(value)) {
    return value.join("\n");
  }

  return String(value);
};

export const exportCandidatesToExcel = async (
  candidates = [],
  analysis = {}
) => {
  if (!candidates.length) {
    alert("No candidates available to export.");
    return;
  }

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "AI Recruitment System";

  const worksheet =
    workbook.addWorksheet("Candidate Evaluation");

  // ==========================================
  // TITLE
  // ==========================================

  worksheet.mergeCells("A1:L1");

  const titleCell = worksheet.getCell("A1");

  titleCell.value = "AI Recruitment - Final Candidate Evaluation";

  titleCell.font = {
    bold: true,
    size: 16,
  };

  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(1).height = 28;

  // ==========================================
  // JD INFORMATION
  // ==========================================

  worksheet.mergeCells("A2:L2");

  worksheet.getCell("A2").value =
    `Job Role: ${analysis?.job_title || "Not Specified"}`;

  worksheet.getCell("A2").font = {
    bold: true,
  };

  // ==========================================
  // TABLE HEADER
  // ==========================================

  const headerRow = worksheet.getRow(4);

  headerRow.values = [
    "Rank",
    "Candidate",
    "Email",
    "Phone",
    "Overall Fit",
    "Recommendation",
    "Final Status",
    "Confidence",
    "Role Fit",
    "Strengths",
    "Gaps",
    "Compensating Factors",
  ];

  headerRow.font = {
    bold: true,
  };

  headerRow.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  // ==========================================
  // CANDIDATES
  // ==========================================

  candidates.forEach((candidate, index) => {
    const resume = candidate.resume || {};

    const name =
      resume.name ||
      resume.candidate ||
      resume.candidate_name ||
      resume.full_name ||
      "Unknown Candidate";

    const email =
      resume.email ||
      resume.personal_info?.email ||
      "";

    const phone =
      resume.phone ||
      resume.mobile ||
      resume.personal_info?.phone ||
      "";

    const score = Number(
      candidate.overall_score || 0
    );

    const recommendation =
      candidate.recommendation ||
      "Not Available";

    const status =
      getFinalStatus(recommendation);

    worksheet.addRow([
      index + 1,
      name,
      email,
      phone,
      score,
      recommendation,
      status,
      candidate.confidence || "",
      candidate.role_fit || "",
      arrayToText(candidate.strengths),
      arrayToText(candidate.gaps),
      arrayToText(
        candidate.compensating_factors
      ),
    ]);
  });

  // ==========================================
  // COLUMN WIDTH
  // ==========================================

  worksheet.columns = [
    { width: 8 },
    { width: 25 },
    { width: 30 },
    { width: 18 },
    { width: 14 },
    { width: 22 },
    { width: 16 },
    { width: 14 },
    { width: 40 },
    { width: 50 },
    { width: 50 },
    { width: 50 },
  ];

  // ==========================================
  // WRAP TEXT
  // ==========================================

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 4) {
      row.alignment = {
        vertical: "top",
        wrapText: true,
      };
    }
  });

  // ==========================================
  // ATS SCORE FORMAT
  // ==========================================

  for (
    let row = 5;
    row <= worksheet.rowCount;
    row++
  ) {
    worksheet.getCell(`E${row}`).value =
      Number(
        worksheet.getCell(`E${row}`).value || 0
      ) / 100;

    worksheet.getCell(`E${row}`).numFmt =
      "0.00%";
  }

  // ==========================================
  // FREEZE HEADER
  // ==========================================

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 4,
    },
  ];

  // ==========================================
  // FILTER
  // ==========================================

  worksheet.autoFilter = {
    from: "A4",
    to: "L4",
  };

  // ==========================================
  // DOWNLOAD
  // ==========================================

  const buffer =
    await workbook.xlsx.writeBuffer();

  const blob = new Blob(
    [buffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  const jobTitle =
    analysis?.job_title
      ?.replace(/[^a-z0-9]/gi, "_")
      || "Candidates";

  saveAs(
    blob,
    `${jobTitle}_Candidate_Evaluation.xlsx`
  );
};