import { CheckCircle2, XCircle, Clock3, CircleDot } from "lucide-react";
const config = {
  success: { label: "Delivered", className: "status-success", Icon: CheckCircle2 },
  failed: { label: "Failed", className: "status-failed", Icon: XCircle },
  pending: { label: "Pending", className: "status-pending", Icon: Clock3 },
  active: { label: "Active", className: "status-success", Icon: CheckCircle2 },
  inactive: { label: "Paused", className: "status-neutral", Icon: CircleDot },
};
export default function StatusBadge({ status = "pending" }) { const item = config[String(status).toLowerCase()] || { label: status, className: "status-neutral", Icon: CircleDot }; const { Icon } = item; return <span className={`status-badge ${item.className}`}><Icon size={13}/>{item.label}</span>; }
