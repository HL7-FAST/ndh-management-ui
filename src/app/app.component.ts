import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UserProfile } from './models/user-pofile.model';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { UserProfileService } from './services/core/user-profile.service';
import { AuthenticationService } from './services/auth/authentication.service';
import { ConfigService } from './services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './components/core/settings-dialog/settings-dialog.component';
import { Router } from '@angular/router';
import { ApiLogComponent } from './components/core/api-log/api-log.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'fhir-client';
  userProfile: UserProfile | undefined;
  showMenuText: boolean = true;
  apiLogCount: number = 0;
  @ViewChild('apiLogComponent') apiLogComponent!: ApiLogComponent;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthenticationService, private profileService: UserProfileService, private dialog: MatDialog, private router: Router, private cdr: ChangeDetectorRef) {

    this.profileService.userProfileUpdated.subscribe(profile => {
      this.userProfile = profile;
    });

  }

  ngOnInit(): void {
    this.userProfile = this.profileService.getProfile();
  }

  ngAfterViewInit(): void {
    this.apiLogComponent.logCount.subscribe(count => { 
      this.apiLogCount = count; 
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleMenuText() {
    this.showMenuText = !this.showMenuText;
  }

  showSettingsDialog($event: Event) {

    $event.stopPropagation();

    this.dialog.open(SettingsDialogComponent, {}).afterClosed().subscribe(res => {
      if (res) {
        window.location.reload();
      }
    });
  }

}
