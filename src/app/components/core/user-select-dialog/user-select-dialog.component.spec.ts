import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectDialogComponent } from './user-select-dialog.component';

describe('UserSelectDialogComponent', () => {
  let component: UserSelectDialogComponent;
  let fixture: ComponentFixture<UserSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
