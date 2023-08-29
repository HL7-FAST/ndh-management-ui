import { Coding, Meta, Resource } from "fhir/r4";

export class AttestationUtils {

  static notAttestedSystem: string = 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality';
  static notAttestedCode: string = 'V';

  static getNotAttestedSecurityCoding(): Coding {
    return { system: AttestationUtils.notAttestedSystem, code: AttestationUtils.notAttestedCode };
  }

  static getIsAttested(resource: Resource): boolean {
    if (!resource || !resource.meta || !resource.meta.security) {
      return true;
    }

    return !resource.meta.security.some(s => s.system === AttestationUtils.notAttestedSystem && s.code === AttestationUtils.notAttestedCode);
  }


  static toggleAttested(resource: Resource): any {

    if (!resource.meta) {
      resource.meta = {};
    }
    if (!resource.meta.security) {
      resource.meta.security = [];
    }
    

    if (AttestationUtils.getIsAttested(resource)) {
      resource.meta.security.push({system: AttestationUtils.notAttestedSystem, code: AttestationUtils.notAttestedCode});
    }
    else {
      const index = resource.meta.security.findIndex(s => s.system === AttestationUtils.notAttestedSystem && s.code === AttestationUtils.notAttestedCode);
      resource.meta.security.splice(index, 1);
    }

  }


}