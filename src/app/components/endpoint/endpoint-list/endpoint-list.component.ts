import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Bundle, Endpoint, Organization } from 'fhir/r4';
import { PaginationMetadata } from 'src/app/models/pagination-metadata.model';
import { OrganizationService } from 'src/app/services/organization.service';
import { MatSelectModule } from '@angular/material/select';
import { EndpointService } from 'src/app/services/endpoint.service';
import { AttestationUtils } from 'src/app/utils/attestation-utils';
import { DeleteItemDialogComponent } from '../../core/delete-item-dialog/delete-item-dialog.component';
import { EndpointViewDialogComponent } from '../endpoint-view-dialog/endpoint-view-dialog.component';
import { EndpointFormDialogComponent } from '../endpoint-form-dialog/endpoint-form-dialog.component';
import { IUserProfile } from 'src/app/interfaces/user-profile.interface';
import { UserProfileService } from 'src/app/services/core/user-profile.service';
import { AttestedFilterWarningComponent } from "../../core/attested-filter-warning/attested-filter-warning.component";

@Component({
    selector: 'app-endpoint-list',
    standalone: true,
    templateUrl: './endpoint-list.component.html',
    styleUrls: ['./endpoint-list.component.scss'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTableModule,
        MatSnackBarModule,
        MatToolbarModule,
        AttestedFilterWarningComponent
    ]
})
export class EndpointListComponent implements OnInit {
  endpoints: Array<Endpoint> = [];
  organizations: Array<Organization> = [];
  selectedOrganizationId: string = '';
  pageSize: number = 20;
  pageNumber: number = 0;
  totalCount: number = 0;
  currentUser?: IUserProfile = undefined;
  nextLink: string = '';
  prevLink: string = '';
  paginationMetadata: PaginationMetadata = new PaginationMetadata;

  displayedColumns: string[] = [ 'id', 'name', 'attested', 'actions' ];
  isAttested = AttestationUtils.getIsAttested;

  _defaultLink: string = '';
  get defaultLink(): string {
    return `?_count=${this.pageSize}&_total=accurate&_has:Organization:endpoint:_id=${this.selectedOrganizationId}`;
  }
  set defaultLink(newLink: string) {
    this._defaultLink = newLink;
  }





  constructor(private endpointService: EndpointService, private organizationService: OrganizationService, private userProfileService: UserProfileService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {

    this.userProfileService.userProfileUpdated.subscribe(async profile => {
      this.currentUser = profile;
      this.endpoints = [];
      this.organizations = [];
      this.selectedOrganizationId = '';

      this.organizations = await this.organizationService.getAll(`?_has:PractitionerRole:organization:practitioner.telecom=${this.currentUser.email}&_sort=name&_summary=true`);

      if (this.organizations && this.organizations.length > 0) {
        this.selectedOrganizationId = this.organizations[0].id as string;
        this.getEndpoints();
      }
    });
    
    

  }

  getEndpoints(queryString?: string) {

    this.endpoints = [];

    if (!queryString) {
      queryString = this.defaultLink;
    }

    this.endpointService.search(queryString).subscribe(data => {
      this.endpoints = (data.entry || []).map(e => e.resource as Endpoint);

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
      this.defaultLink = `?_count=${this.pageSize}`;
      this.getEndpoints(this.defaultLink);
    }
    else if(this.pageNumber < event.pageSize) {
      this.getEndpoints(this.nextLink);
    }
    else {
      this.getEndpoints(this.prevLink);
    }
  }


  showEndpointViewDialog($event: Event, endpoint: Endpoint) : void {
    this.dialog.open(EndpointViewDialogComponent,
      {
        width: '75%',
        data: { dialogTitle: `Endpoint record for ${endpoint ? endpoint.name : 'unknown'}`, endpoint: endpoint }
      });
  }


  showCreateEndpointDialog(): void {
    this.dialog.open(EndpointFormDialogComponent,
      {
        width: '75%',
        data: { dialogTitle: `Create a new Endpoint`, endpoint: null, organizationId: this.selectedOrganizationId }
      }).afterClosed().subscribe(res => {
        console.log(res);
        if (res) {
          this.getEndpoints();
          this.snackBar.open(`Saved Endpoint ${res.id}`, '', {
            duration: 3500,
            panelClass: 'success-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });         
        }
      });
  }

  showEditEndpointDialog($event: Event, endpoint: Endpoint) {
    $event.stopPropagation();

    if (endpoint) {
      this.dialog.open(EndpointFormDialogComponent,{
        width: '75%',
        data: { dialogTitle: `Edit endpoint record for ${endpoint ? endpoint.name : 'unknown'}`, endpoint: endpoint, organizationId: this.selectedOrganizationId }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.getEndpoints();
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

  showDeleteEndpointDialog($event: Event, endpoint: Endpoint) {
    $event.stopPropagation();

    let endpointId = endpoint?.id ? endpoint.id : '';

    if (endpoint && endpointId.length > 0) {
      this.dialog.open(DeleteItemDialogComponent, {
      }).afterClosed().subscribe(async res => {
        if (res) {

          await this.organizationService.removeEndpoint(this.selectedOrganizationId, endpointId);
          
          this.endpointService.delete(endpointId).subscribe({
            next: async (outcome) => {

              this.getEndpoints();
              this.snackBar.open(`Successfully deleted the endpoint ${endpoint ? endpoint.name : 'unknown'}`, '', {
                duration: 3500,
                panelClass: 'success-snackbar',
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }, 
            error: (err) => {
              console.log(err);
              this.snackBar.open(`Error deleting endpoint ${endpoint ? endpoint.name : 'unknown'}.  Check console.`, '', {
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
      this.snackBar.open(`Invalid organization id ${endpointId}`, '', {
        duration: 3500,
        panelClass: 'error-snackbar',
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }


}
