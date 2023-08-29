import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Organization, Patient } from 'fhir/r4';
import { PatientService } from 'src/app/services/patient.service';
import { PatientViewDialogComponent } from '../../patient/patient-view-dialog/patient-view-dialog.component';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-organization-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,  
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  templateUrl: './organization-view-dialog.component.html',
  styleUrls: ['./organization-view-dialog.component.scss']
})
export class OrganizationViewDialogComponent {
  organization!: Organization;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dialogTitle: string, organization: Organization },
    private dialogRef: MatDialogRef<OrganizationViewDialogComponent>, 
    private snackBar: MatSnackBar, 
    private organizationService: OrganizationService) {
      this.organization = data.organization;
  }
}
