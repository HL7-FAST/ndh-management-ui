import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointFormDialogComponent } from './endpoint-form-dialog.component';

describe('EndpointFormDialogComponent', () => {
  let component: EndpointFormDialogComponent;
  let fixture: ComponentFixture<EndpointFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EndpointFormDialogComponent]
    });
    fixture = TestBed.createComponent(EndpointFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
