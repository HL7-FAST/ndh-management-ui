import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Bundle, BundleEntry, DomainResource, Organization, PractitionerRole } from 'fhir/r4';
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
import { ApiLogComponent } from '../../core/api-log/api-log.component';
import { UserProfileService } from 'src/app/services/core/user-profile.service';
import { IUserProfile } from 'src/app/interfaces/user-profile.interface';
import { AttestedFilterWarningComponent } from "../../core/attested-filter-warning/attested-filter-warning.component";

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
        MatPaginatorModule,
        MatTableModule,
        MatSnackBarModule,
        MatToolbarModule,
        AttestedFilterWarningComponent
    ]
})
export class OrganizationListComponent implements OnInit {
  pageSize: number = 20;
  pageNumber: number = 0;
  totalCount: number = 0;
  nextLink: string = '';
  prevLink: string = '';

  currentUser?: IUserProfile = undefined;
  organizations: Array<Organization> = [];
  paginationMetadata: PaginationMetadata = new PaginationMetadata;

  displayedColumns: string[] = [ 'id', 'name', 'attested', 'actions' ];
  dataSource = new MatTableDataSource<BundleEntry<Organization>>(this.organizations);
  isAttested = AttestationUtils.getIsAttested;


  
  constructor(private organizationService: OrganizationService, private practitionerRoleService: PractitionerRoleService, private userProfileService: UserProfileService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.getOrganizations(this.defaultLink);
  }


  ngOnInit(): void {
    this.userProfileService.userProfileUpdated.subscribe(profile => {
      this.currentUser = profile;
      this.getOrganizations(this.defaultLink);
    });
  }


  get defaultLink(): string {
    return `?_count=${this.pageSize}&_total=accurate&_has:PractitionerRole:organization:practitioner.telecom=${this.currentUser?.email}`;
  }
  

  getOrganizations(queryString: string) {
    this.organizations = [];

    if (!this.currentUser) {
      return;
    }

    this.organizationService.searchResource('Organization', queryString).subscribe((data: Bundle<Organization>) => {
      this.organizations = (data.entry || [])
        .filter(e => e.resource?.resourceType === 'Organization')
        .map(e => e.resource as Organization);

      this.totalCount = data.total ? data.total : 0;
      
      if(data.link) {
        let next = data.link.find(x => x.relation === "next");
        this.nextLink = next ? next.url : '';

        let prev = data.link.find(x => x.relation === "previous");
        this.prevLink = prev ? prev.url : '';
      }      
    });
  }


  pagedEvent(event: PageEvent) {
    if(this.pageSize != event.pageSize) {
      this.pageNumber = 0;
      this.pageSize = event.pageSize;
      this.getOrganizations(this.defaultLink);
    }
    else if(this.pageNumber < event.pageSize) {
      this.getOrganizations(this.nextLink);
    }
    else {
      this.getOrganizations(this.prevLink);
    }
  }


  showOrganizationViewDialog($event: Event, organization: Organization) : void {

    this.dialog.open(OrganizationViewDialogComponent,
      {
        width: '75%',
        data: { dialogTitle: `Organization record for ${organization ? organization.name : 'unknown'}`, organization: organization }
      });
  }

  showCreateOrganizationDialog() : void {

    this.dialog.open(OrganizationFormDialogComponent,
      {
        width: '75%',
        data: { dialogTitle: `Create a new Organization`, organization: null }
      }).afterClosed().subscribe(res => {
        console.log(res);
        if (res) {
          this.snackBar.open(`Saved Organization ${res.id}`, '', {
            duration: 3500,
            panelClass: 'success-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          // create PractionerRole for this new Organization
          const newPractionerRole: PractitionerRole = {...basePractitionerRole} as PractitionerRole;
          newPractionerRole.practitioner = { reference: `Practitioner/${this.currentUser?.username}` };
          newPractionerRole.organization = { reference: `Organization/${res.id}` };

          this.practitionerRoleService.createResource('PractitionerRole', newPractionerRole).subscribe(pr => {
            if (pr) {
              this.snackBar.open(`Saved PractionerRole ${pr?.id}`, '', {
                duration: 3500,
                panelClass: 'success-snackbar',
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }
            this.getOrganizations(this.defaultLink);
          });          
        }
      });
  }

  showEditOrganizationDialog($event: Event, organization: Organization) {

    $event.stopPropagation();

    if (organization) {
      this.dialog.open(OrganizationFormDialogComponent,{
        width: '75%',
        data: { dialogTitle: `Edit organization record for ${organization ? organization.name : 'unknown'}`, organization: organization }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.getOrganizations(this.defaultLink);
          this.snackBar.open(`Saved ${res?.id}`, '', {
            duration: 3500,
            panelClass: 'success-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
    else {
      this.snackBar.open(`Invalid organization resource`, '', {
        duration: 3500,
        panelClass: 'error-snackbar',
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }

  }

  showDeleteOrganizationDialog($event: Event, organization: Organization) {

    $event.stopPropagation();

    let organizationId = organization?.id ? organization.id : '';

    if (organization && organizationId.length > 0) {
      this.dialog.open(DeleteItemDialogComponent, {
      }).afterClosed().subscribe(async res => {
        if (res) {

          let prIds = await this.practitionerRoleService.getAllIds('PractitionerRole', `?organization=${organizationId}`);
          if (prIds && prIds.length > 0) {
            await firstValueFrom(this.practitionerRoleService.deleteAllResourcesById('PractitionerRole', prIds));
          }
          
          this.organizationService.deleteResource('Organization', organizationId).subscribe({
            next: (outcome) => {
              this.getOrganizations(this.defaultLink);
              this.snackBar.open(`Successfully deleted the organization ${organization ? organization.name : 'unknown'}`, '', {
                duration: 3500,
                panelClass: 'success-snackbar',
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }, 
            error: (err) => {
              console.log(err);
              this.snackBar.open(`Error deleting organization ${organization ? organization.name : 'unknown'}.  Check console.`, '', {
                duration: 3500,
                panelClass: 'error-snackbar',
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }
          });
        }
      });
    }
    else {
      this.snackBar.open(`Invalid organization id ${organizationId}`, '', {
        duration: 3500,
        panelClass: 'error-snackbar',
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }


  

}
