import { KeyValue } from "@angular/common";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import {
  Address,
  CodeableConcept,
  ContactPoint,
  DomainResource,
  Identifier,
  Resource,
} from "fhir/r4";

export class FhirFormUtils {

  static getContactPointSystems(): string[] {
    return ["phone", "fax", "email", "pager", "url", "sms", "other"];
  }

  static getContactPointUseCases(): string[] {
    return ["home", "work", "temp", "old", "mobile"];
  }

  static getIdentifierTypes(): KeyValue<string, CodeableConcept>[] {
    return [
      {
        key: "Medical Record Number",
        value: {
          coding: [
            {
              system: "https://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MR",
              display: "Medical Record Number",
            },
          ],
          text: "Medical Record Number",
        },
      },
      {
        key: "Social Security Number",
        value: {
          coding: [
            {
              system: "https://terminology.hl7.org/CodeSystem/v2-0203",
              code: "SS",
              display: "Social Security Number",
            },
          ],
          text: "Social Security Number",
        },
      },
      {
        key: "Driver's License",
        value: {
          coding: [
            {
              system: "https://terminology.hl7.org/CodeSystem/v2-0203",
              code: "DL",
              display: "Driver's License",
            },
          ],
          text: "Driver's License",
        },
      },
      {
        key: "Passport Number",
        value: {
          coding: [
            {
              system: "https://terminology.hl7.org/CodeSystem/v2-0203",
              code: "PPN",
              display: "Passport Number",
            },
          ],
          text: "Passport Number",
        },
      },
    ];
  }

  static getAddressFormGroup(address?: Address, required = true): FormGroup {
    return new FormGroup({
      line: new FormControl(address ? address.line : "", required ? Validators.required : null),
      city: new FormControl(address ? address.city : "", required ? Validators.required : null),
      state: new FormControl(address ? address.state : "", required ? Validators.required : null),
      postalCode: new FormControl(address ? address.postalCode : "", required ? Validators.required : null),
    });
  }

  static getAddressFormArray(addresses?: Address[], required = true): FormArray {
    const groups: FormGroup[] = [];
    (addresses || []).forEach((a: Address) => {
      groups.push(this.getAddressFormGroup(a, required));
    });
    return new FormArray(groups);
  }

  static getContactPointFormGroup(contactPoint?: ContactPoint, required = true): FormGroup {
    const contactFormGroup = new FormGroup({
      system: new FormControl(contactPoint ? contactPoint.system : "", required ? Validators.required : null),
      value: new FormControl(contactPoint ? contactPoint.value : "", required ? Validators.required : null),
      use: new FormControl(contactPoint ? contactPoint.use : "", required ? Validators.required : null)
    });

    contactFormGroup.get("system")?.valueChanges.subscribe((change) => {
      if (change === "email") {
        contactFormGroup.get("value")?.addValidators(Validators.email);
        contactFormGroup.updateValueAndValidity();
      } else {
        contactFormGroup.get("value")?.removeValidators(Validators.email);
        contactFormGroup.updateValueAndValidity();
      }
    });

    return contactFormGroup;
  }

  static getContactPointFormArray(contactPoints?: ContactPoint[], required = true): FormArray {
    const groups: FormGroup[] = [];
    (contactPoints || []).forEach((c: ContactPoint) => {
      groups.push(this.getContactPointFormGroup(c, required));
    });
    return new FormArray(groups);
  }

  static compareContactPoints(object1: any, object2: any) {
    return (object1 && object2) && object1 === object2;
  }

  static getIdentifierFormGroup(identifier?: Identifier, required = true): FormGroup {
    const identifierFormGroup = new FormGroup({
      type: new FormControl(identifier ? identifier.type : '', required ? Validators.required : null),
      system: new FormControl(identifier ? identifier.system : '', required ? Validators.required : null),
      value: new FormControl(identifier ? identifier.value : '', required ? Validators.required : null),
    });

    identifierFormGroup.get("type")?.valueChanges.subscribe((change) => {
      let concept: CodeableConcept = change as CodeableConcept;
      let systemValue: any = concept.coding ? concept.coding[0].system : "";
      identifierFormGroup.get("system")?.setValue(systemValue);
    });

    return identifierFormGroup;
  }

  static getIdentifierFormArray(identifiers?: Identifier[], required = true): FormArray {
    const groups: FormGroup[] = [];
    (identifiers || []).forEach((i: Identifier) => {
      groups.push(this.getIdentifierFormGroup(i, required));
    });
    return new FormArray(groups);
  }

  static compareIdentifierTypes(object1: any, object2: any) {
    return (object1 && object2) && object1.coding[0].code === object2.coding[0].code;
  }

}
