import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationFormDialogComponent } from './organization-form-dialog.component';

describe('OrganizationFormDialogComponent', () => {
  let component: OrganizationFormDialogComponent;
  let fixture: ComponentFixture<OrganizationFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationFormDialogComponent]
    });
    fixture = TestBed.createComponent(OrganizationFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
