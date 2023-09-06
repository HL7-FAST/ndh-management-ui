import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Subject } from 'rxjs';
import { IUserProfile } from 'src/app/interfaces/user-profile.interface';
import { UserProfile } from 'src/app/models/user-pofile.model';
import { SessionStorageService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private profileKey: string = "user-profile";
  public userProfileUpdated: BehaviorSubject<UserProfile>;

  public userList: Array<UserProfile> = [
    new UserProfile('HandleAttestation', 'handle@attestation.com', 'Test', 'User1', [''], [''], ['']),
    new UserProfile('HandleAttestation2', 'handle2@attestation.com', 'Test', 'User2', [''], [''], ['']),
    new UserProfile('HandleAttestation3', 'handle3@attestation.com', 'Test', 'User3', [''], [''], [''])
  ];

  //private oauthService: OAuthService
  constructor(private sessionStorageSrv: SessionStorageService) { 
    this.userProfileUpdated = new BehaviorSubject<UserProfile>(this.getProfile());
  }

  setProfile(profile: IUserProfile) {
    this.sessionStorageSrv.storeItem(this.profileKey, JSON.stringify(profile));
    this.userProfileUpdated.next(profile);
  }

  getProfile(): IUserProfile {
    let profile = this.sessionStorageSrv.getItem(this.profileKey);

    if (profile) {
      return JSON.parse(profile) as IUserProfile;
    }
    else {
      return this.userList[0]; 
    } 

  }

}
