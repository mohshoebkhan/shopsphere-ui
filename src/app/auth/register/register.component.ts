import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private http = inject(HttpClient);
  private router = inject(Router);

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    confirmPassword: ''
  };

  submitted = false;
  loading = false;

  register(): void {

    this.submitted = true;

    // Required field validation
    if (
      !this.registerData.firstName.trim() ||
      !this.registerData.lastName.trim() ||
      !this.registerData.email.trim() ||
      !this.registerData.password ||
      !this.registerData.mobile.trim() ||
      !this.registerData.confirmPassword
    ) {

      alert('Please fill all fields');

      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.registerData.email)) {

      alert('Please enter a valid email address');

      return;
    }

    // Mobile validation
    const mobilePattern = /^[0-9]{10}$/;

    if (!mobilePattern.test(this.registerData.mobile)) {

      alert('Mobile number must contain exactly 10 digits');

      return;
    }

    // Password validation
    if (this.registerData.password.length < 6) {

      alert('Password must be at least 6 characters');

      return;
    }

    // Confirm password validation
    if (
      this.registerData.password !==
      this.registerData.confirmPassword
    ) {

      alert('Password and Confirm Password do not match');

      return;
    }

    this.loading = true;

    // Do not send confirmPassword to backend
    const request = {
      firstName: this.registerData.firstName.trim(),
      lastName: this.registerData.lastName.trim(),
      email: this.registerData.email.trim(),
      password: this.registerData.password,
      mobile: this.registerData.mobile.trim()
    };

    this.http.post(
      `${environment.apiUrl}/users/register`,
      request
    ).subscribe({

      next: () => {

        this.loading = false;

        alert('Registration Successful');

        this.router.navigate(['/login']);

      },

      error: (error) => {

        this.loading = false;

        console.error(
          'Registration failed:',
          error
        );

        if (error.status === 409) {

          alert('Email already registered');

        } else if (error.status === 400) {

          alert(
            error.error?.message ||
            'Invalid registration details'
          );

        } else {

          alert(
            error.error?.message ||
            'Registration failed. Please try again.'
          );

        }

      }

    });

  }

  goToLogin(): void {

    this.router.navigate(['/login']);

  }

}

