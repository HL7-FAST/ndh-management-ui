import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ConfigService } from 'src/app/services/config.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ResourceService } from 'src/app/services/core/resource.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements AfterViewInit {

  currentFhirServer: string = '';
  serverIsOnline: boolean = false;

  
  constructor(private configService: ConfigService, private resourceService: ResourceService) {
  }

  ngAfterViewInit(): void {
    
    this.currentFhirServer = this.configService.baseApiUrl;
    this.serverIsOnline = false;

    if (this.currentFhirServer) {
      this.resourceService.getCapabilityStatement(this.currentFhirServer).subscribe(data => {
        if (data) {
          this.serverIsOnline = true;
        } else {
          this.serverIsOnline = false;
        }
      });
    }

  }

}
