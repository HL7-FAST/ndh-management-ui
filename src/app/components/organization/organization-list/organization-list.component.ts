import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Bundle, BundleEntry, Organization, PractitionerRole } from 'fhir/r4';
import { PaginationMetadata } from 'src/app/models/pagination-metadata.model';
import { OrganizationService } from 'src/app/services/organization.service';
import { OrganizationViewDialogComponent } from '../organization-view-dialog/organization-view-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { OrganizationFormDialogComponent } from '../organization-form-dialog/organization-form-dialog.component';
import { DeleteItemDialogComponent } from '../../core/delete-item-dialog/delete-item-dialog.component';
import basePractitionerRole from '../../../../assets/fhir/PractitionerRole-ndh.json';
import { PractitionerRoleService } from 'src/app/services/practitioner-role.service';
import { AttestationUtils } from 'src/app/utils/attestation-utils';
import { firstValueFrom } from 'rxjs';
import { UserProfileService } from 'src/app/services/core/user-profile.service';
import { IUserProfile } from 'src/app/interfaces/user-profile.interface';
import { AttestedFilterWarningComponent } from "../../core/attested-filter-warning/attested-filter-warning.component";
import { FhirPageEvent, FhirPaginatorComponent } from "../../core/fhir-paginator/fhir-paginator.component";
import { VerificationUtils } from 'src/app/utils/verification-utils';
import { VerificationDialogComponent } from '../../verification/verification-dialog/verification-dialog.component';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatToolbarModule,
    AttestedFilterWarningComponent,
    FhirPaginatorComponent,
  ],
})
export class OrganizationListComponent implements OnInit {
  pageSize = 20;
  nextLink?: string;
  prevLink?: string;

  currentUser?: IUserProfile = undefined;
  organizations: Organization[] = [];
  paginationMetadata: PaginationMetadata = new PaginationMetadata();

  displayedColumns: string[] = ['id', 'name', 'attested', 'verification', 'actions'];
  dataSource = new MatTableDataSource<BundleEntry<Organization>>(
    this.organizations
  );
  isAttested = AttestationUtils.getIsAttested;
  getVerificationStatus = VerificationUtils.getVerificationStatus;

  constructor(
    private organizationService: OrganizationService,
    private practitionerRoleService: PractitionerRoleService,
    private userProfileService: UserProfileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userProfileService.getProfile();
    this.getOrganizations();
  }

  getQueryString(): string {
    return `?_count=${this.pageSize}`;
    // return `?_count=${this.pageSize}&_has:PractitionerRole:organization:practitioner.telecom=${this.currentUser?.email}`;
  }

  getOrganizations() {
    console.log('getOrganizations', this.getQueryString());
    this.organizationService
      .searchResource('Organization', this.getQueryString())
      .subscribe((data) => this.processSearchResults(data));
  }

  async fhirPagedEvent(event: FhirPageEvent) {
    if (event.action === 'size') {
      this.pageSize = event.pageSize;
      this.getOrganizations();
    } else if (
      (event.action === 'next' || event.action === 'prev') &&
      event.currentLink
    ) {
      this.processSearchResults(
        await this.organizationService.getLink(event.currentLink)
      );
    }
  }

  processSearchResults(data: Bundle<Organization>) {
    this.organizations = [];
    this.nextLink = '';
    this.prevLink = '';

    this.organizations = (data.entry || [])
      .filter((e) => e.resource?.resourceType === 'Organization')
      .map((e) => e.resource as Organization);

    if (data.link) {
      const next = data.link.find((x) => x.relation === 'next');
      this.nextLink = next ? next.url : '';

      const prev = data.link.find((x) => x.relation === 'previous');
      this.prevLink = prev ? prev.url : '';
    }
  }

  pagedEvent(event: PageEvent) {
    if (this.pageSize != event.pageSize) {
      this.pageSize = event.pageSize;
      this.getOrganizations();
    }
  }

  showOrganizationViewDialog($event: Event, organization: Organization): void {
    this.dialog.open(OrganizationViewDialogComponent, {
      width: '75%',
      data: {
        dialogTitle: `Organization record for ${
          organization ? organization.name || organization.id : 'unknown'
        }`,
        organization: organization,
      },
    });
  }

  showCreateOrganizationDialog(): void {
    this.dialog
      .open(OrganizationFormDialogComponent, {
        width: '75%',
        data: { dialogTitle: `Create a new Organization`, organization: null },
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        if (res) {
          this.snackBar.open(`Saved Organization ${res.id}`, '', {
            duration: 3500,
            panelClass: 'success-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });

          // create PractionerRole for this new Organization
          const newPractionerRole: PractitionerRole = {
            ...basePractitionerRole,
          } as PractitionerRole;
          newPractionerRole.practitioner = {
            reference: `Practitioner/${this.currentUser?.practitioner}`,
          };
          newPractionerRole.organization = {
            reference: `Organization/${res.id}`,
          };

          this.practitionerRoleService
            .createResource('PractitionerRole', newPractionerRole)
            .subscribe((pr) => {
              if (pr) {
                this.snackBar.open(`Saved PractionerRole ${pr?.id}`, '', {
                  duration: 3500,
                  panelClass: 'success-snackbar',
                  horizontalPosition: 'end',
                  verticalPosition: 'top',
                });
              }
              this.getOrganizations();
            });
        }
      });
  }

  showEditOrganizationDialog($event: Event, organization: Organization) {
    $event.stopPropagation();

    if (organization) {
      this.dialog
        .open(OrganizationFormDialogComponent, {
          width: '75%',
          data: {
            dialogTitle: `Edit organization record for ${
              organization ? organization.name || organization.id : 'unknown'
            }`,
            organization: organization,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.getOrganizations();
            console.log('saved: ', res);
            let message = `Saved ${res?.id || 'Organization'}`;
            if (
              res?.resourceType === 'OperationOutcome' &&
              res.issue &&
              res.issue.length > 0
            ) {
              message = res.issue[0].diagnostics || message;
            }
            this.snackBar.open(message, '', {
              duration: 3500,
              panelClass: 'success-snackbar',
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          }
        });
    } else {
      this.snackBar.open(`Invalid organization resource`, '', {
        duration: 3500,
        panelClass: 'error-snackbar',
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }

  showDeleteOrganizationDialog($event: Event, organization: Organization) {
    $event.stopPropagation();

    const organizationId = organization?.id ? organization.id : '';

    if (organization && organizationId.length > 0) {
      this.dialog
        .open(DeleteItemDialogComponent, {})
        .afterClosed()
        .subscribe(async (res) => {
          if (res) {
            const prIds = await this.practitionerRoleService.getAllIds(
              'PractitionerRole',
              `?organization=${organizationId}`
            );
            if (prIds && prIds.length > 0) {
              await firstValueFrom(
                this.practitionerRoleService.deleteAllResourcesById(
                  'PractitionerRole',
                  prIds
                )
              );
            }

            this.organizationService
              .deleteResource('Organization', organizationId)
              .subscribe({
                next: () => {
                  this.getOrganizations();
                  this.snackBar.open(
                    `Successfully deleted the organization ${
                      organization ? organization.name : 'unknown'
                    }`,
                    '',
                    {
                      duration: 3500,
                      panelClass: 'success-snackbar',
                      horizontalPosition: 'end',
                      verticalPosition: 'top',
                    }
                  );
                },
                error: (err) => {
                  console.log(err);
                  this.snackBar.open(
                    `Error deleting organization ${
                      organization ? organization.name : 'unknown'
                    }.  Check console.`,
                    '',
                    {
                      duration: 3500,
                      panelClass: 'error-snackbar',
                      horizontalPosition: 'end',
                      verticalPosition: 'top',
                    }
                  );
                },
              });
          }
        });
    } else {
      this.snackBar.open(`Invalid organization id ${organizationId}`, '', {
        duration: 3500,
        panelClass: 'error-snackbar',
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }


  showVerificationDialog($event: Event, organization: Organization) {
    $event.stopPropagation();

    if (organization) {
      this.dialog.open(VerificationDialogComponent, {
        width: '75%',
        data: {
          dialogTitle: `Verify organization record for ${
            organization ? organization.name || organization.id : 'unknown'
          }`,
          resource: organization,
        },
      });
    } else {
      this.snackBar.open(`Invalid organization resource`, '', {
        duration: 3500,
        panelClass: 'error-snackbar',
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
    
  }

}
