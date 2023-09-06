import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestedFilterWarningComponent } from './attested-filter-warning.component';

describe('AttestedFilterWarningComponent', () => {
  let component: AttestedFilterWarningComponent;
  let fixture: ComponentFixture<AttestedFilterWarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AttestedFilterWarningComponent]
    });
    fixture = TestBed.createComponent(AttestedFilterWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
