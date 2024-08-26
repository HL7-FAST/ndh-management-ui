import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUserProfile } from 'src/app/interfaces/user-profile.interface';
import { UserProfile } from 'src/app/models/user-pofile.model';
import { SessionStorageService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private profileKey = 'user-profile';
  public userProfileUpdated: BehaviorSubject<UserProfile|undefined>;

  public userList: UserProfile[] = [
    new UserProfile('addy.admin@example.123', 'Addy', 'Admin', ['admin'], '', [], 'User with admin role'),
    new UserProfile('hanssolo@examplepract.123', 'Hans', 'Solo', [], 'HansSolo', [], 'Practioner with ID of "HansSolo"'),
    new UserProfile('joesmith@examplepract.123', 'Joe', 'Smith', [], 'JoeSmith', [], 'Practitioner with ID of "JoeSmith"'),
    new UserProfile('olivia.org@exampleorg.123', 'Olivia', 'Organization', ['org-admin'], '', ['Network1'], 'Admin for Organization with ID of "Network1"')
  ];

  constructor(private sessionStorageSrv: SessionStorageService) {
    this.userProfileUpdated = new BehaviorSubject<UserProfile|undefined>(
      this.getProfile()
    );
  }

  clearProfile() {
    this.sessionStorageSrv.removeItem(this.profileKey);
    this.userProfileUpdated.next(undefined);
  }

  setProfile(profile: IUserProfile) {
    this.sessionStorageSrv.storeItem(this.profileKey, JSON.stringify(profile));
    this.userProfileUpdated.next(profile);
  }

  getProfile(): IUserProfile | undefined {
    const profile = this.sessionStorageSrv.getItem(this.profileKey);

    if (profile) {
      return JSON.parse(profile) as IUserProfile;
    } 
    
    return undefined;
    // return this.userList[0];
  }
}
