import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-attested-filter-warning',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './attested-filter-warning.component.html',
  styleUrls: ['./attested-filter-warning.component.scss']
})
export class AttestedFilterWarningComponent {

  constructor(private configService: ConfigService) { }

  get includeUnattested() {
    return this.configService.includeUnattested;
  }

}
