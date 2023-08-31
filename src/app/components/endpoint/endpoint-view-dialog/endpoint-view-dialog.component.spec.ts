import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointViewDialogComponent } from './endpoint-view-dialog.component';

describe('EndpointViewDialogComponent', () => {
  let component: EndpointViewDialogComponent;
  let fixture: ComponentFixture<EndpointViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EndpointViewDialogComponent]
    });
    fixture = TestBed.createComponent(EndpointViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
