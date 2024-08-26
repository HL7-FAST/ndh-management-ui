import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserProfile } from 'src/app/models/user-pofile.model';
import { UserProfileService } from 'src/app/services/core/user-profile.service';

@Component({
  selector: 'app-user-select-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './user-select-dialog.component.html',
  styleUrl: './user-select-dialog.component.scss'
})
export class UserSelectDialogComponent implements OnInit {

  availableUserProfiles: UserProfile[] = [];
  currentUserProfile?: UserProfile;
  
  constructor(
    private profileService: UserProfileService
  ) {}

  ngOnInit(): void {

    this.availableUserProfiles = this.profileService.userList;
    this.profileService.userProfileUpdated.subscribe(profile => {
      this.currentUserProfile = profile;
    });

  }

  selectUserProfile(userProfile: UserProfile) {
    if (this.currentUserProfile === userProfile) {
      return;
    }
    this.profileService.setProfile(userProfile);
    window.location.reload();
  }

}
