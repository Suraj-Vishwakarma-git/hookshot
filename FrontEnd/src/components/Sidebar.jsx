import { Activity, AudioLines, Boxes, ChevronLeft, ChevronRight, CircleHelp, Gauge, RadioTower, Settings2, Webhook, X } from "lucide-react";
import { NavLink } from "react-router-dom";
const links = [
  { to: "/", label: "Overview", Icon: Gauge, end: true },
  { to: "/endpoints", label: "Endpoints", Icon: RadioTower },
  { to: "/events", label: "Event log", Icon: AudioLines },
];
export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
 return <><div className={`sidebar-scrim ${open ? "visible" : ""}`} onClick={onClose}/><aside className={`sidebar ${collapsed ? "collapsed" : ""} ${open ? "mobile-open" : ""}`}>
   <div className="sidebar-brand"><div className="brand-mark"><Webhook size={21}/></div>{!collapsed && <div className="brand-copy"><strong>hookshot</strong><span>WEBHOOK PLATFORM</span></div>}<button className="icon-button mobile-close" aria-label="Close menu" onClick={onClose}><X size={18}/></button></div>
   {!collapsed && <div className="workspace-switcher"><div className="workspace-avatar">H</div><div><strong>Personal workspace</strong><span>Free plan</span></div><ChevronRight size={15}/></div>}
   <div className="nav-label">WORKSPACE</div><nav className="side-nav">{links.map(({to,label,Icon,end})=><NavLink key={to} to={to} end={end} title={collapsed ? label : undefined} onClick={onClose} className={({isActive})=>`nav-link ${isActive?"active":""}`}><Icon size={18}/>{!collapsed&&<span>{label}</span>}{!collapsed&&label==="Event log"&&<span className="nav-count">LOG</span>}</NavLink>)}</nav>
   {!collapsed && <div className="sidebar-tip"><div className="tip-icon"><Activity size={17}/></div><strong>Events, delivered.</strong><p>Connect your endpoints and watch every webhook in one place.</p><NavLink to="/endpoints" onClick={onClose}>Manage endpoints <ChevronRight size={14}/></NavLink></div>}
   <div className="sidebar-bottom"><a className="nav-link" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST" target="_blank" rel="noreferrer" title="HTTP documentation"><CircleHelp size={18}/>{!collapsed&&<span>HTTP docs</span>}</a><button className="nav-link collapse-toggle" onClick={onToggleCollapse}><Settings2 size={18}/>{!collapsed&&<span>Collapse sidebar</span>}{collapsed?<ChevronRight size={16}/>:<ChevronLeft size={16}/>}</button></div>
 </aside></>;
}
