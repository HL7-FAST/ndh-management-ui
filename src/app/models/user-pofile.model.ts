import { IUserProfile } from "../interfaces/user-profile.interface";

export class UserProfile implements IUserProfile {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  practitioner: string;
  organizations: string[];
  description?: string;

  constructor(email: string, firstname: string, lastname: string, roles: string[], practitioner: string, organizations: string[], description?: string) {
    this.email = email;
    this.firstName = firstname;
    this.lastName = lastname;
    this.roles = roles;
    this.practitioner = practitioner;
    this.organizations = organizations;
    this.description = description;
  }
  
}
