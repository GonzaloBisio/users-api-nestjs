import { UserRole } from "@/auth/enum/roles.enum";

export interface AuthJwtPayload {
  sub: string;         // User ID
  email: string;       // User email
  role: UserRole;      // User role
  iat?: number;        // Issued at
  exp?: number;        // Expiration time
}
