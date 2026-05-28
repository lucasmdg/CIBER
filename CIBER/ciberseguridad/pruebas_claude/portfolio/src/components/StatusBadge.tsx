import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  variant?: "active" | "learning" | "alert";
}

const StatusBadge = ({ label, variant = "learning" }: StatusBadgeProps) => (
  <span className={cn("status-badge", `status-badge.${variant}`)}>
    {label}
  </span>
);

export default StatusBadge;
