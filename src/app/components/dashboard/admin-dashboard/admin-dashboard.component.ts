import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class AdminDashboardComponent implements OnInit {

  serverStatuses: Array<{ url: string; status: 'pending' | 'online' | 'offline'; }> = [];

  
  constructor(private configService: ConfigService, private resourceService: ResourceService) {
  }

  ngOnInit(): void {

    this.serverStatuses = this.configService.availableBaseApiUrls.map(s => {return { url: s, status: 'pending' }});

    if (this.serverStatuses && this.serverStatuses.length > 0) {
      for (let i = 0; i < this.serverStatuses.length; i++) {
        this.resourceService.getCapabilityStatement(this.serverStatuses[i].url).subscribe({
          next: (data) => {
            if (data) {
              this.serverStatuses[i].status = 'online';
            } else {
              this.serverStatuses[i].status = 'offline';
            }
          },
          error: (err) => {
            this.serverStatuses[i].status = 'offline';
          }
        });
      };
      
    }

  }

}
