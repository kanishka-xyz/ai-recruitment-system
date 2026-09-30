import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, Chip, Container, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
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
    </Container>
  </Box>;
}
export default CandidateProfile;
