import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationViewDialogComponent } from './organization-view-dialog.component';

describe('OrganizationViewDialogComponent', () => {
  let component: OrganizationViewDialogComponent;
  let fixture: ComponentFixture<OrganizationViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationViewDialogComponent]
    });
    fixture = TestBed.createComponent(OrganizationViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
