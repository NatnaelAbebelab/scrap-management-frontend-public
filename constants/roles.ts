const ROLE_NAMES = {
  weight_man: "Weight Man",
  supervisor: "Supervisor",
  admin: "Admin"
};

export default function RoleBadge({ role }: { role: keyof typeof ROLE_NAMES }) {
    const displayRole = ROLE_NAMES[role] || "Unknown Role";
    
    return displayRole;
}