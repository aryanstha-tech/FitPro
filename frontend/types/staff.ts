export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: "Coach" | "Front Desk" | "Manager";
  status: "active" | "inactive";
}
