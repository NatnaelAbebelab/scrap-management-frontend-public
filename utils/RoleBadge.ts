// Step 1: Create the RoleBadge utility class
export class RoleBadge {
    // Role key-to-label mapping
    private static readonly ROLE_NAMES = {
      weight_man: "Weight Man",
      supervisor: "Supervisor",
      super_admin: "Super Admin",
      // Add more roles as needed
    } as const;
  
    // Optional: Expose valid keys as a reusable type
    public static readonly keys = Object.keys(this.ROLE_NAMES) as (keyof typeof this.ROLE_NAMES)[];
    public static readonly DEFAULT = "Unknown Role";
  
    // Get readable name from role key
    public static get(role?: string): string {
      if (role && role in this.ROLE_NAMES) {
        return this.ROLE_NAMES[role as keyof typeof this.ROLE_NAMES];
      }
      return this.DEFAULT;
    }
  }
  
  // Optional: Export RoleKey type for reuse
  export type RoleKey = keyof typeof RoleBadge["ROLE_NAMES"];
  