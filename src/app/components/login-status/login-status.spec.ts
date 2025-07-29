import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStatus } from './login-status';

describe('LoginStatus', () => {
  let component: LoginStatus;
  let fixture: ComponentFixture<LoginStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
