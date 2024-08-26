import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './components/core/settings-dialog/settings-dialog.component';
import { ApiLogComponent } from './components/core/api-log/api-log.component';
import { MatIconRegistry } from '@angular/material/icon';
import { UserProfile } from './models/user-pofile.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'fhir-client';
  showMenuText = true;
  apiLogCount = 0;
  userProfile?: UserProfile;
  @ViewChild('apiLogComponent') apiLogComponent!: ApiLogComponent;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  ngAfterViewInit(): void {
    this.apiLogComponent.logCount.subscribe(count => { 
      this.apiLogCount = count; 
      this.cdr.detectChanges();
    });
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
