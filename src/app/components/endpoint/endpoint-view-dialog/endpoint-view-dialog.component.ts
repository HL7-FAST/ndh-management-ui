import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Endpoint } from 'fhir/r4';
import { EndpointService } from 'src/app/services/endpoint.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { AttestationUtils } from 'src/app/utils/attestation-utils';

@Component({
    selector: 'app-endpoint-view-dialog',
    standalone: true,
    templateUrl: './endpoint-view-dialog.component.html',
    styleUrls: ['./endpoint-view-dialog.component.scss'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatSnackBarModule,
        MatToolbarModule
    ]
})
export class EndpointViewDialogComponent {
  endpoint: Endpoint;
  organizationId: string;
  isAttested = AttestationUtils.getIsAttested;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dialogTitle: string, endpoint: Endpoint, organizationId: string },
    private dialogRef: MatDialogRef<EndpointViewDialogComponent>, 
    private snackBar: MatSnackBar, 
    private endpointService: EndpointService,
    private organizationService: OrganizationService) {
      this.endpoint = data.endpoint;
      this.organizationId = data.organizationId;
  }

}
