import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Endpoint, Meta, Organization } from 'fhir/r4';
import { FormMode } from 'src/app/models/FormMode.enum';
import { EndpointService } from 'src/app/services/endpoint.service';
import { OrganizationService } from 'src/app/services/organization.service';
import baseEndpoint from '../../../../assets/fhir/Endpoint-ndh.json';
import { AttestationUtils } from 'src/app/utils/attestation-utils';
import { FhirFormUtils } from 'src/app/utils/fhir-form-utils';


@Component({
  selector: 'app-endpoint-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './endpoint-form-dialog.component.html',
  styleUrls: ['./endpoint-form-dialog.component.scss']
})
export class EndpointFormDialogComponent implements OnInit {

  endpoint: Endpoint;
  organizationId: string;
  endpointForm!: FormGroup;
  formMode: FormMode = FormMode.Create;
  compareContactPoints = FhirFormUtils.compareContactPoints;
  contactSystems = FhirFormUtils.getContactPointSystems();
  contactUseCases = FhirFormUtils.getContactPointUseCases();  
  isAttested = AttestationUtils.getIsAttested;  


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dialogTitle: string, endpoint: Endpoint, organizationId: string },
    private dialogRef: MatDialogRef<EndpointFormDialogComponent>, 
    private snackBar: MatSnackBar, 
    private endpointService: EndpointService,
    private organizationService: OrganizationService) {
      this.endpoint = data.endpoint;
      this.organizationId = data.organizationId;
  }

  ngOnInit(): void {
    this.formMode = this.data.endpoint ? FormMode.Edit : FormMode.Create;

    if (!this.endpoint) {
      this.endpoint = {...baseEndpoint} as Endpoint;
    }

    this.endpointForm = new FormGroup({
      id: new FormControl(this.endpoint.id, Validators.required),
      name: new FormControl(this.endpoint.name, Validators.required),
      address: new FormControl(this.endpoint.address, Validators.required),
      contact: FhirFormUtils.getContactPointFormArray(this.endpoint.contact, false),
      connectionType: FhirFormUtils.getCodingFormGroup(this.endpoint.connectionType, false),
      payloadType: FhirFormUtils.getCodeableConceptFormArray(this.endpoint.payloadType, false)
    });

  }

  get FormMode(): typeof FormMode {
    return FormMode;
  }

  get idControl() : FormControl {
    return this.endpointForm.get('id') as FormControl;
  }

  get nameControl() : FormControl {
    return this.endpointForm.get('name') as FormControl;
  }

  get addressControl() : FormControl {
    return this.endpointForm.get('address') as FormControl;
  }

  get contactForms() : FormArray {
    return this.endpointForm.get('contact') as FormArray;
  }

  addContact() {
    this.contactForms.push(FhirFormUtils.getContactPointFormGroup(undefined, false));
    this.contactForms.updateValueAndValidity();
  }

  removeContact(index: number) {
    this.contactForms.removeAt(index);
    this.contactForms.updateValueAndValidity();
  }


  get payloadTypeForms() : FormArray {
    return this.endpointForm.get('payloadType') as FormArray;
  }

  addPayloadType() {
    this.payloadTypeForms.push(FhirFormUtils.getCodeableConceptFormGroup(undefined, false));
    this.payloadTypeForms.updateValueAndValidity();
  }

  removePayloadType(index: number) {
    this.payloadTypeForms.removeAt(index);
    this.payloadTypeForms.updateValueAndValidity();
  }

  getCodingForms(payloadIndex: number) : FormArray {
    return this.payloadTypeForms.controls[payloadIndex].get('coding') as FormArray;
  }

  addCoding(payloadIndex: number) {
    this.getCodingForms(payloadIndex).push(FhirFormUtils.getCodingFormGroup(undefined, false));
    this.getCodingForms(payloadIndex).updateValueAndValidity();
  }

  removeCoding(payloadIndex: number, codingIndex: number) {
    this.getCodingForms(payloadIndex).removeAt(codingIndex);
    this.getCodingForms(payloadIndex).updateValueAndValidity();
  }



  markAttested() {
    
    const valueMeta: Meta = { security: [AttestationUtils.getNotAttestedSecurityCoding()] };

    this.endpointService.metaDelete('Endpoint', this.endpoint.id as string, valueMeta).subscribe(data => {
      if(data) {
        this.dialogRef.close(data);
      }        
      else {
        this.snackBar.open(`Failed to update Endpoint, see console for details.`, '', {
          duration: 3500,
          panelClass: 'error-snackbar',
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });

  }

  onSubmit() {

    if (!this.endpointForm.valid) {
      return;
    }

    if (!this.endpoint) {
      this.endpoint = { ...baseEndpoint } as Endpoint;
    }
    
    this.endpoint = { ...this.endpoint, ...this.endpointForm.value };
    if (!this.endpoint.meta) {
      this.endpoint.meta = { ...baseEndpoint.meta };
    }

    if (this.formMode === FormMode.Create) {
      this.endpointService.create(this.endpoint).subscribe(async data => {
        console.log(data);
        if(data) {

          await this.organizationService.addEndpoint(this.organizationId, data.id as string);

          this.dialogRef.close(data);
        }        
        else {
          this.snackBar.open(`Failed to create endpoint, see console for details.`, '', {
            duration: 3500,
            panelClass: 'error-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
    else {
      this.endpointService.update(this.endpoint.id as string, this.endpoint).subscribe(data => {
        console.log(data);
        if(data) {
          this.dialogRef.close(data);
        }        
        else {
          this.snackBar.open(`Failed to update Endpoint, see console for details.`, '', {
            duration: 3500,
            panelClass: 'error-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }

  }

}
