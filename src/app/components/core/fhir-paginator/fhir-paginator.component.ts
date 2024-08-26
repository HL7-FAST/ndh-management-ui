import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';


export class FhirPageEvent {
  pageSize = 20;
  action?: 'next' | 'prev' | 'size';
  currentLink?: string;
}


@Component({
  selector: 'app-fhir-paginator',
  standalone: true,
  host: {
    'class': 'fhir-paginator',
    'role': 'group',
  },
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  templateUrl: './fhir-paginator.component.html',
  styleUrl: './fhir-paginator.component.scss'
})
export class FhirPaginatorComponent {

  @Input() nextLink?: string;
  @Input() prevLink?: string;
  @Input() pageSizeOptions = [5, 10, 20, 50, 100];

  @Input()
  get pageSize() {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._pageSize = value;
    this.changeDetectorRef.markForCheck();
  }
  private _pageSize = 20;


  @Output() readonly page: EventEmitter<FhirPageEvent> = new EventEmitter<FhirPageEvent>();


  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  pageSizeChanged(pageSize: number) {
    this.pageSize = pageSize;
    this.page.emit({
      action: 'size',
      pageSize: this.pageSize
    });
  }

  nextPage() {
    this.page.emit({
      action: 'next',
      pageSize: this.pageSize,
      currentLink: this.nextLink
    });
  }

  isNextDisabled() {
    return !this.nextLink;
  }

  previousPage() {
    this.page.emit({
      action: 'prev',
      pageSize: this.pageSize,
      currentLink: this.prevLink
    });
  }
  
  isPreviousDisabled() {
    return !this.prevLink;
  }

}
