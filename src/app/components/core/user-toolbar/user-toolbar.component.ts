import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserProfile } from 'src/app/models/user-pofile.model';
import { UserProfileService } from 'src/app/services/core/user-profile.service';
import { UserSelectDialogComponent } from '../user-select-dialog/user-select-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-toolbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './user-toolbar.component.html',
  styleUrl: './user-toolbar.component.scss'
})
export class UserToolbarComponent implements OnInit {

  currentUserProfile?: UserProfile;

  constructor(
    private dialog: MatDialog,
    private profileService: UserProfileService
  ) {}


  ngOnInit(): void {
    this.profileService.userProfileUpdated.subscribe(profile => {
      this.currentUserProfile = profile
    });
  }

  openUserSelectDialog() {
    this.dialog.open(UserSelectDialogComponent);
  }

  logout() {
    this.profileService.clearProfile();
    window.location.reload();
  } 


}
