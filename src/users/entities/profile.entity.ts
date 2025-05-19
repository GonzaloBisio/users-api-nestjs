import { UserRole } from '@/auth/enum/roles.enum';

export class Profile {
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;

  constructor(partial: Partial<Profile> = {}) {
    this.role = partial.role || UserRole.USER;
    this.firstName = partial.firstName || null;
    this.lastName = partial.lastName || null;
    this.phone = partial.phone || null;
    this.address = partial.address || null;
  }
}