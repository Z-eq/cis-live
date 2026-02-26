import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

const THEMES = {
  dark: {
    pageBg:"radial-gradient(ellipse at 20% 20%,#060e1a 0%,#030810 50%,#020508 100%)",
    cardBg:"linear-gradient(160deg,#08121e 0%,#060d18 100%)",cardBorder:"#1a3a5c",
    inputBg:"#060d18",inputBorder:"#1a3a5c",inputColor:"#90caf9",inputPlaceholder:"#1e3a5f",
    chassisBg:"linear-gradient(180deg,#232326 0%,#1a1a1d 30%,#141416 70%,#111113 100%)",
    chassisBorder:"#2d2d32",chassisTopBg:"linear-gradient(90deg,#1a1a1d 0%,#1e1e22 50%,#1a1a1d 100%)",
    chassisTopBorder:"#2d2d32",chassisFooterBg:"#0f0f12",chassisFooterBorder:"#1e1e22",
    chassisGlow:"0 0 40px #1a73e810,0 8px 48px #000c",chassisGlowHover:"0 0 60px #1a73e820,0 8px 48px #000c",
    portGroupBg:"linear-gradient(180deg,#161618 0%,#111113 100%)",portGroupBorder:"#222226",
    portGroupShadow:"inset 0 1px 0 #2a2a2e22,inset 0 -1px 0 #00000044",portNumColor:"#1e2d3d",
    separatorColor:"linear-gradient(180deg,transparent 0%,#0a0a0d 20%,#222226 50%,#0a0a0d 80%,transparent 100%)",
    portBgUp:"linear-gradient(180deg,#1c2a1c 0%,#111811 100%)",portBgDisabled:"linear-gradient(180deg,#1a1a1f 0%,#111115 100%)",
    portBgDown:"linear-gradient(180deg,#1a1a1f 0%,#111115 100%)",portBgSelected:"linear-gradient(180deg,#1565c0 0%,#0d47a1 100%)",
    portBorderUp:"#2e7d32",portBorderDisabled:"#1e1e25",portBorderDown:"#1a2a1a",portBorderUnused:"#3d2b00",portBorderSelected:"#42a5f5",
    portSocketBgUp:"#050d08",portSocketBgDisabled:"#0a0a0d",portSocketBgSelected:"#0d2a5a",
    portSocketBorderUp:"#1b4020",portSocketBorderDisabled:"#111",portSocketBorderDown:"#101810",
    portPinUp:"#c8a828",portPinUpAlt:"#a08820",portPinDown:"#1a1a1a",
    portSocketShadow:"linear-gradient(180deg,#000a 0%,transparent 100%)",
    sfpBgActive:"linear-gradient(180deg,#0d2010 0%,#071408 100%)",sfpBgInactive:"linear-gradient(180deg,#111115 0%,#0a0a0d 100%)",
    sfpBorderActive:"#2e7d32",sfpBorderInactive:"#1e1e25",sfpLedInactive:"#1a2a1a",
    sfpSlotBgActive:"#051008",sfpSlotBgInactive:"#0a0a0d",sfpSlotBorderActive:"#1b4020",sfpSlotBorderInactive:"#111",
    consoleBg:"#0a0a0d",
    statsBg:"linear-gradient(90deg,#040a10 0%,#060d18 50%,#040a10 100%)",statsBorder:"#0d1e30",statsLabel:"#1e3a5f",
    tabBgOn:"#0d2a5a",tabBorderOn:"#1565c0",tabColorOn:"#64b5f6",tabBgOff:"transparent",tabBorderOff:"#0d1e30",tabColorOff:"#1e3a5f",
    detailBg:"linear-gradient(160deg,#08121e 0%,#060d18 100%)",detailBorder:"#1a3a5c",detailText:"#90a4ae",
    detailShadow:"0 12px 48px #000c",detailTitle:"#e3f2fd",detailMuted:"#455a64",detailCloseBorder:"#1e3a5f",
    detailCardBg:"#060d18",detailCardBorder:"#0d1e30",detailLabel:"#263238",
    detailTrafficBg:"#060d18",detailTrafficBorder:"#0d1e30",detailBarBg:"#0d1b2a",
    detailMacBg:"#040a10",detailMacBorder:"#0d1e30",detailMacHead:"#060d18",detailMacHeadColor:"#1e3a5f",
    detailEvBg:"#040a10",detailEvBorder:"#060d18",detailEvTs:"#1e3a5f",detailEvAgo:"#455a64",
    detailDownBg:"#ff174408",detailDownBorder:"#ff174422",detailDownColor:"#ef5350",
    tableBg:"#040a10",tableBorder:"#0d1e30",tableHeadBg:"#060d18",tableHeadColor:"#1e3a5f",
    tableRowBorder:"#06090f",tableRowHover:"#040a10",tableRowSelected:"#060d18",
    tablePort:"#4fc3f7",tableVlan:"#90a4ae",tableSpeed:"#78909c",tableMode:"#ffd74088",tableDesc:"#263238",
    unusedBg:"#040a10",unusedBorder:"#2d1500",unusedHeadBg:"linear-gradient(90deg,#1a0800 0%,#200e00 100%)",
    unusedHeadBorder:"#2d1500",unusedHeadColor:"#ff6b35",unusedHeadSub:"#3d1500",
    unusedColBg:"#060d18",unusedColColor:"#1e3a5f",unusedRowBorder:"#0a0f14",unusedRowHover:"#060d18",
    unusedPort:"#64b5f6",unusedVlan:"#90a4ae",unusedDate:"#455a64",unusedAction:"#1e3a5f",
    ciscoColor:"#1565c0",subColor:"#64b5f6",metaColor:"#1e3a5f",ledLabel:"#263238",legendColor:"#1e3a5f",
    footerBorder:"#060d18",footerColor:"#0d1e30",scrollTrack:"#050c14",scrollThumb:"#1a3a5c",
    stackBtnBgOn:"#0d2a5a",stackBtnBorderOn:"#1565c0",stackBtnColorOn:"#64b5f6",
    stackBtnBgOff:"#060d18",stackBtnBorderOff:"#0d1e30",stackBtnColorOff:"#1e3a5f",
    modelColor:"#455a64",stackLabelColor:"#1e3a5f",footerTextColor:"#1e2a3a",
    toggleBg:"#0d1e30",toggleBorder:"#1e3a5f",toggleTrack:"#1e3a5f",toggleKnob:"#64b5f6",toggleLabel:"#64b5f6",
    swListBg:"#040a10",swListBorder:"#0d1e30",swListHover:"#060d18",swListSelected:"#0d2a5a",
    swListNameColor:"#64b5f6",swListHostColor:"#1e3a5f",swListLocColor:"#263238",
    badgeUpBg:"#00c85322",badgeUpBorder:"#00c853",badgeUpColor:"#00c853",
    badgeErrBg:"#f4433622",badgeErrBorder:"#f44336",badgeErrColor:"#f44336",
    badgeWarnBg:"#ffd74022",badgeWarnBorder:"#ffd740",badgeWarnColor:"#ffd740",
    loadingColor:"#1a73e8",errorBg:"#ff174408",errorBorder:"#ff174422",errorColor:"#ff5252",
    sectionLabel:"#1e3a5f",
  },
  light: {
    pageBg:"linear-gradient(160deg,#eaeff7 0%,#e4eaf4 50%,#dde4f0 100%)",
    cardBg:"linear-gradient(160deg,#eef4fc 0%,#e8f0fa 100%)",cardBorder:"#aabcd4",
    inputBg:"#ffffff",inputBorder:"#adb4c2",inputColor:"#1a2a44",inputPlaceholder:"#8896a8",
    chassisBg:"linear-gradient(180deg,#ced3dc 0%,#c2c7d2 40%,#b8bdc8 100%)",
    chassisBorder:"#98a0ae",chassisTopBg:"linear-gradient(90deg,#cdd2db 0%,#d3d8e2 50%,#cdd2db 100%)",
    chassisTopBorder:"#98a0ae",chassisFooterBg:"#b4b9c4",chassisFooterBorder:"#98a0ae",
    chassisGlow:"0 0 20px #1565c015,0 4px 20px #0002",chassisGlowHover:"0 0 30px #1565c022,0 4px 28px #0003",
    portGroupBg:"linear-gradient(180deg,#b0b5c0 0%,#a8adb8 100%)",portGroupBorder:"#8a9098",
    portGroupShadow:"inset 0 1px 0 #ffffff33,inset 0 -1px 0 #00000018",portNumColor:"#68707e",
    separatorColor:"linear-gradient(180deg,transparent 0%,#98a0ae 20%,#8a9098 50%,#98a0ae 80%,transparent 100%)",
    portBgUp:"linear-gradient(180deg,#1e3020 0%,#162416 100%)",portBgDisabled:"linear-gradient(180deg,#828894 0%,#767c88 100%)",
    portBgDown:"linear-gradient(180deg,#3a3f48 0%,#2e3038 100%)",portBgSelected:"linear-gradient(180deg,#1565c0 0%,#0d47a1 100%)",
    portBorderUp:"#2e7d32",portBorderDisabled:"#60666e",portBorderDown:"#444a54",portBorderUnused:"#7a4800",portBorderSelected:"#42a5f5",
    portSocketBgUp:"#050d08",portSocketBgDisabled:"#54595e",portSocketBgSelected:"#0d2a5a",
    portSocketBorderUp:"#1b4020",portSocketBorderDisabled:"#404448",portSocketBorderDown:"#2c3038",
    portPinUp:"#c8a828",portPinUpAlt:"#a08820",portPinDown:"#2c3038",
    portSocketShadow:"linear-gradient(180deg,#0005 0%,transparent 100%)",
    sfpBgActive:"linear-gradient(180deg,#152818 0%,#0e1e10 100%)",sfpBgInactive:"linear-gradient(180deg,#868c98 0%,#7e8490 100%)",
    sfpBorderActive:"#2e7d32",sfpBorderInactive:"#606870",sfpLedInactive:"#1a2a1a",
    sfpSlotBgActive:"#051008",sfpSlotBgInactive:"#565c68",sfpSlotBorderActive:"#1b4020",sfpSlotBorderInactive:"#40464e",
    consoleBg:"#565c68",
    statsBg:"linear-gradient(90deg,#d8dfe8 0%,#dde4ee 50%,#d8dfe8 100%)",statsBorder:"#adb4c2",statsLabel:"#68707e",
    tabBgOn:"#1565c018",tabBorderOn:"#1565c0",tabColorOn:"#0d47a1",tabBgOff:"transparent",tabBorderOff:"#adb4c2",tabColorOff:"#68707e",
    detailBg:"linear-gradient(160deg,#eef4fc 0%,#e8f0fa 100%)",detailBorder:"#aabcd4",detailText:"#3a4a5e",
    detailShadow:"0 8px 28px #0002",detailTitle:"#0d1f3c",detailMuted:"#68707e",detailCloseBorder:"#adb4c2",
    detailCardBg:"#e4edf8",detailCardBorder:"#bccad8",detailLabel:"#8896a8",
    detailTrafficBg:"#e4edf8",detailTrafficBorder:"#bccad8",detailBarBg:"#ccd8e8",
    detailMacBg:"#dae4f2",detailMacBorder:"#bccad8",detailMacHead:"#e4edf8",detailMacHeadColor:"#68707e",
    detailEvBg:"#e4edf8",detailEvBorder:"#d2dcea",detailEvTs:"#68707e",detailEvAgo:"#8896a8",
    detailDownBg:"#fff0f0",detailDownBorder:"#ffbbbb",detailDownColor:"#c62828",
    tableBg:"#edf3fb",tableBorder:"#adb4c2",tableHeadBg:"#e0e8f4",tableHeadColor:"#68707e",
    tableRowBorder:"#d6dcea",tableRowHover:"#e4edf8",tableRowSelected:"#d8e6f4",
    tablePort:"#1565c0",tableVlan:"#3a5a8a",tableSpeed:"#4a5a6a",tableMode:"#b8860b",tableDesc:"#68707e",
    unusedBg:"#fdf5ee",unusedBorder:"#d09060",unusedHeadBg:"linear-gradient(90deg,#fff0e2 0%,#fde8d0 100%)",
    unusedHeadBorder:"#d09060",unusedHeadColor:"#b84000",unusedHeadSub:"#906040",
    unusedColBg:"#f4ece2",unusedColColor:"#806040",unusedRowBorder:"#ead8c8",unusedRowHover:"#f4ece2",
    unusedPort:"#1565c0",unusedVlan:"#3a5a6a",unusedDate:"#68707e",unusedAction:"#8896a8",
    ciscoColor:"#1565c0",subColor:"#0d47a1",metaColor:"#8896a8",ledLabel:"#68707e",legendColor:"#68707e",
    footerBorder:"#ccd4e0",footerColor:"#adb4c2",scrollTrack:"#dde4ee",scrollThumb:"#adb4c2",
    stackBtnBgOn:"#1565c015",stackBtnBorderOn:"#1565c0",stackBtnColorOn:"#0d47a1",
    stackBtnBgOff:"#ffffff",stackBtnBorderOff:"#adb4c2",stackBtnColorOff:"#68707e",
    modelColor:"#585e6a",stackLabelColor:"#8090a0",footerTextColor:"#68707e",
    toggleBg:"#ffffff",toggleBorder:"#adb4c2",toggleTrack:"#c0ccd8",toggleKnob:"#1565c0",toggleLabel:"#0d47a1",
    swListBg:"#ffffff",swListBorder:"#adb4c2",swListHover:"#f0f5fc",swListSelected:"#dbeafe",
    swListNameColor:"#1565c0",swListHostColor:"#68707e",swListLocColor:"#8896a8",
    badgeUpBg:"#d1fae5",badgeUpBorder:"#34d399",badgeUpColor:"#065f46",
    badgeErrBg:"#fee2e2",badgeErrBorder:"#f87171",badgeErrColor:"#991b1b",
    badgeWarnBg:"#fef3c7",badgeWarnBorder:"#f59e0b",badgeWarnColor:"#92400e",
    loadingColor:"#1565c0",errorBg:"#fee2e2",errorBorder:"#fca5a5",errorColor:"#991b1b",
    sectionLabel:"#8896a8",
  }
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmtDur = ms => { if(!ms||ms<0) return "0m"; const s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60); return d>0?`${d}d ${h}h ${m}m`:h>0?`${h}h ${m}m`:`${m}m`; };
const fmtBytes = b => b>1e9?`${(b/1e9).toFixed(2)} GB`:b>1e6?`${(b/1e6).toFixed(1)} MB`:b>1e3?`${(b/1e3).toFixed(0)} KB`:`${b} B`;
const fmtTs = ts => new Date(ts).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const unusedClr = ms => { const d=ms/86400000; return d>90?"#e85530":d>30?"#c9860a":d>14?"#5a8020":"#78909c"; };

// ─── CSS ──────────────────────────────────────────────────────────────────────
const mkCSS = t => `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:${t.scrollTrack};}
  ::-webkit-scrollbar-thumb{background:${t.scrollThumb};border-radius:2px;}
  ::placeholder{color:${t.inputPlaceholder};}
  @keyframes pulse-green{0%,100%{opacity:1;box-shadow:0 0 6px #00e676,0 0 12px #00e67644}50%{opacity:.7;box-shadow:0 0 3px #00e676}}
  @keyframes pulse-amber{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes blink-red{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes slide-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes chassis-glow{0%,100%{box-shadow:${t.chassisGlow}}50%{box-shadow:${t.chassisGlowHover}}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fade-in{from{opacity:0}to{opacity:1}}
`;

// ─── RJ45 PORT ────────────────────────────────────────────────────────────────
function RJ45Port({ port, selected, onClick }) {
  const t = useTheme();
  const [act, setAct] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (port.status === "up") {
      ref.current = setInterval(() => { setAct(true); setTimeout(() => setAct(false), 80+Math.random()*120); }, 600+Math.random()*1800);
    }
    return () => clearInterval(ref.current);
  }, [port.status]);
  const isUp = port.status==="up", isDown = port.status==="down", isDis = port.status==="disabled";
  const bg = selected?t.portBgSelected:isUp?t.portBgUp:isDis?t.portBgDisabled:t.portBgDown;
  const bc = selected?t.portBorderSelected:isUp?t.portBorderUp:isDis?t.portBorderDisabled:port.isUnused?t.portBorderUnused:t.portBorderDown;
  const led1 = isUp?"#00e676":isDown?"#ff1744":"#2a2e34";
  const led2 = isUp&&act?"#ffd740":isUp?"#1b5e20":"#1a1a1f";
  return (
    <div onClick={onClick}
      title={`${port.id}${port.description?" — "+port.description:""} | ${port.status.toUpperCase()}${port.isUnused?" | UNUSED "+fmtDur(Date.now()-port.unusedSince):""}`}
      style={{width:32,height:44,background:bg,border:`1.5px solid ${bc}`,borderRadius:4,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 3px 3px",gap:3,position:"relative",transition:"border-color .2s,transform .1s",transform:selected?"scale(1.08)":"scale(1)",boxShadow:selected?"0 0 12px #42a5f588,0 2px 8px #0004":isUp?"0 0 4px #00e67618,0 2px 6px #0003":"0 1px 3px #0002"}}
    >
      <div style={{display:"flex",gap:3}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:led1,boxShadow:isUp?`0 0 5px ${led1}`:"none",animation:isUp?"pulse-green 2s ease-in-out infinite":isDown?"blink-red 2s ease-in-out infinite":"none",transition:"background .3s"}}/>
        <div style={{width:5,height:5,borderRadius:"50%",background:led2,boxShadow:act?"0 0 5px #ffd740":"none",transition:"background .08s"}}/>
      </div>
      <div style={{width:24,height:20,background:isDis?t.portSocketBgDisabled:selected?t.portSocketBgSelected:isUp?t.portSocketBgUp:t.portSocketBgDisabled,border:`1px solid ${isUp?t.portSocketBorderUp:isDis?t.portSocketBorderDisabled:t.portSocketBorderDown}`,borderRadius:2,position:"relative",display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:2,overflow:"hidden"}}>
        <div style={{display:"flex",gap:1.5}}>
          {Array.from({length:8},(_,i)=>(
            <div key={i} style={{width:1.5,height:isUp?8+(i%2)*3:6,background:isUp?i%2===0?t.portPinUp:t.portPinUpAlt:t.portPinDown,borderRadius:"1px 1px 0 0",transition:"background .3s"}}/>
          ))}
        </div>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:t.portSocketShadow}}/>
      </div>
      {port.isUnused&&<div style={{position:"absolute",bottom:2,left:2,right:2,height:2,borderRadius:1,background:unusedClr(Date.now()-port.unusedSince),boxShadow:`0 0 4px ${unusedClr(Date.now()-port.unusedSince)}`}}/>}
      {port.poe&&<div style={{position:"absolute",top:2,right:2,width:4,height:4,borderRadius:"50%",background:"#ffd740",boxShadow:"0 0 4px #ffd740"}}/>}
    </div>
  );
}

function SFPPort({ active }) {
  const t = useTheme();
  return (
    <div style={{width:28,height:26,background:active?t.sfpBgActive:t.sfpBgInactive,border:`1px solid ${active?t.sfpBorderActive:t.sfpBorderInactive}`,borderRadius:3,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"3px 4px",boxShadow:active?"0 0 6px #00e67618":"none"}}>
      <div style={{width:5,height:5,borderRadius:"50%",background:active?"#00e676":t.sfpLedInactive,boxShadow:active?"0 0 4px #00e676":"none",animation:active?"pulse-green 3s ease-in-out infinite":"none"}}/>
      <div style={{width:18,height:10,background:active?t.sfpSlotBgActive:t.sfpSlotBgInactive,border:`1px solid ${active?t.sfpSlotBorderActive:t.sfpSlotBorderInactive}`,borderRadius:1}}/>
    </div>
  );
}

function TGraph({ label, value, max, color }) {
  const t = useTheme();
  return (
    <div style={{flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{color:t.detailLabel,fontSize:9}}>{label}</span>
        <span style={{color,fontSize:9}}>{value} Mbps</span>
      </div>
      <div style={{height:4,background:t.detailBarBg,borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.min(100,(value/max)*100)}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:2,transition:"width 1s"}}/>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map={up:["#00c853","#00c85322"],down:["#f44336","#f4433622"],disabled:["#78909c","#78909c22"]};
  const [fg,bg]=map[status]||map.disabled;
  return <div style={{background:bg,border:`1px solid ${fg}`,borderRadius:4,padding:"3px 10px",color:fg,fontSize:10,fontWeight:"bold",fontFamily:"monospace",letterSpacing:1}}>{status.toUpperCase()}</div>;
}

// ─── PORT DETAIL ──────────────────────────────────────────────────────────────
function PortDetail({ port, switchHost, onClose }) {
  const t = useTheme();
  const [macTable, setMacTable] = useState(port.macTable || []);
  const [loadingMac, setLoadingMac] = useState(false);
  const now = Date.now();
  const ud = port.isUnused ? now - port.unusedSince : null;
  const lsa = port.lastSeen ? now - new Date(port.lastSeen).getTime() : null;

  const fetchMac = async () => {
    setLoadingMac(true);
    try {
      const r = await fetch(`${API_BASE}/api/switches/${switchHost}/ports/${encodeURIComponent(port.id)}/mac`);
      const d = await r.json();
      setMacTable(d.macTable || []);
    } catch { /* ignore */ }
    setLoadingMac(false);
  };

  return (
    <div style={{background:t.detailBg,border:`1px solid ${t.detailBorder}`,borderRadius:8,padding:20,fontFamily:"'Share Tech Mono',monospace",color:t.detailText,fontSize:11,animation:"slide-in .2s ease-out",boxShadow:t.detailShadow}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.detailTitle,fontSize:22,fontWeight:700,letterSpacing:2}}>{port.id}</div>
          <div style={{color:t.detailMuted,fontSize:10,marginTop:2}}>{port.description||"No description"}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <StatusBadge status={port.status}/>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${t.detailCloseBorder}`,color:t.detailMuted,borderRadius:4,cursor:"pointer",padding:"4px 10px",fontSize:12,fontFamily:"monospace"}}>✕</button>
        </div>
      </div>
      {port.isUnused&&(
        <div style={{background:`${unusedClr(ud)}10`,border:`1px solid ${unusedClr(ud)}44`,borderRadius:6,padding:"10px 14px",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:20}}>⚠</div>
          <div>
            <div style={{color:unusedClr(ud),fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:1}}>PORT UNUSED</div>
            <div style={{color:t.detailText,fontSize:10,marginTop:2}}>No activity for <span style={{color:unusedClr(ud),fontWeight:"bold"}}>{fmtDur(ud)}</span> — since {fmtTs(port.unusedSince)}</div>
          </div>
        </div>
      )}
      {port.status==="down"&&!port.isUnused&&lsa&&(
        <div style={{background:t.detailDownBg,border:`1px solid ${t.detailDownBorder}`,borderRadius:6,padding:"8px 14px",marginBottom:14,color:t.detailDownColor,fontSize:10}}>
          Port went DOWN {fmtDur(lsa)} ago — {fmtTs(port.lastSeen)}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
        {[["SPEED",`${port.speed} Mbps`,"#2196f3"],["VLAN",port.vlan,"#9c27b0"],["MODE",port.mode?.toUpperCase(),"#f59e0b"],["PoE",port.poe?`${port.poeWatts}W`:"Off",port.poe?"#f59e0b":"#78909c"],["UPTIME",port.uptime?fmtDur(port.uptime*1000):"—","#00897b"],["LAST CHG",fmtTs(port.lastChanged),"#43a047"]].map(([l,v,c])=>(
          <div key={l} style={{background:t.detailCardBg,border:`1px solid ${t.detailCardBorder}`,borderRadius:4,padding:"6px 8px"}}>
            <div style={{color:t.detailLabel,fontSize:9,marginBottom:2}}>{l}</div>
            <div style={{color:c,fontWeight:"bold",fontSize:11,wordBreak:"break-all"}}>{v}</div>
          </div>
        ))}
      </div>
      {port.status==="up"&&(
        <div style={{marginBottom:14}}>
          <div style={{color:t.detailLabel,fontSize:9,letterSpacing:1,marginBottom:6}}>THROUGHPUT</div>
          <div style={{background:t.detailTrafficBg,border:`1px solid ${t.detailTrafficBorder}`,borderRadius:4,padding:"8px 10px",display:"flex",flexDirection:"column",gap:8}}>
            <TGraph label="RX" value={port.rxRate||0} max={1000} color="#4fc3f7"/>
            <TGraph label="TX" value={port.txRate||0} max={1000} color="#66bb6a"/>
            <div style={{display:"flex",gap:16,marginTop:2}}>
              <span style={{color:t.detailLabel,fontSize:9}}>RX: <span style={{color:"#4fc3f7"}}>{fmtBytes(port.rxBytes||0)}</span></span>
              <span style={{color:t.detailLabel,fontSize:9}}>TX: <span style={{color:"#66bb6a"}}>{fmtBytes(port.txBytes||0)}</span></span>
            </div>
          </div>
        </div>
      )}
      <div style={{marginBottom:14}}>
        <div style={{color:t.detailLabel,fontSize:9,letterSpacing:1,marginBottom:6}}>ERROR COUNTERS</div>
        <div style={{display:"flex",gap:6}}>
          {[["RX ERR",port.errors?.rx||0],["TX ERR",port.errors?.tx||0],["CRC",port.errors?.crc||0]].map(([l,v])=>(
            <div key={l} style={{flex:1,background:v>0?"#f4433610":t.detailCardBg,border:`1px solid ${v>0?"#f4433630":t.detailCardBorder}`,borderRadius:4,padding:"6px 8px",textAlign:"center"}}>
              <div style={{color:t.detailLabel,fontSize:9}}>{l}</div>
              <div style={{color:v>0?"#f44336":t.detailMuted,fontSize:14,fontWeight:"bold"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      {/* MAC Table with live fetch */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{color:t.detailLabel,fontSize:9,letterSpacing:1}}>MAC ADDRESS TABLE</div>
          <button onClick={fetchMac} disabled={loadingMac} style={{background:"none",border:`1px solid ${t.detailCloseBorder}`,color:t.detailMuted,borderRadius:3,cursor:"pointer",padding:"2px 8px",fontSize:9,fontFamily:"monospace"}}>
            {loadingMac?"…":"↻ FETCH LIVE"}
          </button>
        </div>
        {macTable.length===0 ? (
          <div style={{color:t.detailMuted,fontSize:9,padding:"8px 0"}}>No entries — click FETCH LIVE to query switch</div>
        ) : (
          <div style={{background:t.detailMacBg,border:`1px solid ${t.detailMacBorder}`,borderRadius:4,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 50px 60px",padding:"4px 8px",background:t.detailMacHead,color:t.detailMacHeadColor,fontSize:9,borderBottom:`1px solid ${t.detailMacBorder}`}}>
              <span>MAC</span><span>VLAN</span><span>TYPE</span>
            </div>
            {macTable.map((e,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 50px 60px",padding:"4px 8px",borderTop:i>0?`1px solid ${t.detailMacBg}`:"none"}}>
                <span style={{color:"#00897b",fontFamily:"monospace"}}>{e.mac}</span>
                <span style={{color:"#1565c0"}}>{e.vlan}</span>
                <span style={{color:"#f59e0b"}}>{e.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Events */}
      {port.events&&port.events.length>0&&(
        <div>
          <div style={{color:t.detailLabel,fontSize:9,letterSpacing:1,marginBottom:6}}>PORT EVENT HISTORY</div>
          <div style={{maxHeight:130,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
            {port.events.slice(0,15).map((ev,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"center",background:t.detailEvBg,border:`1px solid ${t.detailEvBorder}`,borderRadius:3,padding:"3px 8px"}}>
                <div style={{width:5,height:5,borderRadius:"50%",flexShrink:0,background:ev.event==="up"?"#00e676":"#ff1744"}}/>
                <span style={{color:t.detailEvTs,fontSize:9,flex:1}}>{fmtTs(ev.timestamp)}</span>
                <span style={{color:ev.event==="up"?"#00c853":"#f44336",fontSize:9,fontWeight:"bold"}}>{ev.event.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SWITCH CHASSIS ───────────────────────────────────────────────────────────
function SwitchChassis({ stackId, ports, selectedPort, onPortClick, switchName }) {
  const t = useTheme();
  const up = ports.filter(p=>p.status==="up").length;
  const uu = ports.filter(p=>p.isUnused).length;
  // 4 groups × 12 ports (6 cols × 2 rows)
  return (
    <div style={{background:t.chassisBg,border:`2px solid ${t.chassisBorder}`,borderRadius:6,marginBottom:6,animation:"chassis-glow 6s ease-in-out infinite",overflow:"hidden"}}>
      <div style={{background:t.chassisTopBg,borderBottom:`1px solid ${t.chassisTopBorder}`,padding:"5px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.ciscoColor,fontSize:15,fontWeight:900,letterSpacing:3}}>CISCO</div>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <div style={{color:t.modelColor,fontSize:7,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>CATALYST 9300-48P-E</div>
            <div style={{color:t.stackLabelColor,fontSize:6,fontFamily:"'Share Tech Mono',monospace"}}>{switchName} · STACK {stackId}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginLeft:6}}>
            {[["SYST","#00e676","pulse-green 2s ease-in-out infinite"],["STAT","#ffd740","pulse-amber 3s ease-in-out infinite"],["DUPLX","#00e676",null],["SPEED","#ffd740",null],["PoE","#ffd740",null]].map(([l,c,a])=>(
              <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:c,boxShadow:`0 0 5px ${c}`,animation:a||"none"}}/>
                <div style={{color:t.ledLabel,fontSize:5,fontFamily:"'Share Tech Mono',monospace"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,fontFamily:"'Share Tech Mono',monospace"}}>
          <div style={{textAlign:"right"}}>
            <div style={{color:"#00c853",fontSize:10,fontWeight:"bold"}}>{up}/{ports.length}</div>
            <div style={{color:t.stackLabelColor,fontSize:6}}>PORTS UP</div>
          </div>
          {uu>0&&<div style={{textAlign:"right"}}><div style={{color:"#e85530",fontSize:10,fontWeight:"bold"}}>{uu}</div><div style={{color:t.stackLabelColor,fontSize:6}}>UNUSED</div></div>}
        </div>
      </div>
      <div style={{padding:"8px 10px 6px",display:"flex",alignItems:"stretch",gap:6}}>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:0}}>
          {Array.from({length:4},(_,g)=>{
            const gp = ports.slice(g*12,g*12+12);
            const cols6 = Array.from({length:6},(_,c)=>({top:gp[c*2],bot:gp[c*2+1]}));
            return (
              <div key={g} style={{display:"flex",alignItems:"center",gap:0}}>
                <div style={{background:t.portGroupBg,border:`1.5px solid ${t.portGroupBorder}`,borderRadius:3,padding:"6px 6px 4px",boxShadow:t.portGroupShadow,display:"flex",flexDirection:"column",gap:0}}>
                  <div style={{display:"flex",gap:3,marginBottom:3}}>
                    {cols6.map(({top},c)=>top?<RJ45Port key={top.id} port={top} selected={selectedPort?.id===top.id} onClick={()=>onPortClick(top)}/>:<div key={c} style={{width:32,height:44}}/>)}
                  </div>
                  <div style={{display:"flex",gap:3}}>
                    {cols6.map(({bot},c)=>bot?<RJ45Port key={bot.id} port={bot} selected={selectedPort?.id===bot.id} onClick={()=>onPortClick(bot)}/>:<div key={c} style={{width:32,height:44}}/>)}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4,paddingLeft:2,paddingRight:2}}>
                    <span style={{color:t.portNumColor,fontSize:7,fontFamily:"'Share Tech Mono',monospace"}}>{g*12+1}</span>
                    <span style={{color:t.portNumColor,fontSize:7,fontFamily:"'Share Tech Mono',monospace"}}>{g*12+12}</span>
                  </div>
                </div>
                {g<3&&<div style={{width:8,alignSelf:"stretch",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:1.5,height:"65%",background:t.separatorColor,borderRadius:1}}/></div>}
              </div>
            );
          })}
        </div>
        <div style={{borderLeft:`2px solid ${t.chassisBorder}`,marginLeft:4,paddingLeft:8,display:"flex",gap:8,alignItems:"center"}}>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{color:t.portNumColor,fontSize:6,fontFamily:"'Share Tech Mono',monospace",marginBottom:1,textAlign:"center"}}>SFP+</div>
            {[[true,true],[false,false]].map((row,ri)=>(
              <div key={ri} style={{display:"flex",gap:3}}>
                {row.map((a,ci)=><SFPPort key={ci} active={a}/>)}
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,borderLeft:`1px solid ${t.chassisBorder}`,paddingLeft:7}}>
            {[["CON","#78909c"],["USB","#78909c"],["MGT",t.ciscoColor]].map(([l,c])=>(
              <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:18,height:12,background:t.consoleBg,border:`1px solid ${c}55`,borderRadius:2}}/>
                <div style={{color:t.portNumColor,fontSize:5,fontFamily:"'Share Tech Mono',monospace"}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"center",borderLeft:`1px solid ${t.chassisBorder}`,paddingLeft:7}}>
            <div style={{color:t.portNumColor,fontSize:5,fontFamily:"'Share Tech Mono',monospace"}}>PWR</div>
            <div style={{width:9,height:9,borderRadius:"50%",background:"#00e676",boxShadow:"0 0 7px #00e676,0 0 14px #00e67644",animation:"pulse-green 3s ease-in-out infinite"}}/>
          </div>
        </div>
      </div>
      <div style={{background:t.chassisFooterBg,borderTop:`1px solid ${t.chassisFooterBorder}`,padding:"3px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:t.footerTextColor,fontSize:6,fontFamily:"'Share Tech Mono',monospace"}}>WS-C9300-48P | 48× GE PoE+ | 4× 10G SFP+ | IOS-XE</div>
        <div style={{display:"flex",gap:10}}>
          {[["UP",ports.filter(p=>p.status==="up").length,"#00c853"],["DOWN",ports.filter(p=>p.status==="down").length,"#f44336"],["UNUSED",uu,"#e85530"],["PoE",ports.filter(p=>p.poe).length,"#f59e0b"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",gap:2,alignItems:"center"}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:c}}/>
              <span style={{color:t.footerTextColor,fontSize:6,fontFamily:"'Share Tech Mono',monospace"}}>{l}:{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SWITCH SEARCH LIST ───────────────────────────────────────────────────────
function SwitchList({ switches, selectedHost, onSelect, loading }) {
  const t = useTheme();
  const [query, setQuery] = useState("");
  const filtered = switches.filter(sw =>
    sw.name.toLowerCase().includes(query.toLowerCase()) ||
    sw.host.includes(query) ||
    (sw.location||"").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:8,overflow:"hidden",width:280,flexShrink:0}}>
      {/* Header */}
      <div style={{padding:"10px 14px",borderBottom:`1px solid ${t.cardBorder}`}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.ciscoColor,fontSize:14,fontWeight:700,letterSpacing:2,marginBottom:8}}>
          SWITCH INVENTORY
        </div>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search name / IP / location…"
          style={{width:"100%",background:t.inputBg,border:`1px solid ${t.inputBorder}`,color:t.inputColor,borderRadius:5,padding:"6px 10px",fontSize:10,fontFamily:"'Share Tech Mono',monospace",outline:"none"}}
        />
      </div>
      {/* List */}
      <div style={{maxHeight:480,overflowY:"auto"}}>
        {filtered.length===0 && (
          <div style={{padding:20,color:t.sectionLabel,fontSize:10,textAlign:"center",fontFamily:"'Share Tech Mono',monospace"}}>
            No switches found
          </div>
        )}
        {filtered.map(sw=>{
          const isSelected = sw.host === selectedHost;
          const reachable = sw.reachable;
          return (
            <div key={sw.host}
              onClick={()=>onSelect(sw)}
              style={{padding:"10px 14px",borderBottom:`1px solid ${t.swListBorder}`,cursor:"pointer",background:isSelected?t.swListSelected:t.swListBg,transition:"background .15s"}}
              onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.background=t.swListHover;}}
              onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.background=isSelected?t.swListSelected:t.swListBg;}}
            >
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.swListNameColor,fontSize:13,fontWeight:700,letterSpacing:1}}>{sw.name}</div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  {reachable===true&&<span style={{background:t.badgeUpBg,border:`1px solid ${t.badgeUpBorder}`,color:t.badgeUpColor,fontSize:8,borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>ONLINE</span>}
                  {reachable===false&&<span style={{background:t.badgeErrBg,border:`1px solid ${t.badgeErrBorder}`,color:t.badgeErrColor,fontSize:8,borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>OFFLINE</span>}
                  {reachable===null&&<span style={{background:t.badgeWarnBg,border:`1px solid ${t.badgeWarnBorder}`,color:t.badgeWarnColor,fontSize:8,borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>?</span>}
                </div>
              </div>
              <div style={{fontFamily:"'Share Tech Mono',monospace",color:t.swListHostColor,fontSize:9,marginBottom:2}}>{sw.host}</div>
              <div style={{fontFamily:"'Share Tech Mono',monospace",color:t.swListLocColor,fontSize:8}}>{sw.location}</div>
              {(sw.portsUp!==null&&sw.portsUp!==undefined)&&(
                <div style={{fontFamily:"'Share Tech Mono',monospace",color:"#00c853",fontSize:8,marginTop:3}}>{sw.portsUp}/{sw.portCount} ports up</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar({ ports }) {
  const t = useTheme();
  const up=ports.filter(p=>p.status==="up").length, dn=ports.filter(p=>p.status==="down").length,
        dis=ports.filter(p=>p.status==="disabled").length, uu=ports.filter(p=>p.isUnused).length,
        poe=ports.filter(p=>p.poe).length, poeW=ports.reduce((s,p)=>s+Number(p.poeWatts||0),0);
  return (
    <div style={{background:t.statsBg,border:`1px solid ${t.statsBorder}`,borderRadius:8,padding:"10px 16px",marginBottom:12,display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
      {[["ACTIVE",up,"#00c853"],["DOWN",dn,"#f44336"],["DISABLED",dis,"#78909c"],["UNUSED",uu,"#e85530"],["PoE PORTS",poe,"#f59e0b"],["PoE LOAD",`${poeW.toFixed(0)}W`,"#ff9100"],["TOTAL",ports.length,"#1565c0"]].map(([l,v,c])=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{color:t.statsLabel,fontSize:8,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,marginBottom:2}}>{l}</div>
          <div style={{color:c,fontSize:20,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,lineHeight:1}}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
function ThemeToggle({ theme, onToggle }) {
  const t = THEMES[theme]; const isDark = theme==="dark";
  return (
    <button onClick={onToggle} style={{display:"flex",alignItems:"center",gap:7,background:t.toggleBg,border:`1px solid ${t.toggleBorder}`,borderRadius:20,padding:"5px 12px 5px 8px",cursor:"pointer",transition:"all .3s"}}>
      <div style={{width:32,height:17,borderRadius:9,background:t.toggleTrack,position:"relative",transition:"background .3s",flexShrink:0}}>
        <div style={{position:"absolute",top:2,left:isDark?2:15,width:13,height:13,borderRadius:"50%",background:t.toggleKnob,transition:"left .25s cubic-bezier(.4,0,.2,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8}}>
          {isDark?"🌙":"☀️"}
        </div>
      </div>
      <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:1,color:t.toggleLabel}}>{isDark?"DARK":"LIGHT"}</span>
    </button>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(()=>localStorage.getItem("cisco_theme")||"dark");
  const [switches, setSwitches] = useState([]);
  const [selectedSwitch, setSelectedSwitch] = useState(null);
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);   // "live" | "cache"
  const [cachedAt, setCachedAt] = useState(null);
  const [tab, setTab] = useState("chassis");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const t = THEMES[theme];

  const toggleTheme = () => setTheme(p=>{const n=p==="dark"?"light":"dark";localStorage.setItem("cisco_theme",n);return n;});

  // Load switch inventory on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/switches`)
      .then(r=>r.json())
      .then(setSwitches)
      .catch(()=>setSwitches([]));
  }, []);

  // Load ports when a switch is selected
  const loadSwitch = useCallback(async (sw, forceRefresh=false) => {
    setSelectedSwitch(sw);
    setPorts([]);
    setSelectedPort(null);
    setError(null);
    setLoading(true);
    try {
      if (forceRefresh) {
        await fetch(`${API_BASE}/api/switches/${sw.host}/refresh`, {method:"POST"});
      }
      const r = await fetch(`${API_BASE}/api/switches/${sw.host}/ports`);
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.detail || "Failed to load switch data");
      }
      const d = await r.json();
      setPorts(d.ports || []);
      setSource(d.source);
      setCachedAt(d.cachedAt);
      // Update switches list with fresh data
      setSwitches(prev => prev.map(s => s.host===sw.host ? {...s, reachable:true, portCount:d.ports.length, portsUp:d.ports.filter(p=>p.status==="up").length} : s));
    } catch (e) {
      setError(e.message);
      setSwitches(prev => prev.map(s => s.host===sw.host ? {...s, reachable:false} : s));
    }
    setLoading(false);
  }, []);

  const filteredPorts = ports.filter(p=>{
    if(filter==="unused") return p.isUnused;
    if(filter!=="all"&&p.status!==filter) return false;
    if(search&&!p.id.toLowerCase().includes(search.toLowerCase())&&!(p.description||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <ThemeCtx.Provider value={t}>
      <div style={{minHeight:"100vh",background:t.pageBg,padding:"20px 16px 32px",fontFamily:"'Share Tech Mono',monospace"}}>
        <style>{mkCSS(t)}</style>

        {/* ── Header ── */}
        <div style={{marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{display:"flex",alignItems:"baseline",gap:10}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.ciscoColor,fontSize:28,fontWeight:900,letterSpacing:4,textShadow:`0 0 30px ${t.ciscoColor}33`}}>CISCO</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.subColor,fontSize:18,fontWeight:600,letterSpacing:3}}>Catalyst 9300 Live Monitor</div>
            </div>
            <div style={{color:t.metaColor,fontSize:9,letterSpacing:2,marginTop:2}}>
              SSH · NETMIKO · READ-ONLY &nbsp;|&nbsp; LIVE SWITCH DATA
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme}/>
        </div>

        {/* ── Main layout: sidebar + content ── */}
        <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>

          {/* Switch list sidebar */}
          <SwitchList
            switches={switches}
            selectedHost={selectedSwitch?.host}
            onSelect={sw=>loadSwitch(sw)}
            loading={loading}
          />

          {/* Right panel */}
          <div style={{flex:1,minWidth:0}}>

            {/* Nothing selected yet */}
            {!selectedSwitch&&!loading&&(
              <div style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:8,padding:48,textAlign:"center",animation:"fade-in .3s ease-out"}}>
                <div style={{fontSize:36,marginBottom:12}}>🔌</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.ciscoColor,fontSize:20,fontWeight:700,letterSpacing:2,marginBottom:8}}>SELECT A SWITCH</div>
                <div style={{color:t.metaColor,fontSize:10}}>Choose a switch from the inventory list to view live port data via SSH</div>
              </div>
            )}

            {/* Loading */}
            {loading&&(
              <div style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:8,padding:48,textAlign:"center",animation:"fade-in .2s"}}>
                <div style={{width:28,height:28,border:`3px solid ${t.loadingColor}33`,borderTop:`3px solid ${t.loadingColor}`,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}/>
                <div style={{color:t.metaColor,fontSize:10}}>Connecting via SSH to {selectedSwitch?.host}…</div>
                <div style={{color:t.sectionLabel,fontSize:9,marginTop:6}}>Running: show interfaces status · show power inline · show interfaces</div>
              </div>
            )}

            {/* Error */}
            {error&&!loading&&(
              <div style={{background:t.errorBg,border:`1px solid ${t.errorBorder}`,borderRadius:8,padding:20,marginBottom:14,animation:"fade-in .2s"}}>
                <div style={{color:t.errorColor,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,marginBottom:6}}>⚠ CONNECTION FAILED</div>
                <div style={{color:t.errorColor,fontSize:10,marginBottom:12}}>{error}</div>
                <button onClick={()=>loadSwitch(selectedSwitch,true)} style={{background:"none",border:`1px solid ${t.errorBorder}`,color:t.errorColor,borderRadius:4,cursor:"pointer",padding:"5px 14px",fontSize:10,fontFamily:"monospace"}}>↻ RETRY</button>
              </div>
            )}

            {/* Switch data loaded */}
            {selectedSwitch&&ports.length>0&&!loading&&(
              <div style={{animation:"fade-in .25s ease-out"}}>
                {/* Switch meta bar */}
                <div style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:8,padding:"10px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.ciscoColor,fontSize:16,fontWeight:700,letterSpacing:2}}>{selectedSwitch.name}</div>
                    <div style={{color:t.metaColor,fontSize:9,marginTop:2}}>{selectedSwitch.host} · {selectedSwitch.location}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {source&&<span style={{background:source==="live"?t.badgeUpBg:t.badgeWarnBg,border:`1px solid ${source==="live"?t.badgeUpBorder:t.badgeWarnBorder}`,color:source==="live"?t.badgeUpColor:t.badgeWarnColor,fontSize:9,borderRadius:4,padding:"2px 8px",fontFamily:"monospace"}}>
                      {source==="live"?"● LIVE DATA":"● CACHED"}{cachedAt?` · ${fmtTs(cachedAt)}`:""}
                    </span>}
                    <button onClick={()=>loadSwitch(selectedSwitch,true)} style={{background:"none",border:`1px solid ${t.tabBorderOff}`,color:t.tabColorOff,borderRadius:4,cursor:"pointer",padding:"4px 12px",fontSize:9,fontFamily:"monospace"}}>↻ REFRESH</button>
                  </div>
                </div>

                <StatsBar ports={ports}/>

                {/* Tabs */}
                <div style={{display:"flex",gap:4,marginBottom:12}}>
                  {[["chassis","CHASSIS VIEW"],["unused",`UNUSED (${ports.filter(p=>p.isUnused).length})`],["table","PORT TABLE"]].map(([k,l])=>(
                    <button key={k} onClick={()=>setTab(k)} style={{background:tab===k?t.tabBgOn:t.tabBgOff,border:`1px solid ${tab===k?t.tabBorderOn:t.tabBorderOff}`,color:tab===k?t.tabColorOn:t.tabColorOff,borderRadius:4,padding:"5px 14px",cursor:"pointer",fontSize:10,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,transition:"all .2s"}}>{l}</button>
                  ))}
                  {tab==="table"&&<>
                    <div style={{flex:1}}/>
                    {["all","up","down","disabled","unused"].map(f=>(
                      <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?t.tabBgOn:"transparent",border:`1px solid ${filter===f?t.tabBorderOn:t.tabBorderOff}`,color:filter===f?t.tabColorOn:t.tabColorOff,borderRadius:4,padding:"4px 10px",cursor:"pointer",fontSize:9,fontFamily:"'Share Tech Mono',monospace",transition:"all .2s"}}>{f.toUpperCase()}</button>
                    ))}
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search port/description…" style={{background:t.inputBg,border:`1px solid ${t.inputBorder}`,color:t.inputColor,borderRadius:4,padding:"4px 10px",fontSize:10,fontFamily:"'Share Tech Mono',monospace",outline:"none",width:180}}/>
                  </>}
                </div>

                {/* Chassis view */}
                {tab==="chassis"&&(
                  <>
                    <SwitchChassis stackId={1} ports={ports.slice(0,48)} selectedPort={selectedPort} onPortClick={p=>setSelectedPort(prev=>prev?.id===p.id?null:p)} switchName={selectedSwitch.name}/>
                    <div style={{display:"flex",gap:16,marginTop:8,flexWrap:"wrap"}}>
                      {[["UP","#00c853"],["DOWN","#f44336"],["DISABLED","#78909c"],["UNUSED 14-30d","#5a8020"],["UNUSED 30-90d","#c9860a"],["UNUSED 90d+","#e85530"],["PoE","#f59e0b"]].map(([l,c])=>(
                        <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                          <div style={{width:7,height:7,borderRadius:"50%",background:c}}/>
                          <span style={{color:t.legendColor,fontSize:9}}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Unused table */}
                {tab==="unused"&&(
                  <div style={{background:t.unusedBg,border:`1px solid ${t.unusedBorder}`,borderRadius:8,overflow:"hidden"}}>
                    <div style={{background:t.unusedHeadBg,padding:"8px 14px",display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${t.unusedHeadBorder}`}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",color:t.unusedHeadColor,fontSize:14,fontWeight:700,letterSpacing:2}}>⚠ UNUSED PORTS</span>
                      <span style={{color:t.unusedHeadSub,fontSize:9}}>{ports.filter(p=>p.isUnused).length} ports inactive</span>
                    </div>
                    {ports.filter(p=>p.isUnused).length===0
                      ? <div style={{padding:24,color:t.sectionLabel,fontSize:10,textAlign:"center"}}>✓ No unused ports</div>
                      : ports.filter(p=>p.isUnused).sort((a,b)=>a.unusedSince-b.unusedSince).map(p=>{
                          const dur=Date.now()-p.unusedSince, c=unusedClr(dur);
                          return (
                            <div key={p.id} style={{display:"grid",gridTemplateColumns:"100px 80px 200px 120px 80px",padding:"6px 14px",borderTop:`1px solid ${t.unusedRowBorder}`,cursor:"pointer",fontSize:10,transition:"background .1s"}}
                              onClick={()=>setSelectedPort(prev=>prev?.id===p.id?null:p)}
                              onMouseEnter={e=>e.currentTarget.style.background=t.unusedRowHover}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                            >
                              <span style={{color:t.unusedPort}}>{p.id}</span>
                              <span style={{color:t.unusedVlan}}>{p.vlan}</span>
                              <span style={{color:c,fontWeight:"bold"}}>{fmtDur(dur)}</span>
                              <span style={{color:t.unusedDate,fontSize:9}}>{p.unusedSince?new Date(p.unusedSince).toLocaleDateString():"—"}</span>
                              <span style={{color:t.unusedAction}}>→ VIEW</span>
                            </div>
                          );
                        })
                    }
                  </div>
                )}

                {/* Port table */}
                {tab==="table"&&(
                  <div style={{background:t.tableBg,border:`1px solid ${t.tableBorder}`,borderRadius:8,overflow:"hidden"}}>
                    <div style={{display:"grid",gridTemplateColumns:"120px 70px 60px 70px 60px 80px 1fr",padding:"6px 14px",background:t.tableHeadBg,color:t.tableHeadColor,fontSize:9,letterSpacing:1,borderBottom:`1px solid ${t.tableBorder}`}}>
                      <span>PORT</span><span>STATUS</span><span>VLAN</span><span>SPEED</span><span>MODE</span><span>PoE</span><span>DESCRIPTION</span>
                    </div>
                    {filteredPorts.map(p=>(
                      <div key={p.id} onClick={()=>setSelectedPort(prev=>prev?.id===p.id?null:p)}
                        style={{display:"grid",gridTemplateColumns:"120px 70px 60px 70px 60px 80px 1fr",padding:"5px 14px",borderTop:`1px solid ${t.tableRowBorder}`,cursor:"pointer",fontSize:10,background:selectedPort?.id===p.id?t.tableRowSelected:"transparent",transition:"background .1s"}}
                        onMouseEnter={e=>{if(selectedPort?.id!==p.id)e.currentTarget.style.background=t.tableRowHover;}}
                        onMouseLeave={e=>{if(selectedPort?.id!==p.id)e.currentTarget.style.background="transparent";}}
                      >
                        <span style={{color:t.tablePort}}>{p.id}</span>
                        <span style={{color:p.status==="up"?"#00c853":p.status==="down"?"#f44336":"#78909c"}}>{p.status.toUpperCase()}</span>
                        <span style={{color:t.tableVlan}}>{p.vlan}</span>
                        <span style={{color:t.tableSpeed}}>{p.speed}M</span>
                        <span style={{color:t.tableMode}}>{p.mode}</span>
                        <span style={{color:p.poe?"#f59e0b":t.tableHeadColor}}>{p.poe?`${p.poeWatts}W`:"—"}</span>
                        <span style={{color:t.tableDesc}}>{p.description||"—"}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Port detail panel */}
                {selectedPort&&(
                  <div style={{marginTop:14,animation:"slide-in .2s ease-out"}}>
                    <PortDetail port={selectedPort} switchHost={selectedSwitch.host} onClose={()=>setSelectedPort(null)}/>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{marginTop:24,borderTop:`1px solid ${t.footerBorder}`,paddingTop:10,color:t.footerColor,fontSize:8,textAlign:"center",letterSpacing:2}}>
          CISCO CATALYST 9300 LIVE MONITOR // SSH READ-ONLY // NETMIKO // FASTAPI
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
