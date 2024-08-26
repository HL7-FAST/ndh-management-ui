import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Bundle, DomainResource, Reference, VerificationResult } from 'fhir/r4';
import { UserProfileService } from 'src/app/services/core/user-profile.service';
import { VerificationService } from 'src/app/services/verification.service';
import { FhirPageEvent, FhirPaginatorComponent } from "../../core/fhir-paginator/fhir-paginator.component";

@Component({
  selector: 'app-verification-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    FhirPaginatorComponent
],
  templateUrl: './verification-dialog.component.html',
  styleUrl: './verification-dialog.component.scss'
})
export class VerificationDialogComponent implements OnInit {

  pageSize = 20;
  nextLink?: string;
  prevLink?: string;

  resource!: DomainResource;
  verificationResults: VerificationResult[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dialogTitle: string, resource: DomainResource },
    private dialogRef: MatDialogRef<VerificationDialogComponent>, 
    private snackBar: MatSnackBar,
    private userProfilesService: UserProfileService,
    private verificationService: VerificationService
  ) {
    this.resource = data.resource;
  }


  ngOnInit(): void {
    console.log('VerificationDialogComponent initialized', this.resource);

    if (!this.resource || !this.resource.id) {
      this.snackBar.open('Resource ID is required', 'Dismiss', {
        duration: 5000
      });
      this.dialogRef.close();
      return;
    }

    this.getResults();
  }

  getResults() {

    this.verificationResults = [];

    if (!this.resource.id) {
      return;
    }

    this.verificationService.getForTarget(this.resource.resourceType, this.resource.id).subscribe(data => {
      this.processSearchResults(data);
    });
  }

  async fhirPagedEvent(event: FhirPageEvent) {
    if (event.action === 'size') {
      this.pageSize = event.pageSize;
      this.getResults();
    } else if (
      (event.action === 'next' || event.action === 'prev') &&
      event.currentLink
    ) {
      this.processSearchResults(
        await this.verificationService.getLink(event.currentLink)
      );
    }
  }

  processSearchResults(data: Bundle<VerificationResult>) {
    this.verificationResults = [];
    this.nextLink = '';
    this.prevLink = '';

    this.verificationResults = (data.entry || [])
      .filter((e) => e.resource?.resourceType === 'VerificationResult')
      .map((e) => e.resource as VerificationResult);

    if (data.link) {
      const next = data.link.find((x) => x.relation === 'next');
      this.nextLink = next ? next.url : '';

      const prev = data.link.find((x) => x.relation === 'previous');
      this.prevLink = prev ? prev.url : '';
    }
  }


  verify() {

    const userProfile = this.userProfilesService.getProfile();
    let attestor: string | undefined;
    if (userProfile?.practitioner) {
      attestor = `Practitioner/${userProfile.practitioner}`;
    }
    else if (userProfile?.organizations && userProfile.organizations.length > 0) {
      attestor = `Organization/${userProfile.organizations[0]}`;
    }
    else if ((userProfile?.roles || []).some(r => r === 'admin')) {
      attestor = 'Organization/admin';
    }

    const parameters = this.verificationService.getParameters(`${this.resource.resourceType}/${this.resource.id}`, attestor);

    this.verificationService.verify(parameters).subscribe({
      next: (data) => {
        console.log('VerificationDialogComponent verify data', data);
        this.getResults();
      },
      error: (err) => {
        console.error('VerificationDialogComponent verify error', err);
        this.snackBar.open('Error verifying resource.  Check console for error.', 'Dismiss', {
          duration: 5000
        });
      }
    });

  }

}
