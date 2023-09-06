import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiLogComponent } from './api-log.component';

describe('ApiLogComponent', () => {
  let component: ApiLogComponent;
  let fixture: ComponentFixture<ApiLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApiLogComponent]
    });
    fixture = TestBed.createComponent(ApiLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
