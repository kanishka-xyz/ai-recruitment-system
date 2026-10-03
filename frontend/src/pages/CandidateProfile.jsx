import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, Chip, Container, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import { colors } from "../theme/theme.js";

const arr = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.flat(Infinity);
  if (typeof v === "string") {
    return v.split(/\\n|\\r|;|(?<=\\.)\\s+(?=[A-Z])/).map((x) => x.trim()).filter(Boolean);
  }
  return [v];
};
const text = (v) => {
  if (typeof v === "string") return v.trim();
  if (!v || typeof v !== "object") return "";
  return (
    v.name ||
    v.certification ||
    v.certification_name ||
    v.certificate ||
    v.certificate_name ||
    v.course ||
    v.title ||
    v.degree ||
    v.description ||
    v.text ||
    ""
  ).toString().trim();
};
const nameOf = (c) => c?.candidate_name || c?.name || c?.full_name || c?.candidate || c?.personal_info?.name || "Unknown Candidate";
const roleOf = (c) => c?.current_role || c?.designation || c?.job_title || c?.title || c?.role || "Candidate";

function Section({ icon, title, children, full=false }) {
  return <Card elevation={0} sx={{ gridColumn: full ? "1 / -1" : "auto", border:"1px solid #DDE4EA", borderRadius:3, overflow:"hidden", background:"#FFF" }}>
    <Box sx={{ px:2.5, py:1.8, display:"flex", alignItems:"center", gap:1.2, borderBottom:"1px solid #EDF0F3", background:"#FAFBFC" }}>
      <Box sx={{ width:38, height:38, borderRadius:"50%", background:"#EDF3F8", color:"#607A96", display:"grid", placeItems:"center" }}>{icon}</Box>
      <Typography sx={{ fontSize:17, fontWeight:900, color:"#17212B" }}>{title}</Typography>
    </Box>
    <Box sx={{ p:2.5 }}>{children}</Box>
  </Card>;
}

function authenticityTone(status) {
  if (status === "Verified") {
    return { color: "#247354", background: "#EAF6F0", border: "#CBE5D8", icon: <CheckCircleRoundedIcon sx={{ fontSize: 18 }} /> };
  }
  if (status === "Potentially Inconsistent") {
    return { color: "#8A641E", background: "#FFF6E5", border: "#F0D9A5", icon: <WarningAmberRoundedIcon sx={{ fontSize: 18 }} /> };
  }
  if (status === "Unverified") {
    return { color: "#6D5A2B", background: "#FAF4E8", border: "#E8DCC0", icon: <HelpOutlineRoundedIcon sx={{ fontSize: 18 }} /> };
  }
  return { color: "#5D6B78", background: "#F1F4F6", border: "#D8E0E6", icon: <HelpOutlineRoundedIcon sx={{ fontSize: 18 }} /> };
}

function AuthenticitySection({ resumeId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(true);
  const [error, setError] = useState("");

  const categoryLabels = useMemo(() => ({
    document_integrity: "Document Integrity",
    duplicate_detection: "Duplicate Detection",
    employment_timeline: "Employment Timeline",
    education: "Education",
    certifications: "Certifications",
    github_portfolio: "GitHub & Portfolio",
    ai_content_analysis: "AI Content Analysis",
  }), []);

  const loadReport = async () => {
    if (!resumeId) {
      setLoadingReport(false);
      return;
    }
    try {
      setLoadingReport(true);
      setError("");
      const response = await api.get(`/authenticity/report/${encodeURIComponent(resumeId)}`);
      setReport(response.data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setReport(null);
      } else {
        setError(err?.response?.data?.detail || "Unable to load the authenticity report.");
      }
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [resumeId]);

  const runAnalysis = async (reanalyze = false) => {
    if (!resumeId) return;
    try {
      setLoading(true);
      setError("");
      const endpoint = reanalyze
        ? `/authenticity/reanalyze/${encodeURIComponent(resumeId)}`
        : `/authenticity/analyze/${encodeURIComponent(resumeId)}`;
      const response = await api.post(endpoint);
      setReport(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Authenticity analysis failed. Existing ATS functionality is unaffected.");
    } finally {
      setLoading(false);
    }
  };

  const checks = report?.checks || {};
  const findings = report?.findings || [];
  const overall = report?.overall_status || "Not Checked";
  const overallStyle = authenticityTone(overall);

  return (
    <Card elevation={0} sx={{ mt: 2, border: "1px solid #D3DCE4", borderRadius: 3, overflow: "hidden", background: "#FFFFFF" }}>
      <Box sx={{ height: 5, background: colors.brass }} />
      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: "50%", background: "#EDF3F8", color: "#607A96", display: "grid", placeItems: "center" }}>
              <SecurityRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#17212B" }}>Resume Authenticity</Typography>
              <Typography sx={{ mt: .35, fontSize: 13, color: "#65717C" }}>
                Evidence-based review signals separate from ATS fit and ranking.
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              onClick={() => runAnalysis(Boolean(report))}
              disabled={loading || loadingReport || !resumeId}
              startIcon={loading ? <CircularProgress size={16} sx={{ color: "#FFFFFF" }} /> : <SecurityRoundedIcon />}
              sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, background: colors.brass, boxShadow: "none", "&:hover": { background: colors.brassDark, boxShadow: "none" } }}
            >
              {loading ? "Analyzing..." : report ? "Re-analyze Resume" : "Analyze Resume"}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2.2 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loadingReport ? (
          <Box sx={{ minHeight: 120, display: "grid", placeItems: "center" }}>
            <CircularProgress size={28} sx={{ color: colors.brass }} />
          </Box>
        ) : !report ? (
          <Box sx={{ p: 2.5, borderRadius: 2.5, background: "#F7F9FB", border: "1px solid #E1E7EC" }}>
            <Typography sx={{ fontWeight: 850, color: "#263440" }}>No authenticity report yet</Typography>
            <Typography sx={{ mt: .5, fontSize: 14, lineHeight: 1.6, color: "#64717D" }}>
              Run the analysis to inspect document integrity, duplicate/content overlap, timeline consistency, credentials, public links and AI-assisted content signals.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap", mb: 2 }}>
              <Chip
                icon={overallStyle.icon}
                label={overall}
                sx={{ fontWeight: 850, color: overallStyle.color, background: overallStyle.background, border: `1px solid ${overallStyle.border}` }}
              />
              <Typography sx={{ fontSize: 12.5, color: "#71808D" }}>
                Version {report.analysis_version || "1.0"} • Run {report.run_id ? report.run_id.slice(0, 8) : "N/A"}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {Object.entries(categoryLabels).map(([key, label]) => {
                const check = checks[key] || {};
                const style = authenticityTone(check.status);
                const categoryFindings = findings.filter((item) => item.category === key);
                return (
                  <Box key={key} sx={{ p: 2, border: "1px solid #E0E6EB", borderRadius: 2.5, background: "#FBFCFD" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 850, color: "#263440" }}>{label}</Typography>
                      <Chip icon={style.icon} label={check.status || "Not Checked"} size="small" sx={{ fontWeight: 800, color: style.color, background: style.background, border: `1px solid ${style.border}` }} />
                    </Box>
                    <Typography sx={{ mt: .8, fontSize: 13.5, lineHeight: 1.6, color: "#526270" }}>
                      {check.summary || "No summary available."}
                    </Typography>
                    {categoryFindings.length > 0 && (
                      <Stack spacing={1} sx={{ mt: 1.2 }}>
                        {categoryFindings.slice(0, 5).map((finding, index) => (
                          <Box key={index} sx={{ p: 1.3, borderRadius: 2, background: "#FFFFFF", border: "1px solid #E5E9ED" }}>
                            <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: "#303D48" }}>{finding.description}</Typography>
                            {finding.evidence?.length > 0 && (
                              <Typography sx={{ mt: .45, fontSize: 12.5, lineHeight: 1.55, color: "#62707C" }}>
                                Evidence: {finding.evidence.join(" • ")}
                              </Typography>
                            )}
                            {finding.recommended_action && (
                              <Typography sx={{ mt: .45, fontSize: 12.5, lineHeight: 1.55, color: "#526270" }}>
                                HR follow-up: {finding.recommended_action}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                );
              })}
            </Stack>

            {(report.recommended_actions || []).length > 0 && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 2.5, background: "#F5F8FA", border: "1px solid #DFE6EB" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#304354" }}>Recommended HR verification actions</Typography>
                <Stack spacing={.8} sx={{ mt: 1 }}>
                  {report.recommended_actions.slice(0, 8).map((action, index) => (
                    <Typography key={index} sx={{ fontSize: 13.5, lineHeight: 1.5, color: "#4F606E" }}>
                      {index + 1}. {action}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
          </>
        )}
      </Box>
    </Card>
  );
}

function CandidateProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const candidate = state?.resume || state;

  if (!candidate) return <Box sx={{ minHeight:"100vh", display:"grid", placeItems:"center", background:"#F5F7F9", p:3 }}><Card sx={{ p:5, textAlign:"center" }}><Typography sx={{ fontSize:23, fontWeight:900 }}>No Candidate Selected</Typography><Button onClick={()=>navigate(-1)} sx={{mt:2}} startIcon={<ArrowBackRoundedIcon />}>Go Back</Button></Card></Box>;

  const name=nameOf(candidate);
  const role=roleOf(candidate);
  const experience=candidate.experience_years ?? candidate.total_experience ?? "0";
  const skills=arr(candidate.skills).map(text).filter(Boolean);
  const education=arr(candidate.education).map(text).filter(Boolean);
  const certifications=arr(candidate.certifications || candidate.certificates).map(text).filter(Boolean);
  const projects=arr(candidate.projects).map(text).filter(Boolean);
  const experienceItems=arr(candidate.experience || candidate.work_experience).map(x => typeof x==="string" ? x : [x?.title||x?.role||x?.designation,x?.company||x?.organization,x?.duration||x?.dates].filter(Boolean).join(" • ")).filter(Boolean);
  const resumeFile=candidate.resume_file || state?.resume_file;

  const openResume=()=>resumeFile && window.open(`http://127.0.0.1:8000/resume/${encodeURIComponent(resumeFile)}`,"_blank","noopener,noreferrer");

  return <Box sx={{ minHeight:"100vh", background:"#F5F7F9", py:{xs:2,md:4} }}>
    <Container maxWidth="lg" sx={{ px:{xs:2,md:3} }}>
      <Button
  startIcon={<ArrowBackRoundedIcon />}
  onClick={()=>navigate(-1)}
  variant="outlined"
  sx={{
    mb:2.5,
    px:2,
    py:1,
    borderRadius:2,
    borderColor:"#C9D4DE",
    background:"#FFFFFF",
    color:"#30465A",
    fontWeight:800,
    textTransform:"none",
    fontSize:14,
    "&:hover":{borderColor:colors.brass,background:"#FAFBFC"}
  }}
>
  Back to Candidates
</Button>

      <Card elevation={0} sx={{ border:"1px solid #D3DCE4", borderRadius:3, overflow:"hidden", mb:2.5, background:"#FFF" }}>
        <Box sx={{ height:6, background:colors.brass }} />
        <Box sx={{ p:{xs:2.5,md:4} }}>
          <Stack direction={{xs:"column",sm:"row"}} spacing={2.5} alignItems={{xs:"flex-start",sm:"center"}}>
            <Box sx={{ width:112,height:112,borderRadius:"50%",background:"#E5EDF6",color:"#55718F",display:"grid",placeItems:"center",flexShrink:0 }}>
              <Typography sx={{fontSize:34,fontWeight:900}}>{name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}</Typography>
            </Box>
            <Box>
              <Typography sx={{fontSize:{xs:28,md:38},fontWeight:900,color:"#17212B",letterSpacing:"-.03em"}}>{name}</Typography>
              <Typography sx={{mt:.4,fontSize:18,fontWeight:600,color:"#526675"}}>{role}</Typography>
              <Chip icon={<WorkRoundedIcon/>} label={`${experience} years experience`} sx={{mt:1.4,fontWeight:800,color:"#26313C",background:"#F0F3F6"}} />
            </Box>
          </Stack>
        </Box>
      </Card>

      <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",md:"1fr 1fr"},gap:2,alignItems:"stretch"}}>
        <Section full icon={<CodeRoundedIcon/>} title="Skills">{skills.length ? <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>{skills.map((x,i)=><Chip key={i} label={x} sx={{fontSize:14,fontWeight:650,color:"#29445D",background:"#F0F4F8",border:"1px solid #DCE5EC"}}/>)}</Stack> : <Typography sx={{color:"#52606D"}}>No technical skills available.</Typography>}</Section>
        <Section icon={<SchoolRoundedIcon/>} title="Education">{education.length ? <Stack spacing={1.2}>{education.map((x,i)=><Typography key={i} sx={{fontSize:15,lineHeight:1.65,fontWeight:650,color:"#263440"}}>{x}</Typography>)}</Stack> : <Typography sx={{color:"#52606D"}}>Education information not available.</Typography>}</Section>
        <Section icon={<WorkspacePremiumRoundedIcon/>} title={certifications.length ? "Certifications (" + certifications.length + ")" : "Certifications"}>
  {certifications.length ? (
    <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",sm:"1fr"},gap:1.5}}>
      {certifications.map((x,i)=>(
        <Box key={"cert-"+i} sx={{minWidth:0,p:1.7,border:"1px solid #DCE5EC",borderRadius:2,background:"#F7F9FB",display:"flex",alignItems:"flex-start",gap:1.2}}>
          <Box sx={{width:30,height:30,borderRadius:"50%",background:"#E8F0F7",color:"#607A96",display:"grid",placeItems:"center",flexShrink:0}}>
            <WorkspacePremiumRoundedIcon sx={{fontSize:17}}/>
          </Box>
          <Typography sx={{fontSize:14,lineHeight:1.5,fontWeight:700,color:"#29445D",overflowWrap:"anywhere",wordBreak:"break-word"}}>
            {x}
          </Typography>
        </Box>
      ))}
    </Box>
  ) : <Typography sx={{color:"#52606D"}}>No certifications available.</Typography>}
</Section>
        <Section full icon={<FolderRoundedIcon/>} title="Projects">{projects.length ? <Stack spacing={1.2}>{projects.map((x,i)=><Box key={i} sx={{p:1.3,borderRadius:2,background:"#F7F9FB"}}><Typography sx={{fontSize:15,color:"#263440",fontWeight:650}}>{x}</Typography></Box>)}</Stack> : <Typography sx={{color:"#52606D"}}>No projects available.</Typography>}</Section>
        <Section full icon={<WorkRoundedIcon/>} title="Experience">{experienceItems.length ? <Stack spacing={1.2}>{experienceItems.map((x,i)=><Typography key={i} sx={{fontSize:15,lineHeight:1.65,color:"#263440",fontWeight:600}}>{x}</Typography>)}</Stack> : <Typography sx={{color:"#52606D"}}>Experience details not available.</Typography>}</Section>
        <Section full icon={<DescriptionRoundedIcon/>} title="Resume"><Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:2,flexWrap:"wrap"}}><Box><Typography sx={{fontSize:15,fontWeight:800,color:"#263440"}}>{resumeFile || "Resume file not available"}</Typography><Typography sx={{mt:.4,fontSize:13,color:"#63717E"}}>Source: internal database</Typography></Box>{resumeFile && <Button onClick={openResume} variant="contained" startIcon={<DescriptionRoundedIcon/>} sx={{textTransform:"none",fontWeight:800,borderRadius:2,background:"#6B87A3"}}>Open Resume</Button>}</Box></Section>
      </Box>
        <AuthenticitySection resumeId={candidate._id || state?._id || candidate.id || state?.id} />

    </Container>
  </Box>;
}
export default CandidateProfile;
