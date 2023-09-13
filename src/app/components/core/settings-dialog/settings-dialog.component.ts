import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfigService } from 'src/app/services/config.service';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment';
import { ThemePickerComponent } from "../theme-picker/theme-picker.component";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteItemDialogComponent } from '../delete-item-dialog/delete-item-dialog.component';

@Component({
    selector: 'app-settings-dialog',
    standalone: true,
    templateUrl: './settings-dialog.component.html',
    styleUrls: ['./settings-dialog.component.scss'],
    imports: [
        CommonModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        ThemePickerComponent
    ]
})
export class SettingsDialogComponent implements OnInit {

  settingsForm!: FormGroup;
  filteredUrls!: Observable<string[]>;

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dialog: MatDialog, 
    private snackBar: MatSnackBar,
    private configService: ConfigService) {

      this.dialogRef.updateSize('75vw');
  }

  ngOnInit(): void {
    
    this.settingsForm = new FormGroup({
      baseApiUrl: new FormControl(this.configService.baseApiUrl, Validators.required),
      includeUnattested: new FormControl(this.configService.includeUnattested, Validators.required)
    });

    this.filteredUrls = this.baseApiUrlControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUrls(value || ''))
    );
  }

  private filterUrls(value: string): Array<string> {
    const sorted = this.configService.availableBaseApiUrls.sort();
    return sorted.filter(u => u.toLowerCase().includes(value.toLowerCase()));
  }


  get baseApiUrlControl(): FormControl {
    return this.settingsForm.get('baseApiUrl') as FormControl;
  }

  get includeUnattestedControl(): FormControl {
    return this.settingsForm.get('includeUnattested') as FormControl;
  }


  reset() {
    this.baseApiUrlControl.setValue(environment.baseApiUrls[0]);
    this.includeUnattestedControl.setValue(false);
    this.settingsForm.markAsDirty();
  }


  save() {

    this.configService.baseApiUrl = this.baseApiUrlControl.value;
    this.configService.includeUnattested = this.includeUnattestedControl.value;

    this.dialogRef.close(true);
  }


  showDeleteServerDialog(url: string) {
    
    this.dialog.open(DeleteItemDialogComponent, {
      
    }).afterClosed().subscribe(async res => {
      if (res) {

        this.configService.removeAvailableBaseApiUrls(url);
        console.log('res:', res);
        this.snackBar.open(`Successfully removed ${url}`, '', {
          duration: 3500,
          panelClass: 'success-snackbar',
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        
      }

    })

    
  }


}
