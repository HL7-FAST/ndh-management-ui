import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { ApiLoggingService } from 'src/app/services/core/api-logging.service';
import { IApiLog } from 'src/app/interfaces/api-log.interface';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-api-log',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule
  ],
  templateUrl: './api-log.component.html',
  styleUrls: ['./api-log.component.scss']
})
export class ApiLogComponent implements OnInit {

  public apiLogs: Array<IApiLog> = [];
  public sortedLogs: Array<IApiLog> = [];
  public selectedSortBy: string = 'date';
  public selectedSortOrder: string = 'desc';
  public logCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  

  constructor(private apiLoggingService: ApiLoggingService) { }
  

  ngOnInit(): void {
    this.apiLoggingService.apiLogAddedSubject.subscribe(log => {
      if (log) {
        this.apiLogs.push(log);
        this.logCount.next(this.apiLogs.length);
        this.sortLogs();
      }
    });
  }



  clearLogs() {
    this.apiLogs = [];
    this.logCount.next(0);
  }

  sortLogs() {

    switch (this.selectedSortBy) {
      case 'date':
        if (this.selectedSortOrder === 'desc') {
          this.apiLogs.sort((a, b) => b.date.getTime() - a.date.getTime());
        } else {
          this.apiLogs.sort((a, b) => a.date.getTime() - b.date.getTime());
        }
        break;

      case 'url':
        if (this.selectedSortOrder === 'desc') {
          this.apiLogs.sort((a, b) => b.url.localeCompare(a.url));
        } else {
          this.apiLogs.sort((a, b) => a.url.localeCompare(b.url));
        }
        break;
    
      default:
        this.apiLogs.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
    }

  }

}
