import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfigService } from 'src/app/services/config.service';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {

  settingsForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private configService: ConfigService) {

      this.dialogRef.updateSize('75vw');
  }

  ngOnInit(): void {
    
    this.settingsForm = new FormGroup({
      baseApiUrl: new FormControl(this.configService.baseApiUrl, Validators.required),
      includeUnattested: new FormControl(this.configService.includeUnattested, Validators.required)
    });
  }


  get baseApiUrlControl(): FormControl {
    return this.settingsForm.get('baseApiUrl') as FormControl;
  }

  get includeUnattestedControl(): FormControl {
    return this.settingsForm.get('includeUnattested') as FormControl;
  }


  reset() {
    this.baseApiUrlControl.setValue(environment.baseApiUrl);
    this.includeUnattestedControl.setValue(false);
    this.settingsForm.markAsDirty();
  }


  save() {

    this.configService.baseApiUrl = this.baseApiUrlControl.value;
    this.configService.includeUnattested = this.includeUnattestedControl.value;

    this.dialogRef.close(true);
  }


}
