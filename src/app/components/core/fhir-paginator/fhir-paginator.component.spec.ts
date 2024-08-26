import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirPaginatorComponent } from './fhir-paginator.component';

describe('FhirPaginatorComponent', () => {
  let component: FhirPaginatorComponent;
  let fixture: ComponentFixture<FhirPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FhirPaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FhirPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
