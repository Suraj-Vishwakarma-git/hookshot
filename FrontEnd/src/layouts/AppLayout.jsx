import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
const titles = { "/": ["Overview", "A real-time look at your webhook infrastructure."], "/endpoints": ["Endpoints", "Manage the destinations that receive your events."], "/events": ["Event log", "Inspect published events and their delivery outcomes." ] };
export default function AppLayout({ user, onLogout }) {
 const [mobileOpen,setMobileOpen]=useState(false); const [collapsed,setCollapsed]=useState(false); const location=useLocation();
 const isDetails=location.pathname.startsWith("/events/"); const title=isDetails?"Event details":(titles[location.pathname]?.[0]||"Control center"); const subtitle=isDetails?"Inspect payloads, delivery attempts, and response details.":(titles[location.pathname]?.[1]||"Manage your webhook workspace.");
 return <div className="app-shell"><Sidebar open={mobileOpen} onClose={()=>setMobileOpen(false)} collapsed={collapsed} onToggleCollapse={()=>setCollapsed(v=>!v)}/><div className={`main-shell ${collapsed?"sidebar-collapsed":""}`}><Header user={user} onMenuClick={()=>setMobileOpen(true)} onLogout={onLogout}/><main className="page-content"><div className="page-heading"><div><div className="eyebrow"><span className="live-dot"/> WEBHOOK INFRASTRUCTURE</div><h1>{title}</h1><p>{subtitle}</p></div>{location.pathname==="/"&&<div className="heading-status"><span className="pulse-dot"/> Systems ready</div>}</div><Outlet/></main><footer className="app-footer"><span>© {new Date().getFullYear()} Hookshot</span><span><span className="footer-dot"/> API-connected workspace</span></footer></div></div>;
}
