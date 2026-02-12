import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ResetPasswordComponent } from './reset-password.component';
import { HttpService } from '../utils/httpService';
import { MatchPasswordDirective } from '../directives/match-password.directive';


describe('ResetPasswordComponent with email empty', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  let httpServiceMock: jest.Mocked<HttpService>;
  let routerMock: jest.Mocked<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    // Create mocks
    httpServiceMock = {
      post: jest.fn(),
      getErrorMessage: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    routerMock = {
      navigate: jest.fn(),
      url: '/reset-password#token123',
    } as unknown as jest.Mocked<Router>;

    activatedRouteMock = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent, MatchPasswordDirective],
      imports: [
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        {provide: HttpService, useValue: httpServiceMock},
        {provide: Router, useValue: routerMock},
        {provide: ActivatedRoute, useValue: activatedRouteMock},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

    it('should initialize in request mode when no email in query params', () => {

      fixture.detectChanges();
      expect(component.isResetMode).toBe(false);
      expect(component.formData.email).toBe('');
    });
});

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let httpServiceMock: jest.Mocked<HttpService>;
  let routerMock: jest.Mocked<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    // Create mocks
    httpServiceMock = {
      post: jest.fn(),
      getErrorMessage: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    routerMock = {
      navigate: jest.fn(),
      url: '/reset-password#token123',
    } as unknown as jest.Mocked<Router>;

    activatedRouteMock = {
      queryParams: of({ email: 'test@example.com' }),
    };

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent, MatchPasswordDirective],
      imports: [
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize in reset mode when email is in query params', () => {
      fixture.detectChanges();
      expect(component.isResetMode).toBe(true);
      expect(component.formData.email).toBe('test@example.com');
      expect(component.verificationToken).toBe('token123');
    });
  });

  describe('Password Reset Request', () => {
    it('should send reset password email and navigate to confirmation page on success', () => {
      component.formData.email = 'test@example.com';
      httpServiceMock.post.mockReturnValue(of({ success: true }));

      component.sentMailResetPasswordSubmit();

      expect(httpServiceMock.post).toHaveBeenCalledWith(
        component.url,
        'test@example.com'
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/confirmation-sent-mail-reset-password']);
    });

    it('should navigate to password-reset page on error', () => {
      component.formData.email = 'test@example.com';
      httpServiceMock.post.mockReturnValue(throwError(() => new Error('Error')));

      component.sentMailResetPasswordSubmit();

      expect(httpServiceMock.post).toHaveBeenCalledWith(
        component.url,
        'test@example.com'
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/password-reset']);
    });
  });

  describe('Password Update', () => {
    beforeEach(() => {
      component.isResetMode = true;
      component.formData.email = 'test@example.com';
      component.verificationToken = 'token123';
    });

    it('should update password and navigate to login page on success', () => {
      component.formData.password = 'newPassword123';
      component.formData.confirmPassword = 'newPassword123';
      httpServiceMock.post.mockReturnValue(of({ success: true }));

      component.updatePasswordSubmit();

      expect(httpServiceMock.post).toHaveBeenCalledWith(
        component.updatePasswordUrl,
        {
          email: 'test@example.com',
          password: 'newPassword123',
          verificationToken: 'token123',
        }
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should not submit if passwords do not match', () => {
      component.formData.password = 'newPassword123';
      component.formData.confirmPassword = 'differentPassword';

      component.updatePasswordSubmit();

      expect(component.errorMessages).toContain('Les mots de passe ne correspondent pas');
      expect(httpServiceMock.post).not.toHaveBeenCalled();
    });

    it('should handle error during password update', () => {
      component.formData.password = 'newPassword123';
      component.formData.confirmPassword = 'newPassword123';
      httpServiceMock.post.mockReturnValue(throwError(() => new Error('Error')));

      component.updatePasswordSubmit();

      expect(httpServiceMock.post).toHaveBeenCalled();
      // We're just checking that it doesn't crash and logs the error
    });
  });

  describe('UI Interactions', () => {
    it('should toggle password visibility', () => {
      expect(component.showPass).toBe(false);
      component.showPassword();
      expect(component.showPass).toBe(true);
      component.showPassword();
      expect(component.showPass).toBe(false);
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPass).toBe(false);
      component.showConfirmPassword();
      expect(component.showConfirmPass).toBe(true);
      component.showConfirmPassword();
      expect(component.showConfirmPass).toBe(false);
    });
  });
});
