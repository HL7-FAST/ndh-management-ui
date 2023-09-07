import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Meta, Organization } from 'fhir/r4';
import { FormMode } from 'src/app/models/FormMode.enum';
import { OrganizationService } from 'src/app/services/organization.service';
import { FhirFormUtils } from '../../../utils/fhir-form-utils';
import baseOrganization from '../../../../assets/fhir/Organization-ndh.json';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AttestationUtils } from 'src/app/utils/attestation-utils';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-organization-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  templateUrl: './organization-form-dialog.component.html',
  styleUrls: ['./organization-form-dialog.component.scss']
})
export class OrganizationFormDialogComponent implements OnInit {
  organization!: Organization;
  organizationForm!: FormGroup;
  formMode!: FormMode;
  compareContactPoints = FhirFormUtils.compareContactPoints;
  telecomSystems = FhirFormUtils.getContactPointSystems();
  telecomUseCases = FhirFormUtils.getContactPointUseCases();  
  identifierTypes = FhirFormUtils.getIdentifierTypes();
  compareIdentifierTypes = FhirFormUtils.compareIdentifierTypes;
  isAttested = AttestationUtils.getIsAttested;
  resetAttestedChecked = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dialogTitle: string, organization: Organization },
    private dialogRef: MatDialogRef<OrganizationFormDialogComponent>, 
    private snackBar: MatSnackBar, 
    private organizationService: OrganizationService) {
      this.organization = data.organization;
    }


  ngOnInit(): void {
    
    this.formMode = this.data.organization ? FormMode.Edit : FormMode.Create;

    if (!this.organization) {
      this.organization = {...baseOrganization} as Organization;
    }

    this.organizationForm = new FormGroup({
      id: new FormControl(this.organization.id, Validators.required),
      name: new FormControl(this.organization.name, Validators.required),
      address: FhirFormUtils.getAddressFormArray(this.organization.address, false),
      telecom: FhirFormUtils.getContactPointFormArray(this.organization.telecom, false),
      identifier: FhirFormUtils.getIdentifierFormArray(this.organization.identifier, false)
    });

    this.resetAttestedChecked = this.isAttested(this.organization);

  }


  get FormMode(): typeof FormMode {
    return FormMode;
  }

  get idControl() : FormControl {
    return this.organizationForm.get('id') as FormControl;
  }

  get nameControl() : FormControl {
    return this.organizationForm.get('name') as FormControl;
  }


  get addressForms() : FormArray {
    return this.organizationForm.get('address') as FormArray;
  }
  
  addAddress() {
    this.addressForms.push(FhirFormUtils.getAddressFormGroup(undefined, false));
    this.addressForms.updateValueAndValidity();
  }

  removeAddress(index: number) {
    this.addressForms.removeAt(index);
    this.addressForms.updateValueAndValidity();
  }

  
  get telecomForms() : FormArray {
    return this.organizationForm.get('telecom') as FormArray;
  }

  addTelecom() {
    this.telecomForms.push(FhirFormUtils.getContactPointFormGroup(undefined, false));
    this.telecomForms.updateValueAndValidity();
  }

  removeTelecom(index: number) {
    this.telecomForms.removeAt(index);
    this.telecomForms.updateValueAndValidity();
  }



  get identifierForms() : FormArray {
    return this.organizationForm.get('identifier') as FormArray;
  }  

  addIdentifier() {
    this.identifierForms.push(FhirFormUtils.getIdentifierFormGroup(undefined, false));
    this.identifierForms.updateValueAndValidity();
  }

  removeIdentifier(index: number) {
    this.identifierForms.removeAt(index);
    this.identifierForms.updateValueAndValidity();
  }


  markAttested() {
    
    const valueMeta: Meta = { security: [AttestationUtils.getNotAttestedSecurityCoding()] };

    this.organizationService.metaDelete('Organization', this.organization.id as string, valueMeta).subscribe(data => {
      console.log(data);
      if(data) {
        this.dialogRef.close(data);
      }        
      else {
        this.snackBar.open(`Failed to update Organization, see console for details.`, '', {
          duration: 3500,
          panelClass: 'error-snackbar',
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });

  }


  markUnattested() {
    
    const valueMeta: Meta = { security: [AttestationUtils.getNotAttestedSecurityCoding()] };

    this.organizationService.metaAdd('Organization', this.organization.id as string, valueMeta).subscribe(data => {
      console.log(data);
      if(data) {
        this.dialogRef.close(data);
      }        
      else {
        this.snackBar.open(`Failed to update Organization, see console for details.`, '', {
          duration: 3500,
          panelClass: 'error-snackbar',
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });

  }



  onSubmit() {

    if (!this.organizationForm.valid) {
      return;
    }

    if (!this.organization) {
      this.organization = { ...baseOrganization } as Organization;
    }
    
    this.organization = { ...this.organization, ...this.organizationForm.value };
    if (!this.organization.meta) {
      this.organization.meta = { ...baseOrganization.meta };
    }

    if (this.formMode === FormMode.Create) {
      this.organizationService.createResource('Organization', this.organization).subscribe(data => {
        console.log(data);
        if(data) {
          this.dialogRef.close(data);
        }        
        else {
          this.snackBar.open(`Failed to create organization, see console for details.`, '', {
            duration: 3500,
            panelClass: 'error-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
    else {
      this.organizationService.updateResource('Organization', this.organization.id as string, this.organization).subscribe(data => {
        console.log(data);
        if(data) {
          if (this.resetAttestedChecked) {
            this.markUnattested();
          }
          else {
            this.dialogRef.close(data);
          }
        }        
        else {
          this.snackBar.open(`Failed to update Organization, see console for details.`, '', {
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
