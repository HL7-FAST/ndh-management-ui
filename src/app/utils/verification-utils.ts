import { DomainResource } from "fhir/r4";
import { IUserProfile } from "../interfaces/user-profile.interface";

export class VerificationUtils {


  static userCanVerify(userProfile: IUserProfile): boolean {

    const allowedRoles = ['admin', 'verifier'];

    const res = (userProfile.roles || []).some(role => {
      if (allowedRoles.includes(role.toLowerCase())) {
        return true;
      }
      return false;
    });

    return res;
  }


  static getVerificationStatus(resource: DomainResource): string {

    const extension = (resource.extension || []).find(ext => {
      return ext.url === 'http://hl7.org/fhir/us/ndh/StructureDefinition/base-ext-verification-status';
    });

    if (!extension) {
      return 'Extension Missing';
    }

    if (!extension.valueCodeableConcept) {
      return 'Codeable Concept Missing';
    }

    const coding = (extension.valueCodeableConcept.coding || []).find(c => {
      return c.system === 'http://hl7.org/fhir/us/ndh/CodeSystem/NdhVerificationStatusCS';
    });

    if (!coding) {
      return 'Coding Missing';
    }

    return coding.display || coding.code || 'Code Malformed';

  }

}